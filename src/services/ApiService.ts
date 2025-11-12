// URL da sua API Arduino
const API_BASE_URL = 'http://192.168.1.77:3000';

// Endpoint correto da sua API
const DADOS_ENDPOINT = '/api/dados'; // GET endpoint para buscar dados

export interface ApiVitalData {
  id: string;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  movement: 'active' | 'sleeping' | 'restless';
  timestamp: string;
  babyId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class ApiService {
  private static instance: ApiService;

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Buscar dados vitais da API
  async getLatestVitals(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${DADOS_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      throw error;
    }
  }

  // Testar conexão com API
  async testConnection(): Promise<{ connected: boolean; message: string; latency?: number; endpoint?: string }> {
    const startTime = Date.now();
    try {
      const response = await fetch(`${API_BASE_URL}${DADOS_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          connected: true,
          message: `API conectada - Dados recebidos`,
          latency,
          endpoint: DADOS_ENDPOINT,
        };
      } else {
        return {
          connected: false,
          message: `Erro HTTP: ${response.status}`,
        };
      }
    } catch (error: any) {
      return {
        connected: false,
        message: 'API não encontrada',
      };
    }
  }

  startPolling(onData: (data: any) => void, interval: number = 1000): NodeJS.Timeout {
    const poll = async () => {
      try {
        const data = await this.getLatestVitals();
        console.log('API RETORNOU:', data);
        onData(data);
      } catch (error) {
        console.error('ERRO NO POLLING:', error);
      }
    };
    
    poll();
    return setInterval(poll, interval);
  }
}

export default ApiService;