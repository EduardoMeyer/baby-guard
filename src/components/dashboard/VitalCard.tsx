import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface VitalCardProps {
  title: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: 'normal' | 'warning' | 'critical';
}

export const VitalCard: React.FC<VitalCardProps> = ({
  title,
  value,
  unit,
  icon,
  status,
}) => {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      default: return theme.colors.primary;
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 3,
      borderLeftColor: getStatusColor(),
      minHeight: 100,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: getStatusColor() + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    title: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    value: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    unit: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 2,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={getStatusColor()} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};