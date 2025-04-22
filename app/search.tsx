import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, TextInput, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

interface PlacePrediction {
  place_id: number;
  display_name: string;
  lat: number;
  lon: number;
  type: string;
}

export default function SearchScreen() {
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    currentLocation?: string;
    onSelect?: string;
  }>();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      setCurrentLocation(data.display_name);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchPredictions = async (query: string) => {
    if (query.length < 2) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ve&limit=10`
      );
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchPredictions(query);
  };

  const handlePlaceSelect = (prediction: PlacePrediction) => {
    const selectedLocation = useCurrentLocation ? currentLocation : prediction.display_name;
    const selectedPlaceId = useCurrentLocation ? 'current' : prediction.place_id.toString();
    const selectedLat = useCurrentLocation ? null : prediction.lat;
    const selectedLon = useCurrentLocation ? null : prediction.lon;

    router.push({
      pathname: '/payment',
      params: {
        selectedLocation: selectedLocation,
        placeId: selectedPlaceId,
        fullAddress: selectedLocation,
        lat: selectedLat,
        lon: selectedLon,
        isCurrentLocation: useCurrentLocation.toString()
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={Theme.colors.text} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.locationInput}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={20} 
              color="#4CAF50"
              style={styles.locationIcon} 
            />
            <TextInput
              style={styles.locationText}
              value={currentLocation}
              placeholder="Current Location"
              placeholderTextColor={Theme.colors.textSecondary}
              editable={false}
            />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Use current location for delivery</Text>
            <Switch
              value={useCurrentLocation}
              onValueChange={setUseCurrentLocation}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={useCurrentLocation ? Theme.colors.primary : Theme.colors.textSecondary}
            />
          </View>

          {!useCurrentLocation && (
            <View style={styles.searchBar}>
              <MaterialCommunityIcons 
                name="map-marker-outline" 
                size={20} 
                color={Theme.colors.textSecondary}
                style={styles.searchIcon} 
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter delivery address"
                placeholderTextColor={Theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={handleSearchChange}
                autoFocus
                returnKeyType="search"
              />
              {isLoading ? (
                <ActivityIndicator 
                  size="small" 
                  color={Theme.colors.primary}
                  style={styles.loader} 
                />
              ) : searchQuery ? (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <MaterialCommunityIcons 
                    name="close" 
                    size={20} 
                    color={Theme.colors.textSecondary} 
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {useCurrentLocation && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handlePlaceSelect({} as PlacePrediction)}
            >
              <Text style={styles.confirmButtonText}>Confirm Current Location</Text>
            </TouchableOpacity>
          )}
        </View>

        {!useCurrentLocation && (
          <View style={styles.resultsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
              </View>
            ) : predictions.length === 0 && searchQuery.length >= 2 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No se encontraron resultados</Text>
              </View>
            ) : (
              predictions.map((prediction) => (
                <TouchableOpacity
                  key={prediction.place_id}
                  style={styles.resultItem}
                  onPress={() => handlePlaceSelect(prediction)}
                >
                  <View style={styles.resultIconContainer}>
                    <MaterialCommunityIcons 
                      name="map-marker" 
                      size={16} 
                      color={Theme.colors.textSecondary} 
                    />
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.mainText} numberOfLines={1}>
                      {prediction.display_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: Theme.colors.text,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: 8,
    paddingLeft: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.text,
    height: '100%',
    padding: 0,
  },
  loader: {
    marginRight: 16,
  },
  clearButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.border,
  },
  resultIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  confirmButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 