import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import NotificationService from '../services/NotificationService';
import { NotificationSettings } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationContextType {
  notificationService: NotificationService;
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

const defaultSettings: NotificationSettings = {
  feeding: true,
  sleeping: true,
  vitals: true,
  diaper: true,
  medication: true,
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationService] = useState(() => NotificationService.getInstance());
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    initializeNotifications();
    loadSettings();
    setupNotificationListeners();
  }, []);

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      
      // Verificar permissões
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notification_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('notification_settings', JSON.stringify(updatedSettings));
      
      // Reagendar notificações baseado nas novas configurações
      await rescheduleNotifications(updatedSettings);
    } catch (error) {
      console.error('Erro ao atualizar configurações de notificação:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (granted) {
        await notificationService.initialize();
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  };

  const rescheduleNotifications = async (newSettings: NotificationSettings) => {
    // Cancelar todas as notificações existentes
    await notificationService.cancelAllNotifications();

    // Reagendar baseado nas novas configurações
    if (newSettings.feeding) {
      await notificationService.scheduleFeedingReminder(3); // A cada 3 horas
    }

    if (newSettings.sleeping) {
      // Agendar lembrete de sono para 20h (exemplo)
      const bedtime = new Date();
      bedtime.setHours(20, 0, 0, 0);
      await notificationService.scheduleSleepReminder(bedtime);
    }

    // Outras notificações podem ser reagendadas aqui conforme necessário
  };

  const setupNotificationListeners = () => {
    // Listener para notificações recebidas enquanto o app está em primeiro plano
    const receivedListener = notificationService.addNotificationReceivedListener(
      (notification: Notifications.Notification) => {
        console.log('Notificação recebida:', notification);
        // Aqui você pode adicionar lógica adicional, como mostrar um modal ou atualizar o estado
      }
    );

    // Listener para quando o usuário toca na notificação
    const responseListener = notificationService.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        console.log('Resposta da notificação:', response);
        
        const { actionIdentifier, notification } = response;
        const notificationData = notification.request.content.data;

        // Tratar diferentes tipos de ações
        switch (actionIdentifier) {
          case 'mark-fed':
            // Marcar como alimentado
            handleMarkFed();
            break;
          case 'snooze':
            // Adiar por 30 minutos
            handleSnoozeFeeding();
            break;
          case 'view-details':
            // Navegar para tela de detalhes
            handleViewDetails(notificationData);
            break;
          default:
            // Ação padrão (tocar na notificação)
            handleDefaultAction(notificationData);
            break;
        }
      }
    );

    // Cleanup listeners quando o componente for desmontado
    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  };

  const handleMarkFed = async () => {
    // Implementar lógica para marcar como alimentado
    console.log('Bebê marcado como alimentado');
    // Aqui você pode adicionar um registro de alimentação automaticamente
  };

  const handleSnoozeFeeding = async () => {
    // Adiar lembrete de alimentação por 30 minutos
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 30);
    
    await notificationService.scheduleNotification({
      id: 'feeding-snooze',
      title: '🍼 Lembrete Adiado',
      body: 'Hora de alimentar o bebê! (Lembrete adiado)',
      trigger: { date: snoozeTime },
      data: { type: 'feeding-reminder-snooze' },
    });
  };

  const handleViewDetails = (notificationData: any) => {
    // Navegar para a tela apropriada baseado no tipo de notificação
    console.log('Visualizar detalhes:', notificationData);
    // Implementar navegação aqui
  };

  const handleDefaultAction = (notificationData: any) => {
    // Ação padrão quando o usuário toca na notificação
    console.log('Ação padrão da notificação:', notificationData);
    // Implementar navegação ou ação padrão aqui
  };

  const value = {
    notificationService,
    settings,
    updateSettings,
    hasPermission,
    requestPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
