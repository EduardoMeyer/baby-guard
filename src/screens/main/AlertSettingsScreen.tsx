import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Switch, 
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import AlertService, { AlertType, AlertSeverity } from '../../services/AlertService';

interface AlertSetting {
  type: AlertType;
  severity: AlertSeverity;
  name: string;
  description: string;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  enabled: boolean;
  icon: string;
  color: string;
}

export const AlertSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const alertService = AlertService.getInstance();

  const [settings, setSettings] = useState<AlertSetting[]>([
    { 
      type: 'temperature', 
      severity: 'critical', 
      name: 'Temperatura Crítica', 
      description: 'Alerta quando temperatura > 38°C ou < 35°C',
      vibrationEnabled: true, 
      soundEnabled: true,
      enabled: true,
      icon: 'thermometer',
      color: '#F44336'
    },
    { 
      type: 'temperature', 
      severity: 'warning', 
      name: 'Temperatura Alterada', 
      description: 'Alerta quando temperatura está fora do normal',
      vibrationEnabled: true, 
      soundEnabled: false,
      enabled: true,
      icon: 'thermometer-outline',
      color: '#FF9800'
    },
    { 
      type: 'oxygenSaturation', 
      severity: 'critical', 
      name: 'SpO2 Crítico', 
      description: 'Alerta quando saturação < 90%',
      vibrationEnabled: true, 
      soundEnabled: true,
      enabled: true,
      icon: 'heart',
      color: '#F44336'
    },
    { 
      type: 'oxygenSaturation', 
      severity: 'warning', 
      name: 'SpO2 Baixo', 
      description: 'Alerta quando saturação < 95%',
      vibrationEnabled: true, 
      soundEnabled: false,
      enabled: true,
      icon: 'heart-outline',
      color: '#FF9800'
    },
  ]);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [globalNotifications, setGlobalNotifications] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.8);
  const [vibrationIntensity, setVibrationIntensity] = useState(0.7);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadSettings = async () => {
    const saved = await alertService.loadAlertSettings();
    if (saved) {
      setSettings(saved);
    }
  };

  const saveSettings = async (newSettings: AlertSetting[]) => {
    setSettings(newSettings);
    await alertService.saveAlertSettings(newSettings);
  };

  const testAlert = async (setting: AlertSetting) => {
    const config = {
      type: setting.type,
      severity: setting.severity,
      title: `Teste: ${setting.name}`,
      message: 'Alerta de teste',
      vibrationEnabled: setting.vibrationEnabled,
    };
    
    await alertService.triggerAlert(config);
  };

  const toggleSetting = (index: number, setting: keyof AlertSetting) => {
    const newSettings = [...settings];
    newSettings[index] = {
      ...newSettings[index],
      [setting]: !newSettings[index][setting]
    };
    saveSettings(newSettings);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Restaurar Padrões',
      'Deseja restaurar todas as configurações para os valores padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restaurar', 
          style: 'destructive',
          onPress: () => {
            const defaultSettings = settings.map(s => ({
              ...s,
              enabled: true,
              vibrationEnabled: true,
              soundEnabled: s.severity === 'critical'
            }));
            saveSettings(defaultSettings);
            setGlobalNotifications(true);
            setSoundVolume(0.8);
            setVibrationIntensity(0.7);
          }
        }
      ]
    );
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    return severity === 'critical' ? 'warning' : 'information-circle';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
      backgroundColor: '#F8FAFC',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1E293B',
      marginLeft: 10,
    },
    headerSubtitle: {
      fontSize: 13,
      color: '#64748B',
      marginLeft: 34,
    },
    resetButton: {
      backgroundColor: '#3B82F6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    resetButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    content: {
      padding: 20,
    },
    globalSection: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 12,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionTitleDark: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 16,
      marginLeft: 4,
    },
    alertCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    alertIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    alertInfo: {
      flex: 1,
    },
    alertName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 4,
    },
    alertDescription: {
      fontSize: 14,
      color: '#64748B',
      lineHeight: 20,
    },
    testButton: {
      backgroundColor: '#3B82F6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    testButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
    },
    settingLabel: {
      fontSize: 16,
      color: '#1E293B',
      fontWeight: '600',
      flex: 1,
    },
    globalSettingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 8,
    },
    globalSettingLabel: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: '600',
      flex: 1,
    },
    sliderContainer: {
      marginVertical: 16,
    },
    sliderLabel: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: '600',
      marginBottom: 12,
    },
    sliderValue: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'right',
      fontWeight: '600',
    },
    disabledCard: {
      opacity: 0.5,
    },


  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="notifications" size={24} color="#3B82F6" />
            <Text style={styles.headerTitle}>Configurar Alertas</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
            <Text style={styles.resetButtonText}>RESTAURAR</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Personalize as notificações do seu bebê</Text>
      </View>
      
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Configurações Globais */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.globalSection}>
          <Text style={styles.sectionTitle}>Configurações Gerais</Text>
          
          <View style={styles.globalSettingRow}>
            <Text style={styles.globalSettingLabel}>Notificações Ativas</Text>
            <Switch
              value={globalNotifications}
              onValueChange={setGlobalNotifications}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.8)' }}
              thumbColor={globalNotifications ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.sliderLabel}>Volume do Som</Text>
              <Text style={styles.sliderValue}>{Math.round(soundVolume * 100)}%</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={soundVolume}
              onValueChange={setSoundVolume}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.sliderLabel}>Intensidade da Vibração</Text>
              <Text style={styles.sliderValue}>{Math.round(vibrationIntensity * 100)}%</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={vibrationIntensity}
              onValueChange={setVibrationIntensity}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.globalSettingRow}>
            <Text style={styles.globalSettingLabel}>Som das Notificações</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.8)' }}
              thumbColor={soundEnabled ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
        </LinearGradient>

        {/* Alertas Individuais */}
        <Text style={styles.sectionTitleDark}>Tipos de Alertas</Text>
        
        {settings.map((setting, index) => (
          <View 
            key={`${setting.type}-${setting.severity}`}
            style={[
              styles.alertCard, 
              { borderLeftColor: setting.color },
              !setting.enabled && styles.disabledCard
            ]}
          >
            <View style={styles.alertHeader}>
              <View style={[styles.alertIcon, { backgroundColor: setting.color + '20' }]}>
                <Ionicons 
                  name={setting.icon as any} 
                  size={28} 
                  color={setting.color} 
                />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertName}>{setting.name}</Text>
                <Text style={styles.alertDescription}>{setting.description}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.testButton, !setting.enabled && { opacity: 0.5 }]}
                onPress={() => testAlert(setting)}
                disabled={!setting.enabled}
              >
                <Text style={styles.testButtonText}>TESTAR</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Ativar Alerta</Text>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(index, 'enabled')}
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor={setting.enabled ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Som</Text>
              <Switch
                value={setting.soundEnabled && setting.enabled}
                onValueChange={() => toggleSetting(index, 'soundEnabled')}
                disabled={!setting.enabled}
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor={setting.soundEnabled && setting.enabled ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Vibração</Text>
              <Switch
                value={setting.vibrationEnabled && setting.enabled}
                onValueChange={() => toggleSetting(index, 'vibrationEnabled')}
                disabled={!setting.enabled}
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor={setting.vibrationEnabled && setting.enabled ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default AlertSettingsScreen;