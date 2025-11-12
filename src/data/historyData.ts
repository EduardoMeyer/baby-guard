export interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

// Gerar dados históricos simulados
const generateHistoryData = (): HistoryRecord[] => {
  const data: HistoryRecord[] = [];
  const now = new Date();
  
  // Gerar dados para os últimos 30 dias
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    
    // 3-4 registros por dia
    const recordsPerDay = 3 + Math.floor(Math.random() * 2);
    
    for (let j = 0; j < recordsPerDay; j++) {
      const recordTime = new Date(date);
      recordTime.setHours(6 + (j * 6) + Math.floor(Math.random() * 3));
      recordTime.setMinutes(Math.floor(Math.random() * 60));
      
      data.push({
        id: `${i}-${j}`,
        date: recordTime.toLocaleDateString('pt-BR'),
        time: recordTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: recordTime.getTime(),
        temperature: Number((36.2 + Math.random() * 1.5).toFixed(1)),
        heartRate: Math.floor(110 + Math.random() * 35),
        respiratoryRate: Math.floor(28 + Math.random() * 20),
        oxygenSaturation: Math.floor(95 + Math.random() * 5),
      });
    }
  }
  
  return data.sort((a, b) => b.timestamp - a.timestamp);
};

export const historyData = generateHistoryData();

export type FilterPeriod = '24h' | '7d' | '30d';

export const filterDataByPeriod = (data: HistoryRecord[], period: FilterPeriod): HistoryRecord[] => {
  const now = new Date().getTime();
  let cutoffTime: number;
  
  switch (period) {
    case '24h':
      cutoffTime = now - (24 * 60 * 60 * 1000);
      break;
    case '7d':
      cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
      break;
    default:
      cutoffTime = 0;
  }
  
  return data.filter(record => record.timestamp >= cutoffTime);
};

export const prepareChartData = (data: HistoryRecord[], period: FilterPeriod) => {
  const filteredData = filterDataByPeriod(data, period);
  
  // Agrupar dados por período e calcular médias
  const groupedData = groupDataByPeriod(filteredData, period);
  
  return {
    labels: groupedData.map(group => group.label),
    datasets: [
      {
        data: groupedData.map(group => group.avgTemperature),
        color: () => '#FF6B9D',
        strokeWidth: 2,
      },
      {
        data: groupedData.map(group => group.avgHeartRate),
        color: () => '#4ECDC4',
        strokeWidth: 2,
      },
      {
        data: groupedData.map(group => group.avgRespiratoryRate),
        color: () => '#9C27B0',
        strokeWidth: 2,
      },
      {
        data: groupedData.map(group => group.avgOxygenSaturation),
        color: () => '#45B7D1',
        strokeWidth: 2,
      },
    ],
  };
};

const groupDataByPeriod = (data: HistoryRecord[], period: FilterPeriod) => {
  if (period === '24h') {
    // Agrupar por hora
    const hourlyGroups: { [key: string]: HistoryRecord[] } = {};
    
    data.forEach(record => {
      const hour = record.time.substring(0, 2); // HH
      const key = `${hour}:00`;
      if (!hourlyGroups[key]) hourlyGroups[key] = [];
      hourlyGroups[key].push(record);
    });
    
    return Object.entries(hourlyGroups)
      .map(([label, records]) => ({
        label,
        avgTemperature: Number((records.reduce((sum, r) => sum + r.temperature, 0) / records.length).toFixed(1)),
        avgHeartRate: Math.round(records.reduce((sum, r) => sum + r.heartRate, 0) / records.length),
        avgRespiratoryRate: Math.round(records.reduce((sum, r) => sum + r.respiratoryRate, 0) / records.length),
        avgOxygenSaturation: Math.round(records.reduce((sum, r) => sum + r.oxygenSaturation, 0) / records.length),
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 12); // Máximo 12 pontos
  }
  
  if (period === '7d') {
    // Agrupar por dia
    const dailyGroups: { [key: string]: HistoryRecord[] } = {};
    
    data.forEach(record => {
      const day = record.date.substring(0, 5); // DD/MM
      if (!dailyGroups[day]) dailyGroups[day] = [];
      dailyGroups[day].push(record);
    });
    
    return Object.entries(dailyGroups)
      .map(([label, records]) => ({
        label,
        avgTemperature: Number((records.reduce((sum, r) => sum + r.temperature, 0) / records.length).toFixed(1)),
        avgHeartRate: Math.round(records.reduce((sum, r) => sum + r.heartRate, 0) / records.length),
        avgRespiratoryRate: Math.round(records.reduce((sum, r) => sum + r.respiratoryRate, 0) / records.length),
        avgOxygenSaturation: Math.round(records.reduce((sum, r) => sum + r.oxygenSaturation, 0) / records.length),
      }))
      .slice(-7); // Últimos 7 dias
  }
  
  // 30 dias - agrupar por semana
  const weeklyGroups: { [key: string]: HistoryRecord[] } = {};
  
  data.forEach(record => {
    const date = new Date(record.timestamp);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekLabel = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!weeklyGroups[weekLabel]) weeklyGroups[weekLabel] = [];
    weeklyGroups[weekLabel].push(record);
  });
  
  return Object.entries(weeklyGroups)
    .map(([label, records]) => ({
      label,
      avgTemperature: Number((records.reduce((sum, r) => sum + r.temperature, 0) / records.length).toFixed(1)),
      avgHeartRate: Math.round(records.reduce((sum, r) => sum + r.heartRate, 0) / records.length),
      avgRespiratoryRate: Math.round(records.reduce((sum, r) => sum + r.respiratoryRate, 0) / records.length),
      avgOxygenSaturation: Math.round(records.reduce((sum, r) => sum + r.oxygenSaturation, 0) / records.length),
    }))
    .slice(-4); // Últimas 4 semanas
};