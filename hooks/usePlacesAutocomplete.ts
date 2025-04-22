import { useState } from 'react';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    municipality?: string;
    state?: string;
    country?: string;
    quarter?: string;
    park?: string;
    railway?: string;
  };
  importance: number;
  type?: string;
  class?: string;
}

// Venezuela bounding box coordinates (west and east are negative because they're in the western hemisphere)
const VENEZUELA_BOUNDS = {
  north: 12.5,
  south: 0.6,
  west: -73.4,
  east: -59.7,
};

export const usePlacesAutocomplete = () => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isWithinVenezuela = (lat: number, lon: number): boolean => {
    return lat >= VENEZUELA_BOUNDS.south &&
           lat <= VENEZUELA_BOUNDS.north &&
           lon >= VENEZUELA_BOUNDS.west &&
           lon <= VENEZUELA_BOUNDS.east;
  };

  const formatAddress = (result: NominatimResult): { main: string; secondary: string } => {
    console.log('Formatting address for:', result);
    
    let main = '';
    let secondary = '';

    // Use the name if available, otherwise construct from address components
    main = result.name || '';

    if (!main) {
      if (result.type === 'city' || result.class === 'place') {
        main = result.address.city || result.address.municipality || '';
      } else {
        const mainParts = [
          result.address.house_number,
          result.address.road,
          result.address.park,
          result.address.railway
        ].filter(Boolean);
        main = mainParts.length > 0 ? mainParts.join(' ') : result.display_name.split(',')[0];
      }
    }

    // Construct secondary address
    const secondaryParts = [
      result.address.neighbourhood || result.address.quarter,
      result.address.suburb,
      result.address.city || result.address.municipality,
      result.address.state
    ].filter(Boolean);

    secondary = secondaryParts.join(', ');

    console.log('Formatted address:', { main, secondary });
    return { main, secondary };
  };

  const formatNominatimResults = (results: NominatimResult[]): PlacePrediction[] => {
    console.log('Raw Nominatim results:', results);
    
    const formatted = results
      .filter(result => {
        if (result.lat && result.lon) {
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          return isWithinVenezuela(lat, lon);
        }
        return false;
      })
      .sort((a, b) => b.importance - a.importance)
      .map(result => {
        const { main, secondary } = formatAddress(result);
        return {
          place_id: result.place_id.toString(),
          description: result.display_name,
          structured_formatting: {
            main_text: main,
            secondary_text: secondary
          }
        };
      });
      
    console.log('Formatted predictions:', formatted);
    return formatted;
  };

  const fetchPredictions = async (input: string) => {
    console.log('Fetching predictions for input:', input);
    
    if (!input) {
      console.log('Empty input, clearing predictions');
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Search with less restrictive parameters
      const params = new URLSearchParams({
        q: `${input} Venezuela`,
        format: 'json',
        addressdetails: '1',
        limit: '10',
        'accept-language': 'es',
        countrycodes: 've'
      });

      const url = `https://nominatim.openstreetmap.org/search?${params}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AquaNova/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NominatimResult[] = await response.json();
      console.log('Received data:', data);

      const formattedPredictions = formatNominatimResults(data);
      console.log('Setting predictions:', formattedPredictions);
      setPredictions(formattedPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<LatLng | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/details?place_id=${placeId}&format=json`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AquaNova/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.geometry && data.geometry.lat && data.geometry.lon) {
        return {
          latitude: parseFloat(data.geometry.lat),
          longitude: parseFloat(data.geometry.lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  return {
    predictions,
    isLoading,
    fetchPredictions,
    getPlaceDetails,
  };
}; 