import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchLocationData } from "./location";
import { fetchWeatherData } from "./weatherapi";

const SAMPLE_API_RESPONSE = [
  {
    place_id: 287781008,
    licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    powered_by: 'Map Maker: https://maps.co',
    osm_type: 'relation',
    osm_id: 207359,
    boundingbox: [Array],
    lat: '34.0536909',
    lon: '-118.242766',
    display_name: 'Los Angeles, Los Angeles County, California, United States',
    class: 'boundary',
    type: 'administrative',
    importance: 0.9738053728457621
  },
  {
    place_id: 259239981,
    licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
    powered_by: 'Map Maker: https://maps.co',
    osm_type: 'way',
    osm_id: 807458549,
    boundingbox: [Array],
    lat: '34.0708781',
    lon: '-118.44684973165106',
    display_name: 'University of California, Los Angeles, Bellagio Road, Bel Air, Bel-Air, Los Angeles, Los Angeles County, California, 90049, United States',
    class: 'amenity',
    type: 'university',
    importance: 0.8181396344174214
  },
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

it("throws error when response is not 200", async () => {
  const httpClient = new MockAdapter(axios);
  const GEOCODE_API_URL = "https://geocode.maps.co/search"; 
  httpClient.onGet(GEOCODE_API_URL, { params: { q: "test", format: "json" }}).reply(400, SAMPLE_API_RESPONSE);

  await expect(fetchLocationData(axios, GEOCODE_API_URL, "test")).rejects.toThrow();
})

it("should successfully fetch location and weather data for all US states", async () => {
  const GEOCODE_API_URL = "https://geocode.maps.co/search";
  const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
  
  interface StateResult {
    state: string;
    location: string;
    lat: string;
    lon: string;
    temperature: number;
    condition: string;
  }
  
  interface StateFailure {
    state: string;
    error: string;
  }
  
  const results: StateResult[] = [];
  const failed: StateFailure[] = [];

  console.log(`Testing weather lookups for ${US_STATES.length} US states...`);
  
  for (const state of US_STATES) {
    try {
      console.log(`Testing ${state}...`);
      const locationInfo = await fetchLocationData(axios, GEOCODE_API_URL, state);
      const weatherInfo = await fetchWeatherData(axios, WEATHER_API_URL, locationInfo.lat, locationInfo.lon);
      
      results.push({
        state,
        location: locationInfo.display_name,
        lat: locationInfo.lat,
        lon: locationInfo.lon,
        temperature: weatherInfo.temperature.value,
        condition: weatherInfo.condition()
      });
      console.log(`✓ ${state}: ${weatherInfo.temperature.value}°${weatherInfo.temperature.unit}, ${weatherInfo.condition()}`);
      
      // Add a small delay to be respectful to the APIs
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      failed.push({ state, error: error instanceof Error ? error.message : 'Unknown error' });
      console.log(`✗ ${state}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`\nResults: ${results.length} successful, ${failed.length} failed`);
  
  if (failed.length > 0) {
    console.log('\nFailed states:');
    failed.forEach(f => console.log(`  ${f.state}: ${f.error}`));
  }

  // Test should pass if at least 90% of states work
  expect(results.length).toBeGreaterThan(US_STATES.length * 0.9);
}, 60000) // 60 second timeout