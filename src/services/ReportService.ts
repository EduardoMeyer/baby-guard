import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export interface PatientInfo {
  name: string;
  birthDate: string;
  weight: string;
  height: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface VitalRecord {
  timestamp: string;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  movement: string;
  status: 'normal' | 'attention' | 'emergency';
}

export interface ReportData {
  patient: PatientInfo;
  period: {
    start: string;
    end: string;
  };
  vitals: VitalRecord[];
  alerts: Array<{
    time: string;
    type: string;
    severity: string;
    message: string;
  }>;
  summary: {
    totalReadings: number;
    normalReadings: number;
    attentionReadings: number;
    emergencyReadings: number;
    avgTemperature: number;
    avgHeartRate: number;
    avgRespiratoryRate: number;
    avgOxygenSaturation: number;
  };
}

class ReportService {
  private static instance: ReportService;

  static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  private generateHTMLReport(data: ReportData): string {
    const { patient, period, vitals, alerts, summary } = data;
    
    return `
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
            .section { margin-bottom: 20px; padding: 15px; background: #F8FAFC; border-left: 3px solid #3B82F6; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #ddd; }
            .summary-grid { display: flex; justify-content: space-around; margin: 15px 0; }
            .summary-item { text-align: center; padding: 10px; background: white; border: 1px solid #ddd; }
            .summary-number { font-size: 20px; font-weight: bold; color: #3B82F6; }
            .summary-label { font-size: 10px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 6px; border: 1px solid #ddd; text-align: center; font-size: 10px; }
            th { background: #3B82F6; color: white; }
            .status-normal { color: #10B981; }
            .status-attention { color: #F59E0B; }
            .status-emergency { color: #EF4444; }
            .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">BabyGuard</div>
            <div>Relatório Médico de Monitoramento</div>
            <div><strong>Período:</strong> ${period.start} até ${period.end}</div>
        </div>

        <div class="section">
            <div class="section-title">Informações do Paciente</div>
            <div class="info-row"><span>Nome:</span><span>${patient.name}</span></div>
            <div class="info-row"><span>Nascimento:</span><span>${patient.birthDate}</span></div>
            <div class="info-row"><span>Peso:</span><span>${patient.weight}</span></div>
            <div class="info-row"><span>Altura:</span><span>${patient.height}</span></div>
            <div class="info-row"><span>Responsável:</span><span>${patient.parentName}</span></div>
            <div class="info-row"><span>Telefone:</span><span>${patient.parentPhone}</span></div>
            <div class="info-row"><span>Email:</span><span>${patient.parentEmail}</span></div>
        </div>

        <div class="section">
            <div class="section-title">Resumo Executivo</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number">${summary.totalReadings}</div>
                    <div class="summary-label">Total Leituras</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.normalReadings}</div>
                    <div class="summary-label">Normais</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.attentionReadings}</div>
                    <div class="summary-label">Atenção</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.emergencyReadings}</div>
                    <div class="summary-label">Emergência</div>
                </div>
            </div>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number">${summary.avgTemperature.toFixed(1)}°C</div>
                    <div class="summary-label">Temp Média</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.avgHeartRate.toFixed(0)}</div>
                    <div class="summary-label">BPM Médio</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.avgRespiratoryRate.toFixed(0)}</div>
                    <div class="summary-label">RPM Médio</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${summary.avgOxygenSaturation.toFixed(0)}%</div>
                    <div class="summary-label">SpO2 Médio</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Histórico de Sinais Vitais</div>
            <table>
                <tr>
                    <th>Horário</th>
                    <th>Temp</th>
                    <th>BPM</th>
                    <th>RPM</th>
                    <th>SpO2</th>
                    <th>Status</th>
                </tr>
                ${vitals.slice(-10).reverse().map(vital => `
                <tr>
                    <td>${vital.timestamp}</td>
                    <td>${vital.temperature.toFixed(1)}°C</td>
                    <td>${vital.heartRate}</td>
                    <td>${vital.respiratoryRate}</td>
                    <td>${vital.oxygenSaturation}%</td>
                    <td class="status-${vital.status}">${vital.status === 'normal' ? 'OK' : vital.status === 'attention' ? 'ATENÇÃO' : 'EMERG'}</td>
                </tr>
                `).join('')}
            </table>
        </div>

        <div class="footer">
            <p><strong>BabyGuard - Sistema de Monitoramento Infantil</strong></p>
            <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </body>
    </html>
    `;
  }

  async generateReport(data: ReportData): Promise<string> {
    try {
      const html = this.generateHTMLReport(data);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        width: 612,
        height: 792,
        margins: {
          left: 20,
          top: 20,
          right: 20,
          bottom: 20,
        },
      });

      return uri;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha na geração do PDF: ' + (error as Error).message);
    }
  }

  async shareReport(uri: string, filename: string = 'relatorio-babyguard.pdf'): Promise<void> {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartilhar Relatório Médico',
        });
      } else {
        throw new Error('Compartilhamento não disponível neste dispositivo');
      }
    } catch (error) {
      console.error('Erro ao compartilhar relatório:', error);
      throw new Error('Falha no compartilhamento: ' + (error as Error).message);
    }
  }

  // Gerar dados mock para teste
  generateMockData(): ReportData {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      patient: {
        name: 'João Pedro Silva',
        birthDate: '15/03/2024',
        weight: '4.2 kg',
        height: '52 cm',
        parentName: 'Maria Silva',
        parentPhone: '(11) 99999-9999',
        parentEmail: 'maria.silva@email.com',
        allergies: 'Nenhuma alergia conhecida',
        medicalHistory: 'Nascimento normal, sem complicações'
      },
      period: {
        start: yesterday.toLocaleString('pt-BR'),
        end: now.toLocaleString('pt-BR')
      },
      vitals: Array.from({ length: 50 }, (_, i) => ({
        timestamp: new Date(yesterday.getTime() + (i * 30 * 60 * 1000)).toLocaleTimeString('pt-BR'),
        temperature: 36.5 + Math.random() * 2,
        heartRate: 120 + Math.random() * 40,
        respiratoryRate: 30 + Math.random() * 20,
        oxygenSaturation: 95 + Math.random() * 5,
        movement: ['active', 'sleeping', 'restless'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.8 ? 'attention' : Math.random() > 0.95 ? 'emergency' : 'normal'
      })) as VitalRecord[],
      alerts: [
        {
          time: '14:30',
          type: 'Temperatura',
          severity: 'attention',
          message: 'Temperatura elevada detectada (37.8°C)'
        },
        {
          time: '09:15',
          type: 'SpO2',
          severity: 'emergency',
          message: 'Saturação de oxigênio baixa (92%)'
        }
      ],
      summary: {
        totalReadings: 50,
        normalReadings: 42,
        attentionReadings: 6,
        emergencyReadings: 2,
        avgTemperature: 36.8,
        avgHeartRate: 135,
        avgRespiratoryRate: 38,
        avgOxygenSaturation: 97
      }
    };
  }
}

export default ReportService;