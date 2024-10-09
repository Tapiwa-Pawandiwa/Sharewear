import 'dotenv/config';

export default ({ config }: { config: any }) => {
  return {
    ...config,
    name: "Sharewear",
    slug: "Sharewear",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "sharewear",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logos/main-logo.png",
      resizeMode: "center",
      backgroundColor: "#ffffff",
    },
  
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tapiwap.Sharewear",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Ensure this is correctly loaded
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY, // Ensure this is correctly loaded
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
       "expo-font",
      "expo-router",
      "expo-secure-store",
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsImpl": "mapbox",
          "RNMapboxMapsDownloadToken": process.env.MAPBOX_DOWNLOAD_TOKEN // Ensure this is correctly loaded
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Optional: if you need to reference it elsewhere
    },
  };
};
