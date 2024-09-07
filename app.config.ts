// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "Sharewear",
    slug: "Sharewear",
    version: "1.0.0",
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY, // Load API key from .env
        },
      },
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Load API key from .env
      },
    },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Optional: if you need to reference it elsewhere
    },
  },
};
