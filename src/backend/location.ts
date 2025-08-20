
import { z } from "zod";
import type { AxiosStatic } from "axios";

const locationInfoSchema = z.object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
});

export type LocationInfo = z.infer<typeof locationInfoSchema>;


export async function fetchLocationData(
    axios: AxiosStatic,
    apiUrl: string,
    locationName: string
): Promise<LocationInfo> {
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
            return locationInfoSchema.parse(response.data[0])
        } catch (err) {
            console.error(err);
            throw new Error(`Unable to find location information ${locationName}`)
        }
    } else {
        throw new Error("Error fetching location data");
    }
}   