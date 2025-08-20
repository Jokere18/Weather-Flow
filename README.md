# WeatherFlow 🌤️

A modern, full-stack weather application built with TypeScript, providing real-time weather data and location-based forecasts through a clean, responsive interface.

## 🚀 Features

- **Real-time Weather Data**: Fetches current weather conditions using Open-Meteo API
- **Location Search**: Intelligent geocoding with OpenStreetMap Nominatim API
- **Comprehensive Weather Info**: Temperature, wind speed, weather conditions, and daily highs/lows
- **Visual Weather Icons**: Dynamic weather condition visualization
- **Type-Safe Architecture**: Built with TypeScript and Zod schema validation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Error Handling**: Robust error handling and fallback UI states

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Fastify** - High-performance web framework
- **Zod** - Schema validation and type safety
- **Axios** - HTTP client for API requests
- **Nunjucks** - Server-side templating

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-optimized interface
- **Custom SVG Icons** - Weather condition graphics

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Nodemon** - Development server
- **Concurrently** - Run multiple dev processes
- **LiveReload** - Hot reloading during development

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Jokere18/Weather-Flow.git
   cd Weather-Flow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure any required environment variables
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:8089`

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reloading
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run test suite
- `pnpm lint` - Run ESLint
- `pnpm check` - Run type checking

## 🏗️ Architecture

### API Endpoints

- `GET /?location={city}` - Fetch weather data for specified location

### Core Modules

- **`server.ts`** - Fastify server setup and route handling
- **`weatherapi.ts`** - Weather data fetching and processing
- **`location.ts`** - Geocoding and location resolution
- **Weather class** - Structured weather data with computed properties

### Data Flow

1. User enters location in search
2. Location service geocodes city name to coordinates
3. Weather service fetches forecast data using coordinates
4. Server renders template with weather information
5. Client displays formatted weather data with icons

## 🌐 API Integration

### Weather Data - Open-Meteo API
- Provides current weather conditions
- Hourly temperature forecasts
- Weather codes for condition mapping
- No API key required

### Geocoding - OpenStreetMap Nominatim
- Converts location names to coordinates
- Returns formatted address information
- Includes proper User-Agent headers

## 🎨 Weather Conditions

The app supports comprehensive weather condition mapping:
- Clear/Sunny conditions
- Cloudy and overcast states
- Precipitation (rain, drizzle, snow)
- Severe weather (thunderstorms, fog)
- Temperature-based icons

## 🚀 Deployment

### Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Set environment variables if needed
3. Railway will automatically detect and deploy your Node.js app

### Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create weatherflow-app`
3. Deploy: `git push heroku main`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8089
CMD ["npm", "start"]
```

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Tests cover:
- Weather API integration
- Location geocoding
- Data validation schemas
- Error handling scenarios

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for free weather API
- [OpenStreetMap](https://www.openstreetmap.org/) for geocoding services
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

## 📞 Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/Jokere18/Weather-Flow](https://github.com/Jokere18/Weather-Flow)