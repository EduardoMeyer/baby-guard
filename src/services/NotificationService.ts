import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar como as notificações devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  categoryId?: string;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  trigger: Notifications.NotificationTriggerInput;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permissão para notificações não concedida');
        return;
      }

      // Configurar categorias de notificação
      await this.setupNotificationCategories();

      // Configurar canal de notificação para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('baby-alerts', {
          name: 'Alertas do Bebê',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B9D',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Lembretes',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4ECDC4',
          sound: 'default',
        });
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar serviço de notificações:', error);
    }
  }

  private async setupNotificationCategories(): Promise<void> {
    await Notifications.setNotificationCategoryAsync('baby-alert', [
      {
        identifier: 'view-details',
        buttonTitle: 'Ver Detalhes',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dispensar',
        options: { opensAppToForeground: false },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('feeding-reminder', [
      {
        identifier: 'mark-fed',
        buttonTitle: 'Alimentado',
        options: { opensAppToForeground: false },
      },
      {
        identifier: 'snooze',
        buttonTitle: 'Adiar 30min',
        options: { opensAppToForeground: false },
      },
    ]);
  }

  async sendImmediateNotification(notification: NotificationData): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
          sound: 'default',
        },
        trigger: null, // Enviar imediatamente
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  async scheduleNotification(notification: ScheduledNotification): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: notification.trigger,
      });

      // Salvar notificação agendada localmente
      await this.saveScheduledNotification(notificationId, notification);

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await this.removeScheduledNotification(notificationId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('scheduled_notifications');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }

  // Métodos específicos para o BabyGuard

  async sendVitalSignsAlert(type: 'heartRate' | 'temperature' | 'oxygenSaturation', value: number): Promise<void> {
    let title = '';
    let body = '';

    switch (type) {
      case 'heartRate':
        title = '💓 Alerta - Batimentos Cardíacos';
        body = `Batimentos registrados: ${value} BPM. Verifique o bebê.`;
        break;
      case 'temperature':
        title = '🌡️ Alerta - Temperatura';
        body = `Temperatura registrada: ${value}°C. Monitore o bebê.`;
        break;
      case 'oxygenSaturation':
        title = '🫁 Alerta - Saturação de Oxigênio';
        body = `Saturação registrada: ${value}%. Atenção necessária.`;
        break;
    }

    await this.sendImmediateNotification({
      title,
      body,
      categoryId: 'baby-alert',
      data: { type: 'vital-signs-alert', vitalType: type, value },
    });
  }

  async sendDiscomfortAlert(bodyPart: string, discomfortType: string, intensity: number): Promise<void> {
    const intensityText = ['', 'muito leve', 'leve', 'moderado', 'forte', 'muito forte'][intensity];
    
    await this.sendImmediateNotification({
      title: '😢 Desconforto Registrado',
      body: `${bodyPart}: ${discomfortType} (${intensityText}). Verifique o bebê.`,
      categoryId: 'baby-alert',
      data: { type: 'discomfort-alert', bodyPart, discomfortType, intensity },
    });
  }

  async scheduleFeedingReminder(intervalHours: number = 3): Promise<string> {
    const trigger: Notifications.TimeIntervalTriggerInput = {
      seconds: intervalHours * 60 * 60,
      repeats: true,
    };

    return await this.scheduleNotification({
      id: 'feeding-reminder',
      title: '🍼 Hora da Alimentação',
      body: 'É hora de alimentar o bebê!',
      trigger,
      data: { type: 'feeding-reminder' },
    });
  }

  async scheduleSleepReminder(bedtime: Date): Promise<string> {
    const now = new Date();
    const trigger: Notifications.DateTriggerInput = {
      date: bedtime,
      repeats: true,
    };

    return await this.scheduleNotification({
      id: 'sleep-reminder',
      title: '😴 Hora de Dormir',
      body: 'Está na hora do bebê dormir!',
      trigger,
      data: { type: 'sleep-reminder' },
    });
  }

  async scheduleMedicationReminder(medicationName: string, time: Date): Promise<string> {
    const trigger: Notifications.DateTriggerInput = {
      date: time,
      repeats: true,
    };

    return await this.scheduleNotification({
      id: `medication-${medicationName}`,
      title: '💊 Hora do Medicamento',
      body: `Hora de dar ${medicationName} para o bebê.`,
      trigger,
      data: { type: 'medication-reminder', medication: medicationName },
    });
  }

  private async saveScheduledNotification(id: string, notification: ScheduledNotification): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem('scheduled_notifications');
      const notifications = existing ? JSON.parse(existing) : {};
      notifications[id] = notification;
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Erro ao salvar notificação agendada:', error);
    }
  }

  private async removeScheduledNotification(id: string): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem('scheduled_notifications');
      if (existing) {
        const notifications = JSON.parse(existing);
        delete notifications[id];
        await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Erro ao remover notificação agendada:', error);
    }
  }

  // Listener para notificações recebidas
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Listener para quando o usuário toca na notificação
  addNotificationResponseReceivedListener(listener: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}

export default NotificationService;
