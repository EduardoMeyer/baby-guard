import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import ApiService from '../services/ApiService';

interface VitalData {
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  movement: 'active' | 'sleeping' | 'restless';
  lastUpdate: Date;
}

interface VitalsContextType {
  vitals: VitalData;
  loading: boolean;
  error: string | null;
  refreshVitals: () => Promise<void>;
  isConnected: boolean;
  connectionStatus: string;
  latency?: number;
  testConnection: () => Promise<void>;
}

const VitalsContext = createContext<VitalsContextType | undefined>(undefined);

export const useVitals = () => {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals deve ser usado dentro de um VitalsProvider');
  }
  return context;
};

export const VitalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vitals, setVitals] = useState<VitalData>({
    temperature: 36.8,
    heartRate: 120,
    respiratoryRate: 35,
    oxygenSaturation: 98,
    movement: 'sleeping',
    lastUpdate: new Date(),
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Debug: Log do estado de conexão
  useEffect(() => {
    console.log('STATUS CONEXAO MUDOU:', isConnected, connectionStatus);
  }, [isConnected, connectionStatus]);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [latency, setLatency] = useState<number | undefined>();
  
  const apiService = useRef(ApiService.getInstance());
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startPolling();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const testConnection = async () => {
    try {
      const result = await apiService.current.testConnection();
      setLatency(result.latency);
      
      if (result.connected) {
        startPolling();
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
    }
  };

  const startPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    pollingRef.current = apiService.current.startPolling((data: any) => {
      const newVitals: VitalData = {
        temperature: parseFloat(String(data.temperatura || data.temperature || 36.8)),
        heartRate: parseInt(String(data.batimentos || data.heartRate || 120)),
        respiratoryRate: parseInt(String(data.respiracao || data.respiratoryRate || 35)),
        oxygenSaturation: parseInt(String(data.saturacao || data.oxygenSaturation || 98)),
        movement: (data.movimento || data.movement || 'sleeping') as 'active' | 'sleeping' | 'restless',
        lastUpdate: new Date(),
      };
      
      setVitals(newVitals);
      setIsConnected(true);
      setConnectionStatus('Conectado');
      setError(null);
    }, 1000);
  };

  const refreshVitals = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.current.getLatestVitals();
      console.log('Dados recebidos no refresh:', data);
      
      const newVitals: VitalData = {
        temperature: parseFloat(data.temperatura || data.temperature || '36.8'),
        heartRate: parseInt(data.batimentos || data.heartRate || '120'),
        respiratoryRate: parseInt(data.respiracao || data.respiratoryRate || '35'),
        oxygenSaturation: parseInt(data.saturacao || data.oxygenSaturation || '98'),
        movement: data.movimento || data.movement || 'sleeping',
        lastUpdate: new Date(),
      };
      
      setVitals(newVitals);
      setIsConnected(true);
      setConnectionStatus('Conectado - Manual');
      
    } catch (error) {
      setError('Erro ao buscar dados do Arduino');
      setIsConnected(false);
      setConnectionStatus('Erro na atualização');
      console.error('Erro ao buscar vitais:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    vitals,
    loading,
    error,
    refreshVitals,
    isConnected,
    connectionStatus,
    latency,
    testConnection,
  };

  return (
    <VitalsContext.Provider value={value}>
      {children}
    </VitalsContext.Provider>
  );
};