export interface AlertData {
  id: string;
  title: string;
  value: string;
  message: string;
  protocol: string;
  time: string;
  severity: 'emergency' | 'attention' | 'monitoring' | 'good';
  icon: string;
  tipType: string;
}

export const alertsData: AlertData[] = [
  {
    id: '1',
    title: 'Temperatura Elevada',
    value: '37.8°C',
    message: 'Temperatura corporal acima do normal',
    protocol: 'Ação Imediata: Remova o excesso de roupas, ofereça líquidos se o bebê estiver acordado. Monitore a cada 15 minutos. Se persistir acima de 38°C por mais de 1 hora, procure atendimento médico.',
    time: '14:30',
    severity: 'attention',
    icon: 'thermometer',
    tipType: 'temperature',
  },
  {
    id: '2',
    title: 'Saturação Baixa',
    value: '92%',
    message: 'Nível de oxigenação abaixo do recomendado',
    protocol: 'Ação Imediata: Reposicione o bebê, verifique as vias aéreas e remova qualquer obstrução visível. Se o nível persistir abaixo de 92% por 5 minutos, procure atendimento médico URGENTE.',
    time: '13:45',
    severity: 'emergency',
    icon: 'water',
    tipType: 'oxygen',
  },
  {
    id: '3',
    title: 'Batimentos Acelerados',
    value: '145 bpm',
    message: 'Frequência cardíaca ligeiramente elevada',
    protocol: 'Ação Imediata: Verifique se o bebê está agitado, com fome ou desconfortável. Acalme o ambiente, reduza estímulos. Monitore por 10 minutos. Se persistir acima de 150 bpm em repouso, consulte pediatra.',
    time: '12:15',
    severity: 'attention',
    icon: 'heart',
    tipType: 'heartrate',
  },
  {
    id: '4',
    title: 'Movimento Irregular',
    value: 'Agitado',
    message: 'Bebê apresentando movimentos agitados',
    protocol: 'Monitoramento: Observe padrões de movimento, verifique fome, fralda suja ou desconforto. Tente acalmar com voz suave ou toque gentil. Se agitação persistir por mais de 30 minutos, avalie outros sinais.',
    time: '11:30',
    severity: 'monitoring',
    icon: 'body',
    tipType: 'movement',
  },
  {
    id: '5',
    title: 'Sinais Vitais Normais',
    value: 'Todos OK',
    message: 'Todos os sinais vitais estão dentro dos parâmetros normais',
    protocol: 'Continue o monitoramento regular. Mantenha ambiente calmo e confortável. Próxima verificação em 2 horas ou conforme rotina estabelecida.',
    time: '10:00',
    severity: 'good',
    icon: 'checkmark-circle',
    tipType: 'general',
  },
  {
    id: '6',
    title: 'Respiração Irregular',
    value: '22 rpm',
    message: 'Frequência respiratória abaixo do normal',
    protocol: 'Ação Imediata: Observe o padrão respiratório por 2 minutos. Verifique se há obstrução nasal. Estimule gentilmente se necessário. Se frequência permanecer abaixo de 25 rpm, procure atendimento médico.',
    time: '09:15',
    severity: 'attention',
    icon: 'pulse',
    tipType: 'breathing',
  },
];

export const getSeverityConfig = (severity: AlertData['severity']) => {
  switch (severity) {
    case 'emergency':
      return {
        color: '#F44336',
        backgroundColor: '#F44336' + '15',
        borderColor: '#F44336',
        label: 'EMERGÊNCIA',
      };
    case 'attention':
      return {
        color: '#FF9800',
        backgroundColor: '#FF9800' + '15',
        borderColor: '#FF9800',
        label: 'ATENÇÃO IMEDIATA',
      };
    case 'monitoring':
      return {
        color: '#FFC107',
        backgroundColor: '#FFC107' + '15',
        borderColor: '#FFC107',
        label: 'MONITORAMENTO',
      };
    case 'good':
      return {
        color: '#4CAF50',
        backgroundColor: '#4CAF50' + '15',
        borderColor: '#4CAF50',
        label: 'NORMAL',
      };
  }
};