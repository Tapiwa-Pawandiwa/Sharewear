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
      },
      infoPlist: {
        NSPhotoLibraryUsageDescription: "This app needs access to your photo library to allow you to upload photos for donation requests.",
        NSCameraUsageDescription: "This app needs access to your camera to allow you to take pictures for donation requests.",
        NSLocationWhenInUseUsageDescription: "This app uses your location to help you find donation locations nearby.",
        NSPhotoLibraryAddUsageDescription: "This app requires access to save photos to your photo library.",
      }
    },
    android: {
      package: "com.tapiwap.Sharewhere", // Make sure this is defined correctly
      versionCode: 1, // Increment this for new builds
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY, // Ensure this is defined correctly in your .env file
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "a01b18dd-775f-4cfd-933f-252431637bef",
      },
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Ensure this key is set in your .env file
    },
    owner: "tapiwap", // Ensure owner matches your Expo account
  };
};
