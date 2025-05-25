from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
from openai import OpenAI
import os
import json

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

API_KEY = '055ba1fe5fdf65a6ec808306a73b4773'

def get_weather_for_datetime(city, target_datetime_str):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=imperial"
    response = requests.get(url).json()

    if response.get("cod") != "200":
        print("Error:", response.get("message"))
        return

    target_dt = datetime.fromisoformat(target_datetime_str)
    closest = None
    smallest_diff = float('inf')

    for entry in response['list']:
        entry_dt = datetime.fromisoformat(entry['dt_txt'])
        diff = abs((entry_dt - target_dt).total_seconds())
        if diff < smallest_diff:
            smallest_diff = diff
            closest = entry

    if closest: 
        weather_info = {
            "Weather for": city,
            "Closest forecast time": closest['dt_txt'],
            "Temperature": f"{closest['main']['temp']} °F",
            "Humidity": f"{closest['main']['humidity']}%",
            "Condition": closest['weather'][0]['description'],
            "Cloudiness": f"{closest['clouds']['all']}%",
            "Sun Level": "high" if closest['clouds']['all'] < 25 else "low",
            "Chance of Precipitation": f"{closest.get('pop', 0) * 100}%",
        }
        return weather_info
    else:
        print("No weather data found.")

@app.before_request
def log_request_info():
    print('📥 Incoming Request')
    print('🔍 Headers:', request.headers)
    print('🔍 Body:', request.get_data())

@app.route('/save-profile', methods=['POST'])
def save_profile():
    data = request.get_json()
    print("Received:", data)
    return jsonify({'status': 'success'}) 


LOOKS_FILE = 'saved_looks.json'

@app.route('/save-look', methods=['POST'])
def save_look():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400

    # No required fields; just append and save whatever was sent
    if os.path.exists(LOOKS_FILE):
        with open(LOOKS_FILE, 'r') as f:
            saved_looks = json.load(f)
    else:
        saved_looks = []

    saved_looks.append(data)

    with open(LOOKS_FILE, 'w') as f:
        json.dump(saved_looks, f, indent=2)

    return jsonify({'message': 'Look saved successfully!'}), 200

@app.route('/get-looks', methods=['GET'])
def get_looks():
    if not os.path.exists(LOOKS_FILE):
        return jsonify([])
    with open(LOOKS_FILE, 'r') as f:
        looks = json.load(f)
    return jsonify(looks)

@app.route('/generate-look', methods=['POST'])
def generate_look():
    try:
        data = request.get_json()
        print("Received look request:", data)

        location = data.get('location')
        date = data.get('date')
        skin_conditions = data.get('skinConditions', [])
        allergies = data.get('allergies', [])
        preferred_brands = data.get('preferredBrands', [])
        occasions = data.get('occasions', [])
        budget = data.get('budget', [])

        weather_data = get_weather_for_datetime(location, date)
        if not weather_data:
            return jsonify({'status': 'error', 'message': 'Weather data unavailable'}), 400

        prompt = f"""
        You are a beauty assistant. Based on the following user profile, suggest a personalized makeup and some skincare routine that is suitable for the occasion and weather.

        User Profile:
        -  Skin Conditions: {', '.join(data.get('skinConditions', []))}
        - Allergies: {', '.join(data.get('allergies', []))}
        - Preferred Brands: {data.get('preferredBrands', 'N/A')}
        - Occasion: {', '.join(data.get('occasions', []))}
        - Budget: {', '.join(data.get('budget', []))}
        - Location: {location}
        - Date: {date}

        Weather Forecast:
        - Temperature: {weather_data['Temperature']}
        - Humidity: {weather_data['Humidity']}
        - Condition: {weather_data['Condition']}
        - Cloudiness: {weather_data['Cloudiness']}
        - Sun Level: {weather_data['Sun Level']}
        - Chance of Precipitation: {weather_data['Chance of Precipitation']}

        Recommend a only 8 step makeup routine using budget-appropriate products with name and descriptions, avoiding allergens. Make the tone friendly and professional. Try to include preferred brands but it should not include only them.
        The format should be [Product]: [Product Description] - [Instructions]. Give only the steps/instructions and NOTHING else"
        """.strip()

        ai_response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful beauty assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )

        generated_text = ai_response.choices[0].message.content
        print(generated_text)
        return jsonify({'status': 'success', 'recommendation': generated_text})

    except Exception as e:
        print("Error in generate-look:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/delete-look', methods=['POST'])
def delete_look():
    data = request.get_json()
    index = data.get('index')

    if index is None:
        return jsonify({'error': 'Missing index'}), 400

    if not os.path.exists(LOOKS_FILE):
        return jsonify({'error': 'No looks to delete'}), 400

    with open(LOOKS_FILE, 'r') as f:
        saved_looks = json.load(f)

    if index < 0 or index >= len(saved_looks):
        return jsonify({'error': 'Invalid index'}), 400

    deleted = saved_looks.pop(index)

    with open(LOOKS_FILE, 'w') as f:
        json.dump(saved_looks, f)

    return jsonify({'message': 'Look deleted', 'deleted': deleted}), 200

@app.route('/regenerate-look', methods=['POST'])
def regenerate_look():
    try:
        data = request.get_json()
        disliked_products = data.get('dislikedProducts', [])
        location = data.get('location')
        date = data.get('date')
        skin_conditions = data.get('skinConditions', [])
        allergies = data.get('allergies', [])
        preferred_brands = data.get('preferredBrands', [])
        occasions = data.get('occasions', [])
        budget = data.get('budget', [])

        weather_data = get_weather_for_datetime(location, date)
        if not weather_data:
            return jsonify({'status': 'error', 'message': 'Weather data unavailable'}), 400

        prompt = f"""
        You are a helpful beauty assistant.

        Based on the user's profile and weather, suggest an alternative 8-step makeup routine.
        Do not include any of the following disliked products: {', '.join(disliked_products)}.

        Skin Conditions: {', '.join(skin_conditions)}
        Allergies: {', '.join(allergies)}
        Preferred Brands: {', '.join(preferred_brands)}
        Occasion: {', '.join(occasions)}
        Budget: {', '.join(budget)}
        Location: {location}
        Date: {date}

        Weather Forecast:
        - Temperature: {weather_data['Temperature']}
        - Humidity: {weather_data['Humidity']}
        - Condition: {weather_data['Condition']}
        - Cloudiness: {weather_data['Cloudiness']}
        - Sun Level: {weather_data['Sun Level']}
        - Chance of Precipitation: {weather_data['Chance of Precipitation']}

        Format: [Product]: [Product Description] - [Instructions]
        Only return the routine and nothing else.
        """

        ai_response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful beauty assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )

        new_routine = ai_response.choices[0].message.content
        return jsonify({'status': 'success', 'recommendation': new_routine})
    
    except Exception as e:
        print("Error in regenerate-look:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5001)
