import { Platform } from 'react-native';

export const MapConfig = {
  defaultRegion: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  provider: Platform.select({
    ios: undefined, // Use Apple Maps on iOS
    android: 'google', // Use Google Maps on Android
  }),
  options: {
    showsUserLocation: true,
    showsMyLocationButton: true,
    showsCompass: true,
    rotateEnabled: true,
  },
}; 