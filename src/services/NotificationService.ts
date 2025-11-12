import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean | string;
  vibrate?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'max';
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
      // Configurar comportamento das notificações
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Solicitar permissões
      await this.requestPermissions();
      
      this.isInitialized = true;
      console.log('NotificationService inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar NotificationService:', error);
    }
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.warn('Permissão de notificação negada');
          return false;
        }

        // Configurar canal de notificação para Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('alerts', {
            name: 'Alertas BabyGuard',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B9D',
            sound: true,
          });

          await Notifications.setNotificationChannelAsync('critical', {
            name: 'Alertas Críticos',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 200, 500, 200, 500],
            lightColor: '#FF0000',
            sound: true,
          });
        }

        return true;
      } else {
        console.warn('Notificações só funcionam em dispositivos físicos');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  async sendNotification(data: NotificationData): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const notificationContent: Notifications.NotificationContentInput = {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: data.sound !== false,
        priority: this.mapPriority(data.priority || 'normal'),
      };

      // Configurações específicas por plataforma
      if (Platform.OS === 'android') {
        notificationContent.android = {
          channelId: data.priority === 'max' ? 'critical' : 'alerts',
          color: data.priority === 'max' ? '#FF0000' : '#FF6B9D',
          sticky: data.priority === 'max',
          autoCancel: data.priority !== 'max',
        };
      }

      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // Enviar imediatamente
      });

      console.log('Notificação enviada:', data.title);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  private mapPriority(priority: string): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case 'low': return Notifications.AndroidNotificationPriority.LOW;
      case 'normal': return Notifications.AndroidNotificationPriority.DEFAULT;
      case 'high': return Notifications.AndroidNotificationPriority.HIGH;
      case 'max': return Notifications.AndroidNotificationPriority.MAX;
      default: return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }



  // Notificações específicas para alertas médicos
  async sendCriticalAlert(type: string, value: string, message: string): Promise<void> {
    await this.sendNotification({
      title: `🚨 ALERTA CRÍTICO - ${type}`,
      body: `${message}\nValor: ${value}\nVerifique o bebê IMEDIATAMENTE!`,
      priority: 'max',
      sound: true,
      vibrate: true,
      data: {
        type: 'critical',
        alertType: type,
        value,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async sendAttentionAlert(type: string, value: string, message: string): Promise<void> {
    await this.sendNotification({
      title: `⚠️ Atenção - ${type}`,
      body: `${message}\nValor: ${value}\nMonitore de perto.`,
      priority: 'high',
      sound: true,
      vibrate: true,
      data: {
        type: 'attention',
        alertType: type,
        value,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async sendInfoAlert(type: string, value: string, message: string): Promise<void> {
    await this.sendNotification({
      title: `ℹ️ Informação - ${type}`,
      body: `${message}\nValor: ${value}`,
      priority: 'normal',
      sound: false,
      vibrate: false,
      data: {
        type: 'info',
        alertType: type,
        value,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Cancelar todas as notificações
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Todas as notificações foram canceladas');
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  }

  // Obter notificações ativas
  async getActiveNotifications(): Promise<Notifications.Notification[]> {
    try {
      return await Notifications.getPresentedNotificationsAsync();
    } catch (error) {
      console.error('Erro ao obter notificações ativas:', error);
      return [];
    }
  }
}

export default NotificationService;