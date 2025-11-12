import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  userName?: string;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ userName = 'Usuário' }) => {
  const { theme } = useTheme();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    leftSection: {
      flex: 1,
    },
    greeting: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '15',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    logo: {
      marginRight: theme.spacing.sm,
    },
    appName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.greeting}>{getCurrentGreeting()},</Text>
        <Text style={styles.title}>{userName}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.logo, { fontSize: 18 }]}>👶</Text>
        <Text style={styles.appName}>BabyGuard</Text>
      </View>
    </View>
  );
};