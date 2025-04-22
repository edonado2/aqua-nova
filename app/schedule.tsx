import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text, TextInput, Card } from 'react-native-paper';
import { Theme } from '@/constants/Theme';
import { format } from 'date-fns';

export default function ScheduleScreen() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Tank' | 'Pipe'>('Tank');
  const theme = Theme;

  const handleSchedule = () => {
    // Here you would implement the actual scheduling logic
    console.log('Scheduling:', { date, time, amount, type });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Schedule Water Delivery</Text>
          
          <TextInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          
          <TextInput
            label="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
            style={styles.input}
          />
          
          <TextInput
            label="Amount (Liters)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <View style={styles.typeContainer}>
            <Button
              mode={type === 'Tank' ? 'contained' : 'outlined'}
              onPress={() => setType('Tank')}
              style={styles.typeButton}>
              Tank
            </Button>
            <Button
              mode={type === 'Pipe' ? 'contained' : 'outlined'}
              onPress={() => setType('Pipe')}
              style={styles.typeButton}>
              Pipe
            </Button>
          </View>
          
          <Button
            mode="contained"
            onPress={handleSchedule}
            style={styles.button}>
            Schedule Delivery
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  card: {
    marginBottom: Theme.spacing.md,
  },
  title: {
    ...Theme.typography.h2,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: Theme.spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Theme.spacing.lg,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.sm,
  },
  button: {
    backgroundColor: Theme.colors.primary,
  },
}); 