"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLocationData = fetchLocationData;
const zod_1 = require("zod");
const locationInfoSchema = zod_1.z.object({
    lat: zod_1.z.string(),
    lon: zod_1.z.string(),
    display_name: zod_1.z.string(),
});
async function fetchLocationData(axios, apiUrl, locationName) {
    const options = {
        method: 'GET',
        url: apiUrl,
        params: {
            q: locationName,
            format: 'json',
            limit: 1
        },
        headers: {
            'User-Agent': 'Weather-App (contact@example.com)'
        }
    };
    const response = await axios.request(options);
    if (response.status === 200) {
        try {
            return locationInfoSchema.parse(response.data[0]);
        }
        catch (err) {
            console.error(err);
            throw new Error(`Unable to find location information ${locationName}`);
        }
    }
    else {
        throw new Error("Error fetching location data");
    }
}
