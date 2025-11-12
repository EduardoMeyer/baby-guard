import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import NotificationService from '../services/NotificationService';
import VitalMonitoringService from '../services/VitalMonitoringService';

export const useNotifications = () => {
  const notificationService = useRef(NotificationService.getInstance()).current;
  const vitalMonitoringService = useRef(VitalMonitoringService.getInstance()).current;
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const initializeServices = async () => {
      await notificationService.initialize();
      await vitalMonitoringService.initialize();
    };

    initializeServices();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Resposta à notificação:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const sendTestNotification = async (type: 'critical' | 'attention' | 'info' = 'info') => {
    try {
      switch (type) {
        case 'critical':
          await notificationService.sendCriticalAlert('Temperatura', '39.2°C', 'Febre alta detectada!');
          break;
        case 'attention':
          await notificationService.sendAttentionAlert('Batimentos', '165 bpm', 'Frequência cardíaca elevada');
          break;
        default:
          await notificationService.sendInfoAlert('Sistema', 'OK', 'Teste de notificação');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
    }
  };

  return { sendTestNotification, notificationService, vitalMonitoringService };
};

export default useNotifications;