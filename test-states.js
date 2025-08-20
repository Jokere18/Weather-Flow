const axios = require('axios');

const GEOCODE_API_URL = "https://geocode.maps.co/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

// Test key states including Illinois
const TEST_STATES = ['Illinois', 'California', 'New York', 'Texas', 'Florida'];

async function fetchLocationData(locationName) {
    const options = {
        method: 'GET',
        url: GEOCODE_API_URL,
        params: {
            q: locationName,
            format: 'json'
        }
    };
    const response = await axios.default(options);
    
    if (response.status === 200) {
        if (!response.data[0]) {
            throw new Error(`No location found for ${locationName}`);
        }
        return {
            lat: response.data[0].lat,
            lon: response.data[0].lon,
            display_name: response.data[0].display_name
        };
    } else {
        throw new Error("Error fetching location data");
    }
}

async function fetchWeatherData(lat, lon) {
    const options = {
        method: "GET",
        url: WEATHER_API_URL,
        params: {
            latitude: lat,
            longitude: lon,
            hourly: "temperature_2m",
            temperature_unit: "celsius",
            current_weather: true,
            forecast_days: 1,
        } 
    };
    const response = await axios.default(options);
    
    if (response.status === 200) {
        return {
            temperature: response.data.current_weather.temperature,
            weathercode: response.data.current_weather.weathercode
        };
    } else {
        throw new Error("Failed to fetch weather data");
    }
}

async function testStates() {
    console.log(`Testing weather lookups for ${TEST_STATES.length} key states...`);
    
    const results = [];
    const failed = [];
    
    for (const state of TEST_STATES) {
        try {
            console.log(`Testing ${state}...`);
            const locationInfo = await fetchLocationData(state);
            const weatherInfo = await fetchWeatherData(locationInfo.lat, locationInfo.lon);
            
            results.push({
                state,
                location: locationInfo.display_name,
                lat: locationInfo.lat,
                lon: locationInfo.lon,
                temperature: weatherInfo.temperature
            });
            console.log(`✓ ${state}: ${weatherInfo.temperature}°C`);
            
            // Small delay
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            failed.push({ state, error: errorMessage });
            console.log(`✗ ${state}: ${errorMessage}`);
        }
    }
    
    console.log(`\nResults: ${results.length} successful, ${failed.length} failed`);
    
    if (failed.length > 0) {
        console.log('\nFailed states:');
        failed.forEach(f => console.log(`  ${f.state}: ${f.error}`));
    }
    
    if (results.length > 0) {
        console.log('\nSuccessful states:');
        results.forEach(r => console.log(`  ${r.state}: ${r.temperature}°C - ${r.location}`));
    }
}

testStates().catch(console.error);