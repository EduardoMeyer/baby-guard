export interface TipData {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  details: string;
  tipType: string;
}

export const tipsData: TipData[] = [
  {
    id: '1',
    title: 'Batimentos Cardíacos Normais',
    category: 'Sinais Vitais',
    icon: 'heart',
    summary: 'Valores normais de frequência cardíaca por idade',
    details: 'Recém-nascidos (0-3 meses): 100-150 bpm\nBebês (3-6 meses): 90-120 bpm\nBebês (6-12 meses): 80-120 bpm\n\nVariações são normais durante:\n• Sono (mais baixa)\n• Alimentação (mais alta)\n• Choro ou agitação (mais alta)\n\nProcure ajuda se:\n• Frequência persistir abaixo de 80 bpm\n• Frequência persistir acima de 160 bpm em repouso',
    tipType: 'heartrate',
  },
  {
    id: '2',
    title: 'Temperatura Ideal Durante o Sono',
    category: 'Conforto',
    icon: 'thermometer',
    summary: 'Faixa de temperatura segura para o bebê',
    details: 'Temperatura corporal normal:\n• 36.1°C - 37.2°C (axilar)\n• 36.6°C - 37.6°C (retal)\n\nAmbiente ideal:\n• Quarto: 18°C - 21°C\n• Umidade: 40% - 60%\n\nSinais de superaquecimento:\n• Suor excessivo\n• Pele avermelhada\n• Respiração acelerada\n• Irritabilidade\n\nSinais de frio:\n• Pele pálida ou azulada\n• Tremores\n• Letargia',
    tipType: 'temperature',
  },
  {
    id: '3',
    title: 'Quando Procurar o Pediatra',
    category: 'Emergência',
    icon: 'medical',
    summary: 'Sinais de alerta que requerem atenção médica',
    details: 'Procure atendimento IMEDIATO se:\n• Dificuldade respiratória\n• Coloração azulada (lábios, unhas)\n• Temperatura acima de 38°C (< 3 meses)\n• Vômitos persistentes\n• Letargia extrema\n• Convulsões\n\nConsulte o pediatra se:\n• Febre persistente por mais de 24h\n• Mudanças no padrão de sono/alimentação\n• Choro inconsolável por mais de 2h\n• Erupções cutâneas inexplicáveis',
    tipType: 'general',
  },
  {
    id: '4',
    title: 'Padrão Respiratório Normal',
    category: 'Respiração',
    icon: 'pulse',
    summary: 'Como identificar respiração saudável',
    details: 'Frequência normal:\n• Recém-nascidos: 30-60 rpm\n• 1-12 meses: 25-40 rpm\n\nCaracterísticas normais:\n• Respiração regular e ritmada\n• Movimento suave do peito\n• Sem ruídos ou esforço\n\nSinais de alerta:\n• Respiração muito rápida (> 60 rpm)\n• Respiração muito lenta (< 25 rpm)\n• Pausas longas (> 20 segundos)\n• Retrações (afundamento do peito)\n• Ruídos ou chiados',
    tipType: 'breathing',
  },
  {
    id: '5',
    title: 'Saturação de Oxigênio',
    category: 'Oxigenação',
    icon: 'water',
    summary: 'Entendendo os níveis de oxigênio no sangue',
    details: 'Valores normais:\n• Bebês saudáveis: 95-100%\n• Mínimo aceitável: 92%\n\nFatores que podem afetar:\n• Posição do sensor\n• Movimento excessivo\n• Temperatura das mãos/pés\n• Esmalte nas unhas\n\nQuando se preocupar:\n• Saturação < 92% por mais de 5 minutos\n• Queda súbita nos valores\n• Sintomas associados (cianose, letargia)\n\nDicas para medição:\n• Use sensor no dedo do pé\n• Mantenha bebê calmo\n• Verifique se o sensor está bem posicionado',
    tipType: 'oxygen',
  },
  {
    id: '6',
    title: 'Movimentos e Comportamento',
    category: 'Desenvolvimento',
    icon: 'body',
    summary: 'Padrões normais de movimento e atividade',
    details: 'Movimentos normais por idade:\n\n0-2 meses:\n• Reflexos primitivos\n• Movimentos descoordenados\n• Períodos de quietude\n\n2-4 meses:\n• Maior controle da cabeça\n• Movimentos mais suaves\n• Interação visual\n\n4-6 meses:\n• Rolar\n• Alcançar objetos\n• Maior atividade acordado\n\nSinais de alerta:\n• Movimentos muito limitados\n• Rigidez ou flacidez excessiva\n• Assimetria nos movimentos\n• Perda de habilidades adquiridas',
    tipType: 'movement',
  },
];

export const getTipsByType = (tipType: string): TipData[] => {
  return tipsData.filter(tip => tip.tipType === tipType);
};

export const getAllTips = (): TipData[] => {
  return tipsData;
};