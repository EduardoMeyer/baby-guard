import React, { createContext, useContext, useState } from 'react';
// import * as Notifications from 'expo-notifications';
// import NotificationService from '../services/NotificationService';
import { NotificationSettings } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock NotificationService para desenvolvimento
class MockNotificationService {
  static getInstance() {
    return new MockNotificationService();
  }
  
  async initialize() {
    console.log('📱 Mock NotificationService inicializado');
  }
  
  async cancelAllNotifications() {
    console.log('🔕 Mock: Todas notificações canceladas');
  }
  
  async scheduleFeedingReminder(hours: number) {
    console.log(`🍼 Mock: Lembrete de alimentação agendado para ${hours}h`);
  }
  
  async scheduleSleepReminder(time: Date) {
    console.log('😴 Mock: Lembrete de sono agendado para', time);
  }
  
  async scheduleNotification(notification: any) {
    console.log('🔔 Mock: Notificação agendada:', notification.title);
  }
  
  addNotificationReceivedListener(callback: any) {
    return { remove: () => {} };
  }
  
  addNotificationResponseReceivedListener(callback: any) {
    return { remove: () => {} };
  }
}

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
  const [notificationService] = useState(() => MockNotificationService.getInstance());
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [hasPermission, setHasPermission] = useState(true); // Mock sempre tem permissão

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      console.log('📱 Mock: Notificações inicializadas (modo desenvolvimento)');
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
    console.log('📱 Mock: Permissão de notificação concedida (modo desenvolvimento)');
    setHasPermission(true);
    await notificationService.initialize();
    return true;
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

  // Inicializar ao montar o componente
  React.useEffect(() => {
    initializeNotifications();
    loadSettings();
  }, []);

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
