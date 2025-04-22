import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, Text, List, Divider } from 'react-native-paper';
import { Theme } from '@/constants/Theme';

export default function ProfileScreen() {
  const theme = Theme;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label="JD"
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Personal Information"
          left={props => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title="Payment Methods"
          left={props => <List.Icon {...props} icon="credit-card" />}
        />
        <List.Item
          title="Addresses"
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
        />
        <List.Item
          title="Language"
          left={props => <List.Icon {...props} icon="translate" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Support</List.Subheader>
        <List.Item
          title="Help Center"
          left={props => <List.Icon {...props} icon="help-circle" />}
        />
        <List.Item
          title="Contact Us"
          left={props => <List.Icon {...props} icon="email" />}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
  },
  avatar: {
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.primary,
  },
  name: {
    ...Theme.typography.h2,
    marginBottom: Theme.spacing.xs,
  },
  email: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
}); 