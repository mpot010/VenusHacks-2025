from flask import Flask, request, jsonify
import requests
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

API_KEY = '055ba1fe5fdf65a6ec808306a73b4773'

def get_weather_for_datetime(city, target_datetime_str, api_key):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=imperial"
    response = requests.get(url).json()
    
    if response.get("cod") != "200":
        return {"error": response.get('message')}

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
        weather_data = {
            "datetime": closest['dt_txt'],
            "temp": closest['main']['temp'],
            "humidity": closest['main']['humidity'],
            "description": closest['weather'][0]['description'],
            "sun_level": "high" if closest['clouds']['all'] < 25 else "low",
            "precip": closest.get('pop', 0)
        }
        return weather_data
    else:
        return {"error": "No weather data found."}

@app.route('/get-weather', methods=['POST'])
def weather_endpoint():
    data = request.get_json()
    city = data.get('city')
    datetime_str = data.get('datetime')
    weather = get_weather_for_datetime(city, datetime_str, API_KEY)
    return jsonify(weather)

if __name__ == '__main__':
    app.run(debug=True)
