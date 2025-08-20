"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const static_1 = __importDefault(require("@fastify/static"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = require("fastify");
const nunjucks_1 = __importDefault(require("nunjucks"));
const zod_1 = require("zod");
const location_1 = require("./location");
const weatherapi_1 = require("./weatherapi");
dotenv_1.default.config();
const environment = process.env.NODE_ENV;
const templates = new nunjucks_1.default.Environment(new nunjucks_1.default.FileSystemLoader("src/backend/templates"));
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://nominatim.openstreetmap.org/search";
const HTTP_CLIENT = axios_1.default;
const server = (0, fastify_1.fastify)({
    logger: true,
});
{
    server.register(formbody_1.default);
    server.register(static_1.default, {
        root: path_1.default.join(__dirname, "../../dist"),
    });
}
const weatherCodeToImage = (code) => {
    switch (code) {
        case 0: return "/static/img/clear.svg";
        case 1: return "/static/img/clear.svg";
        case 2: return "/static/img/cloudy.svg";
        case 3: return "/static/img/overcast.svg";
        case 45: return "/static/img/fog.svg";
        case 48: return "/static/img/fog.svg";
        case 51: return "/static/img/drizzle.svg";
        case 53: return "/static/img/drizzle.svg";
        case 55: return "/static/img/drizzle.svg";
        case 56: return "/static/img/drizzle.svg";
        case 57: return "/static/img/drizzle.svg";
        case 61: return "/static/img/rain.svg";
        case 63: return "/static/img/rain.svg";
        case 65: return "/static/img/rain.svg";
        case 66: return "/static/img/rain.svg";
        case 67: return "/static/img/rain.svg";
        case 71: return "/static/img/snow.svg";
        case 73: return "/static/img/snow.svg";
        case 75: return "/static/img/snow.svg";
        case 77: return "/static/img/snow.svg";
        case 80: return "/static/img/rain.svg";
        case 81: return "/static/img/rain.svg";
        case 82: return "/static/img/rain.svg";
        case 85: return "/static/img/snow.svg";
        case 86: return "/static/img/snow.svg";
        case 95: return "/static/img/thunderstorm.svg";
        case 96: return "/static/img/thunderstorm.svg";
        case 99: return "/static/img/thunderstorm.svg";
        default: return "/static/img/info.svg";
    }
};
// /?location = LOCATIONNAME
const locationSchema = zod_1.z.object({
    location: zod_1.z.string(),
});
server.get("/", async (request, reply) => {
    const queryParams = request.query;
    try {
        const { location } = locationSchema.parse(queryParams);
        const locationInfo = await (0, location_1.fetchLocationData)(HTTP_CLIENT, GEOCODE_API_URL, location);
        const weatherInfo = await (0, weatherapi_1.fetchWeatherData)(HTTP_CLIENT, WEATHER_API_URL, locationInfo.lat, locationInfo.lon);
        const rendered = templates.render("weather.njk", {
            environment,
            location: locationInfo.display_name,
            currentDate: new Date().toDateString(),
            weather: {
                ...weatherInfo,
                conditionImg: weatherCodeToImage(weatherInfo.weathercode),
                condition: weatherInfo.condition(),
                lowTemp: weatherInfo.lowTemp(),
                highTemp: weatherInfo.highTemp(),
            }
        });
        await reply
            .header("Content-Type", "text/html; charset=utf-8")
            .send(rendered);
    }
    catch (e) {
        console.error(e);
        const rendered = templates.render("get_started.njk", { environment });
        await reply
            .header("Content-Type", "text/html; charset=utf-8")
            .send(rendered);
    }
});
const start = async () => {
    try {
        await server.listen({ port: 8089 });
    }
    catch (e) {
        server.log.error(e);
        process.exit(1);
    }
};
start();
