import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { DiscomfortReport } from '../../types';

interface DiscomfortModalProps {
  visible: boolean;
  onClose: () => void;
  bodyPart: string;
  bodyPartLabel: string;
  onSubmit: (report: Omit<DiscomfortReport, 'id' | 'babyId' | 'timestamp'>) => void;
}

const discomfortTypes = [
  { id: 'pain', label: 'Dor', icon: 'medical', color: '#E74C3C' },
  { id: 'irritation', label: 'Irritação', icon: 'warning', color: '#F39C12' },
  { id: 'fever', label: 'Febre', icon: 'thermometer', color: '#E67E22' },
  { id: 'other', label: 'Outro', icon: 'help-circle', color: '#9B59B6' },
];

const intensityLevels = [
  { level: 1, label: 'Muito Leve', color: '#2ECC71' },
  { level: 2, label: 'Leve', color: '#F1C40F' },
  { level: 3, label: 'Moderado', color: '#F39C12' },
  { level: 4, label: 'Forte', color: '#E67E22' },
  { level: 5, label: 'Muito Forte', color: '#E74C3C' },
];

export const DiscomfortModal: React.FC<DiscomfortModalProps> = ({
  visible,
  onClose,
  bodyPart,
  bodyPartLabel,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState<'pain' | 'irritation' | 'fever' | 'other'>('pain');
  const [selectedIntensity, setSelectedIntensity] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Erro', 'Selecione o tipo de desconforto');
      return;
    }

    onSubmit({
      bodyPart,
      discomfortType: selectedType,
      intensity: selectedIntensity,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedType('pain');
    setSelectedIntensity(1);
    setNotes('');
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      margin: theme.spacing.lg,
      maxHeight: '80%',
      width: '90%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    bodyPartContainer: {
      backgroundColor: theme.colors.primary + '20',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },
    bodyPartText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    typeButton: {
      width: '48%',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    typeButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    typeIcon: {
      marginBottom: theme.spacing.sm,
    },
    typeLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    intensityContainer: {
      marginBottom: theme.spacing.lg,
    },
    intensityRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    intensityButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    intensityButtonSelected: {
      borderColor: theme.colors.primary,
      borderWidth: 3,
    },
    intensityText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    intensityLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.sm,
    },
    intensityLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      width: 50,
    },
    notesContainer: {
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      marginHorizontal: theme.spacing.sm,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Registrar Desconforto</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.bodyPartContainer}>
              <Text style={styles.bodyPartText}>{bodyPartLabel}</Text>
            </View>

            <Text style={styles.sectionTitle}>Tipo de Desconforto</Text>
            <View style={styles.typeContainer}>
              {discomfortTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    selectedType === type.id && styles.typeButtonSelected,
                  ]}
                  onPress={() => setSelectedType(type.id as any)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={selectedType === type.id ? theme.colors.primary : type.color}
                    style={styles.typeIcon}
                  />
                  <Text style={styles.typeLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Intensidade</Text>
            <View style={styles.intensityContainer}>
              <View style={styles.intensityRow}>
                {intensityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.level}
                    style={[
                      styles.intensityButton,
                      { backgroundColor: level.color },
                      selectedIntensity === level.level && styles.intensityButtonSelected,
                    ]}
                    onPress={() => setSelectedIntensity(level.level as any)}
                  >
                    <Text style={styles.intensityText}>{level.level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.intensityLabels}>
                {intensityLevels.map((level) => (
                  <Text key={level.level} style={styles.intensityLabel}>
                    {level.label}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.notesContainer}>
              <Input
                label="Observações (opcional)"
                value={notes}
                onChangeText={setNotes}
                placeholder="Adicione observações sobre o desconforto..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                onPress={onClose}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Registrar"
                onPress={handleSubmit}
                style={styles.button}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
