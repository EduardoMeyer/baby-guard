import NotificationService from './NotificationService';

export interface VitalData {
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  timestamp: string;
}

export interface VitalThresholds {
  temperature: {
    critical: { min: number; max: number };
    attention: { min: number; max: number };
  };
  heartRate: {
    critical: { min: number; max: number };
    attention: { min: number; max: number };
  };
  respiratoryRate: {
    critical: { min: number; max: number };
    attention: { min: number; max: number };
  };
  oxygenSaturation: {
    critical: { min: number; max: number };
    attention: { min: number; max: number };
  };
}

class VitalMonitoringService {
  private static instance: VitalMonitoringService;
  private notificationService: NotificationService;
  private lastAlerts: Map<string, number> = new Map();
  private alertCooldown = 5 * 60 * 1000; // 5 minutos entre alertas do mesmo tipo

  // Valores normais para bebês (0-12 meses)
  private thresholds: VitalThresholds = {
    temperature: {
      critical: { min: 35.0, max: 38.5 },
      attention: { min: 35.5, max: 37.8 },
    },
    heartRate: {
      critical: { min: 80, max: 180 },
      attention: { min: 90, max: 160 },
    },
    respiratoryRate: {
      critical: { min: 20, max: 60 },
      attention: { min: 25, max: 50 },
    },
    oxygenSaturation: {
      critical: { min: 90, max: 100 },
      attention: { min: 95, max: 100 },
    },
  };

  static getInstance(): VitalMonitoringService {
    if (!VitalMonitoringService.instance) {
      VitalMonitoringService.instance = new VitalMonitoringService();
    }
    return VitalMonitoringService.instance;
  }

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  async initialize(): Promise<void> {
    await this.notificationService.initialize();
    console.log('VitalMonitoringService inicializado');
  }

  async analyzeVitals(data: VitalData): Promise<void> {
    try {
      // Analisar cada sinal vital
      await this.checkTemperature(data.temperature);
      await this.checkHeartRate(data.heartRate);
      await this.checkRespiratoryRate(data.respiratoryRate);
      await this.checkOxygenSaturation(data.oxygenSaturation);
    } catch (error) {
      console.error('Erro ao analisar sinais vitais:', error);
    }
  }

  private async checkTemperature(temperature: number): Promise<void> {
    const alertKey = 'temperature';
    
    if (temperature <= this.thresholds.temperature.critical.min || 
        temperature >= this.thresholds.temperature.critical.max) {
      
      if (this.shouldSendAlert(alertKey + '_critical')) {
        await this.notificationService.sendCriticalAlert(
          'Temperatura',
          `${temperature.toFixed(1)}°C`,
          temperature >= this.thresholds.temperature.critical.max 
            ? 'Febre alta detectada!' 
            : 'Temperatura muito baixa!'
        );
        this.updateLastAlert(alertKey + '_critical');
      }
    } else if (temperature <= this.thresholds.temperature.attention.min || 
               temperature >= this.thresholds.temperature.attention.max) {
      
      if (this.shouldSendAlert(alertKey + '_attention')) {
        await this.notificationService.sendAttentionAlert(
          'Temperatura',
          `${temperature.toFixed(1)}°C`,
          temperature >= this.thresholds.temperature.attention.max 
            ? 'Temperatura elevada' 
            : 'Temperatura baixa'
        );
        this.updateLastAlert(alertKey + '_attention');
      }
    }
  }

  private async checkHeartRate(heartRate: number): Promise<void> {
    const alertKey = 'heartRate';
    
    if (heartRate <= this.thresholds.heartRate.critical.min || 
        heartRate >= this.thresholds.heartRate.critical.max) {
      
      if (this.shouldSendAlert(alertKey + '_critical')) {
        await this.notificationService.sendCriticalAlert(
          'Frequência Cardíaca',
          `${heartRate} bpm`,
          heartRate >= this.thresholds.heartRate.critical.max 
            ? 'Taquicardia severa!' 
            : 'Bradicardia severa!'
        );
        this.updateLastAlert(alertKey + '_critical');
      }
    } else if (heartRate <= this.thresholds.heartRate.attention.min || 
               heartRate >= this.thresholds.heartRate.attention.max) {
      
      if (this.shouldSendAlert(alertKey + '_attention')) {
        await this.notificationService.sendAttentionAlert(
          'Frequência Cardíaca',
          `${heartRate} bpm`,
          heartRate >= this.thresholds.heartRate.attention.max 
            ? 'Batimentos acelerados' 
            : 'Batimentos lentos'
        );
        this.updateLastAlert(alertKey + '_attention');
      }
    }
  }

