import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading?: boolean;
  latency?: number;
  onPress?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isLoading = false,
  latency,
  onPress,
}) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    if (isLoading) {
      return {
        color: '#FF9800',
        icon: 'sync' as const,
        text: 'Conectando...',
        backgroundColor: '#FF9800' + '20',
      };
    }
    
    if (isConnected) {
      return {
        color: '#4CAF50',
        icon: 'checkmark-circle' as const,
        text: latency ? `Conectado (${latency}ms)` : 'Conectado',
        backgroundColor: '#4CAF50' + '20',
      };
    }
    
    return {
      color: '#F44336',
      icon: 'close-circle' as const,
      text: 'Desconectado',
      backgroundColor: '#F44336' + '20',
    };
  };

  const config = getStatusConfig();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: config.backgroundColor,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: config.color + '40',
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    text: {
      fontSize: 12,
      fontWeight: '600',
      color: config.color,
    },
  });

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Ionicons 
        name={config.icon} 
        size={16} 
        color={config.color}
        style={styles.icon}
      />
      <Text style={styles.text}>{config.text}</Text>
    </Component>
  );
};