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

    # Load existing
    if os.path.exists(LOOKS_FILE):
        with open(LOOKS_FILE, 'r') as f:
            saved_looks = json.load(f)
    else:
        saved_looks = []

    # Add new look
    saved_looks.append(data)

    # Save back to file
    with open(LOOKS_FILE, 'w') as f:
        json.dump(saved_looks, f)

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

        # Extract profile info, products, etc., as needed
        location = data.get('location')
        date = data.get('date')
        skin_conditions = data.get('skinConditions', [])
        allergies = data.get('allergies', [])
        preferred_brands = data.get('preferredBrands', [])
        occasions = data.get('occasions', [])
        budget = data.get('budget', [])

        # Call weather API to get the relevant weather data
        weather_data = get_weather_for_datetime(location, date)
        if not weather_data:
            return jsonify({'status': 'error', 'message': 'Weather data unavailable'}), 400

        # Construct prompt excluding selected products (if needed)
        prompt = f"""
        Recommend a 8 step routine using budget-appropriate products with name and descriptions, avoiding allergens, based on the provided profile and weather information.
        
        User Profile:
        - Skin Conditions: {', '.join(skin_conditions)}
        - Allergies: {', '.join(allergies)}
        - Preferred Brands: {', '.join(preferred_brands)}
        - Occasion: {', '.join(occasions)}
        - Budget: {', '.join(budget)}
        - Location: {location}
        - Date: {date}

        Weather Forecast:
        - Temperature: {weather_data['Temperature']}
        - Humidity: {weather_data['Humidity']}
        - Condition: {weather_data['Condition']}
        - Cloudiness: {weather_data['Cloudiness']}
        - Sun Level: {weather_data['Sun Level']}
        - Chance of Precipitation: {weather_data['Chance of Precipitation']}

        Based on this, recommend a new set of products.
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
        return jsonify({'status': 'success', 'recommendation': generated_text})

    except Exception as e:
        print("Error in generate-look:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500


     

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5001)