  private async checkRespiratoryRate(respiratoryRate: number): Promise<void> {
    const alertKey = 'respiratoryRate';
    
    if (respiratoryRate <= this.thresholds.respiratoryRate.critical.min || 
        respiratoryRate >= this.thresholds.respiratoryRate.critical.max) {
      
      if (this.shouldSendAlert(alertKey + '_critical')) {
        await this.notificationService.sendCriticalAlert(
          'Frequência Respiratória',
          `${respiratoryRate} rpm`,
          respiratoryRate >= this.thresholds.respiratoryRate.critical.max 
            ? 'Respiração muito rápida!' 
            : 'Respiração muito lenta!'
        );
        this.updateLastAlert(alertKey + '_critical');
      }
    } else if (respiratoryRate <= this.thresholds.respiratoryRate.attention.min || 
               respiratoryRate >= this.thresholds.respiratoryRate.attention.max) {
      
      if (this.shouldSendAlert(alertKey + '_attention')) {
        await this.notificationService.sendAttentionAlert(
          'Frequência Respiratória',
          `${respiratoryRate} rpm`,
          respiratoryRate >= this.thresholds.respiratoryRate.attention.max 
            ? 'Respiração acelerada' 
            : 'Respiração lenta'
        );
        this.updateLastAlert(alertKey + '_attention');
      }
    }
  }

  private async checkOxygenSaturation(oxygenSaturation: number): Promise<void> {
    const alertKey = 'oxygenSaturation';
    
    if (oxygenSaturation <= this.thresholds.oxygenSaturation.critical.min) {
      if (this.shouldSendAlert(alertKey + '_critical')) {
        await this.notificationService.sendCriticalAlert(
          'Saturação de Oxigênio',
          `${oxygenSaturation}%`,
          'Saturação crítica! Procure ajuda médica IMEDIATAMENTE!'
        );
        this.updateLastAlert(alertKey + '_critical');
      }
    } else if (oxygenSaturation <= this.thresholds.oxygenSaturation.attention.min) {
      if (this.shouldSendAlert(alertKey + '_attention')) {
        await this.notificationService.sendAttentionAlert(
          'Saturação de Oxigênio',
          `${oxygenSaturation}%`,
          'Saturação baixa - monitore de perto'
        );
        this.updateLastAlert(alertKey + '_attention');
      }
    }
  }

  private shouldSendAlert(alertKey: string): boolean {
    const lastAlert = this.lastAlerts.get(alertKey);
    const now = Date.now();
    
    if (!lastAlert || (now - lastAlert) > this.alertCooldown) {
      return true;
    }
    
    return false;
  }

  private updateLastAlert(alertKey: string): void {
    this.lastAlerts.set(alertKey, Date.now());
  }

  // Configurar thresholds personalizados
  setThresholds(newThresholds: Partial<VitalThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('Thresholds atualizados:', this.thresholds);
  }

  // Configurar cooldown entre alertas
  setAlertCooldown(minutes: number): void {
    this.alertCooldown = minutes * 60 * 1000;
    console.log(`Cooldown configurado para ${minutes} minutos`);
  }

  // Limpar histórico de alertas
  clearAlertHistory(): void {
    this.lastAlerts.clear();
    console.log('Histórico de alertas limpo');
  }

  // Obter status atual dos thresholds
  getThresholds(): VitalThresholds {
    return { ...this.thresholds };
  }
}

export default VitalMonitoringService;