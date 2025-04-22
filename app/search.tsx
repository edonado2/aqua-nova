import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, TextInput, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    currentLocation?: string;
    onSelect?: string; // Callback route to navigate to after selection
  }>();
  const { predictions, isLoading, fetchPredictions } = usePlacesAutocomplete();

  useEffect(() => {
    console.log('Search query changed:', searchQuery);
    if (searchQuery.length >= 2) {
      console.log('Triggering search');
      const timer = setTimeout(() => {
        fetchPredictions(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      console.log('Clearing predictions (query too short)');
      fetchPredictions('');
    }
  }, [searchQuery]);

  useEffect(() => {
    console.log('Predictions updated:', predictions);
  }, [predictions]);

  const handleSearchChange = (query: string) => {
    console.log('Search input changed:', query);
    setSearchQuery(query);
  };

  const handlePlaceSelect = (prediction: PlacePrediction) => {
    console.log('Place selected:', prediction);
    
    // Navigate to the payment screen with the selected location
    router.push({
      pathname: '/payment',
      params: {
        selectedLocation: prediction.structured_formatting.main_text,
        placeId: prediction.place_id,
        fullAddress: prediction.description
      }
    });
  };

  const getCurrentLocation = () => {
    return params.currentLocation || 'Selecciona una ubicación';
  };

  const renderPredictions = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      );
    }

    if (predictions.length === 0 && searchQuery.length >= 2) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron resultados</Text>
        </View>
      );
    }

    return predictions.map((prediction: PlacePrediction) => (
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
            {prediction.structured_formatting.main_text}
          </Text>
          <Text style={styles.secondaryText} numberOfLines={1}>
            {prediction.structured_formatting.secondary_text}
          </Text>
        </View>
      </TouchableOpacity>
    ));
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
          <View style={styles.currentLocationContainer}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={16} 
              color="#4CAF50"
              style={styles.locationIcon} 
            />
            <Text numberOfLines={1} style={styles.currentLocationText}>
              {getCurrentLocation()}
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar ubicación..."
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
        </View>

        <View style={styles.resultsContainer}>
          {renderPredictions()}
        </View>
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
  currentLocationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  currentLocationText: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: 8,
    paddingLeft: 16,
    height: 44,
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
  secondaryText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
}); 