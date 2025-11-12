import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

export type AlertSeverity = 'warning' | 'critical';
export type AlertType = 'temperature' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation';

export interface AlertConfig {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  vibrationEnabled: boolean;
}

class AlertService {
  private static instance: AlertService;

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  async initialize() {
    console.log('AlertService inicializado');
  }

  async triggerAlert(config: AlertConfig) {
    try {
      if (config.vibrationEnabled) {
        await this.triggerVibration(config.severity);
      }
      
      await this.showLocalNotification(config);
      
      console.log(`🚨 ${config.title}`);
      
    } catch (error) {
      console.error('Erro ao disparar alerta:', error);
    }
  }

  private async triggerVibration(severity: AlertSeverity) {
    try {
      if (severity === 'warning') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.error('Erro na vibração:', error);
    }
  }

  private async showLocalNotification(config: AlertConfig) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.message,
          sound: true,
          priority: config.severity === 'critical' ? 'high' : 'default',
          data: { severity: config.severity },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
    }
  }

  checkVitalSigns(vitals: {
    temperature: number;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  }): AlertConfig | null {
    
    // Temperatura crítica
    if (vitals.temperature >= 38.5 || vitals.temperature <= 35.0) {
      return {
        type: 'temperature',
        severity: 'critical',
        title: '🚨 Temperatura Crítica',
        message: `${vitals.temperature}°C - Atendimento URGENTE!`,
        vibrationEnabled: true,
      };
    }

    // Temperatura aviso
    if (vitals.temperature >= 37.8 || vitals.temperature <= 35.5) {
      return {
        type: 'temperature',
        severity: 'warning',
        title: '⚠️ Temperatura Alterada',
        message: `${vitals.temperature}°C - Monitore`,
        vibrationEnabled: true,
      };
    }

    // Saturação crítica
    if (vitals.oxygenSaturation <= 90) {
      return {
        type: 'oxygenSaturation',
        severity: 'critical',
        title: '🚨 SpO2 Crítico',
        message: `${vitals.oxygenSaturation}% - URGENTE!`,
        vibrationEnabled: true,
      };
    }

    // Saturação aviso
    if (vitals.oxygenSaturation <= 94) {
      return {
        type: 'oxygenSaturation',
        severity: 'warning',
        title: '⚠️ SpO2 Baixo',
        message: `${vitals.oxygenSaturation}% - Verifique`,
        vibrationEnabled: true,
      };
    }

    return null;
  }

  async cleanup() {
    console.log('AlertService limpo');
  }
}

export default AlertService;