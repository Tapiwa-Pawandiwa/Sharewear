import 'dotenv/config';

export default ({ config }: { config: any }) => {
  return {
    ...config,
    name: "ShareWhere",
    slug: "sharewhere",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "sharewhere",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logos/main-logo.png",
      resizeMode: "center",
      backgroundColor: "#ffffff",
    },
  
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tapiwap.ShareWhere",
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
    ],
    experiments: {
      typedRoutes: true
    },
    expo: {
    "extra": {
      "eas": {
        "projectId": "a01b18dd-775f-4cfd-933f-252431637bef"
      }
    }
  },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Optional: if you need to reference it elsewhere
    },
    "owner": "tapiwap",
  }
};
