import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { Theme } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TooltipBarProps {
  title: string;
  icon: string;
  description: string;
}

export function TooltipBar({ title, icon, description }: TooltipBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={Theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.medium,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    elevation: 2,
  } as ViewStyle,
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  } as ViewStyle,
  textContainer: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  description: {
    fontSize: Theme.typography.caption.fontSize,
    color: Theme.colors.textSecondary,
  },
}); 