import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, ViewStyle, TextStyle, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button, Portal, Text, TextInput, Searchbar, Card, IconButton, Surface } from 'react-native-paper';
import { Theme } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface WaterTruck {
  id: string;
  type: string;
  price: string;
  estimatedTime: string;
  capacity: number;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

// Mock nearby trucks with locations
const mockTrucks: WaterTruck[] = [
  {
    id: '1',
    type: 'Economy',
    price: '€19.56',
    estimatedTime: '14:54',
    capacity: 5000,
    description: 'Basic water delivery service',
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: '2',
    type: 'Premium',
    price: '€29.99',
    estimatedTime: '14:52',
    capacity: 8000,
    description: 'Premium water delivery with priority service',
    location: {
      latitude: 37.78925,
      longitude: -122.4334,
    },
  },
  {
    id: '3',
    type: 'Large Tank',
    price: '€32.91',
    estimatedTime: '14:56',
    capacity: 10000,
    description: 'Large capacity water delivery',
    location: {
      latitude: 37.78725,
      longitude: -122.4344,
    },
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderTruckOption = (truck: WaterTruck) => (
    <TouchableOpacity key={truck.id} onPress={() => {}}>
      <Surface style={styles.truckOption}>
        <View style={styles.truckIconContainer}>
          <MaterialCommunityIcons name="truck-cargo-container" size={24} color={Theme.colors.primary} />
        </View>
        <View style={styles.truckDetails}>
          <View style={styles.truckHeader}>
            <Text style={styles.truckType}>{truck.type}</Text>
            <Text style={styles.truckPrice}>{truck.price}</Text>
          </View>
          <Text style={styles.truckDescription}>{truck.description}</Text>
          <Text style={styles.estimatedTime}>{truck.estimatedTime}</Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.select({
          ios: undefined, // Use Apple Maps on iOS
          android: 'google', // Use Google Maps on Android
        })}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {mockTrucks.map((truck) => (
          <Marker
            key={truck.id}
            coordinate={truck.location}
            onPress={() => {}}
          >
            <View style={styles.markerContainer}>
              <MaterialCommunityIcons name="truck-cargo-container" size={24} color={Theme.colors.primary} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={() => {}}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons name="magnify" size={24} color={Theme.colors.primary} />
            <Text style={styles.searchText}>Where to?</Text>
          </View>
          <View style={styles.searchDivider} />
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color={Theme.colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetHandle} />
        </View>
        <Text style={styles.bottomSheetTitle}>Choose a water truck</Text>
        <ScrollView style={styles.trucksList}>
          {mockTrucks.map(renderTruckOption)}
        </ScrollView>
        <Button
          mode="contained"
          style={styles.confirmButton}
          labelStyle={styles.confirmButtonLabel}
          onPress={() => {}}>
          Confirm Water Truck
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  } as ViewStyle,
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  } as ViewStyle,
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    paddingHorizontal: Theme.spacing.md,
  } as ViewStyle,
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  } as ViewStyle,
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
  } as ViewStyle,
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: Theme.colors.border,
  } as ViewStyle,
  locationContainer: {
    padding: Theme.spacing.md,
  } as ViewStyle,
  searchText: {
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.body.fontSize,
    color: Theme.colors.textSecondary,
  } as TextStyle,
  markerContainer: {
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  } as ViewStyle,
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    ...Theme.shadows.medium,
  } as ViewStyle,
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  } as ViewStyle,
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Theme.colors.border,
    borderRadius: 2,
  } as ViewStyle,
  bottomSheetTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
  } as TextStyle,
  trucksList: {
    maxHeight: 300,
  } as ViewStyle,
  truckOption: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Theme.colors.background,
    ...Theme.shadows.small,
  } as ViewStyle,
  truckIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  } as ViewStyle,
  truckDetails: {
    flex: 1,
  } as ViewStyle,
  truckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  } as ViewStyle,
  truckType: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '600',
  } as TextStyle,
  truckPrice: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '600',
    color: Theme.colors.primary,
  } as TextStyle,
  truckDescription: {
    fontSize: Theme.typography.caption.fontSize,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  } as TextStyle,
  estimatedTime: {
    fontSize: Theme.typography.caption.fontSize,
    color: Theme.colors.textSecondary,
  } as TextStyle,
  confirmButton: {
    marginTop: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
  } as ViewStyle,
  confirmButtonLabel: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '600',
  } as TextStyle,
}); 