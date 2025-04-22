import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Button, Text, TextInput, Card, Surface, IconButton } from 'react-native-paper';
import { Theme } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedLocation: string;
    placeId: string;
    fullAddress: string;
  }>();

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const handlePayment = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Here you would implement the actual payment processing
    console.log('Processing payment:', formData);
    // Navigate to confirmation or next screen
    router.push('/confirmation');
  };

  const formatCardNumber = (text: string) => {
    // Remove any spaces and non-digits
    const cleaned = text.replace(/\s+/g, '').replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    // Remove any non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits (MM/YY)
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Payment',
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <Surface style={styles.deliveryInfo}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={24} 
            color={Theme.colors.primary}
            style={styles.locationIcon}
          />
          <View style={styles.locationDetails}>
            <Text style={styles.locationTitle}>Delivery Location</Text>
            <Text style={styles.locationAddress}>{params.fullAddress}</Text>
          </View>
        </Surface>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Payment Details</Text>
            
            <TextInput
              label="Card Number"
              value={formData.cardNumber}
              onChangeText={(text) => setFormData({
                ...formData,
                cardNumber: formatCardNumber(text),
              })}
              style={styles.input}
              keyboardType="numeric"
              maxLength={19} // 16 digits + 3 spaces
            />
            
            <View style={styles.row}>
              <TextInput
                label="Expiry Date"
                value={formData.expiryDate}
                onChangeText={(text) => setFormData({
                  ...formData,
                  expiryDate: formatExpiryDate(text),
                })}
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                maxLength={5} // MM/YY
              />
              
              <TextInput
                label="CVV"
                value={formData.cvv}
                onChangeText={(text) => setFormData({
                  ...formData,
                  cvv: text.replace(/\D/g, ''),
                })}
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
            
            <TextInput
              label="Cardholder Name"
              value={formData.name}
              onChangeText={(text) => setFormData({
                ...formData,
                name: text,
              })}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>€19.99</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>€2.99</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>€22.98</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handlePayment}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.name}>
          Pay Now
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  deliveryInfo: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Theme.colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationIcon: {
    marginRight: Theme.spacing.md,
  },
  locationDetails: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
    color: Theme.colors.text,
  },
  locationAddress: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  card: {
    marginBottom: Theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
    color: Theme.colors.text,
  },
  input: {
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  summary: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.medium,
    marginBottom: Theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
    color: Theme.colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Theme.colors.text,
  },
  totalRow: {
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  button: {
    marginBottom: Theme.spacing.xl,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: Theme.spacing.xs,
  },
}); 