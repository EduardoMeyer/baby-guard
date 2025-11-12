import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { AlertData, getSeverityConfig } from '../../data/alertsData';
import { Button } from '../common/Button';

interface AlertCardProps {
  alert: AlertData;
  onViewTips: (tipType: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewTips }) => {
  const { theme } = useTheme();
  const severityConfig = getSeverityConfig(alert.severity);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: severityConfig.backgroundColor,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: severityConfig.borderColor,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: severityConfig.color + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    headerContent: {
      flex: 1,
    },
    severityLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: severityConfig.color,
      backgroundColor: severityConfig.color + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 2,
    },
    value: {
      fontSize: 14,
      fontWeight: '600',
      color: severityConfig.color,
    },
    time: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 'auto',
    },
    message: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    protocolContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    protocolTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: severityConfig.color,
      marginBottom: theme.spacing.sm,
    },
    protocol: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    buttonContainer: {
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={alert.icon as any} 
            size={24} 
            color={severityConfig.color} 
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.severityLabel}>{severityConfig.label}</Text>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.value}>{alert.value}</Text>
        </View>
        <Text style={styles.time}>{alert.time}</Text>
      </View>

      <Text style={styles.message}>{alert.message}</Text>

      <View style={styles.protocolContainer}>
        <Text style={styles.protocolTitle}>📋 Protocolo de Ação:</Text>
        <Text style={styles.protocol}>{alert.protocol}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Ver mais orientações"
          onPress={() => onViewTips(alert.tipType)}
          variant="outline"
          size="small"
          leftIcon="information-circle"
          style={{ borderColor: severityConfig.color }}
          textStyle={{ color: severityConfig.color }}
        />
      </View>
    </TouchableOpacity>
  );
};