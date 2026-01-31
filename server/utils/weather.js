const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function getWeather(city) {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    if (!WEATHER_API_KEY) {
        console.error("Missing WEATHER_API_KEY. Env vars:", Object.keys(process.env));
        return "Weather API Key is missing. Please configure WEATHER_API_KEY in .env file.";
    }

    if (!city) {
        return "Please specify a city name to check the weather.";
    }

    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Format the output
        const location = `${data.location.name}, ${data.location.region}`;
        const condition = data.current.condition.text;
        const temp = data.current.temp_c;
        const humidity = data.current.humidity;
        const wind = data.current.wind_kph;
        const feelsLike = data.current.feelslike_c;

        return `Current Weather in **${location}**:\n` +
            `- Condition: ${condition}\n` +
            `- Temperature: ${temp}°C (Feels like ${feelsLike}°C)\n` +
            `- Humidity: ${humidity}%\n` +
            `- Wind Speed: ${wind} kph`;

    } catch (error) {
        if (error.response && error.response.status === 400) {
            return `Could not find weather data for "${city}". Please check the spelling or try a major nearby city.`;
        }
        console.error("Weather API failed:", error.message);
        return "Sorry, I am unable to fetch the weather information right now.";
    }
}

module.exports = { getWeather };
