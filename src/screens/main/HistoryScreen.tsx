import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { historyData, FilterPeriod, prepareChartData, filterDataByPeriod } from '../../data/historyData';
import ReportService from '../../services/ReportService';
import VitalMonitoringService from '../../services/VitalMonitoringService';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },

  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  scrollContent: {
    padding: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  periodFilters: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  metricFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  filterButtonText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  metricButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  metricButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  metricButtonText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  metricButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timelineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 6,
  },
  timelineDate: {
    fontSize: 12,
    color: '#64748B',
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalMini: {
    alignItems: 'center',
  },
  vitalMiniIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  vitalMiniValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
});

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  gradient: string[];
  icon: keyof typeof Ionicons.glyphMap;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, gradient, icon }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#F44336';
      default: return '#FF9800';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <LinearGradient colors={gradient} style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={styles.statIconContainer}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={[styles.trendBadge, { backgroundColor: getTrendColor() + '30' }]}>
            <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()} />
          </View>
        </View>
        
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{typeof value === 'number' ? value.toFixed(1) : value}</Text>
        <Text style={styles.statChange}>{change}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

interface TimelineItemProps {
  record: any;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ record, isLast }) => {
  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        if (value >= 38.5 || value <= 35.0) return '#FF5252';
        if (value >= 37.8 || value <= 35.5) return '#FF9800';
        return '#4CAF50';
      case 'heartRate':
        if (value >= 180 || value <= 80) return '#FF5252';
        if (value >= 160 || value <= 90) return '#FF9800';
        return '#4CAF50';
      default:
        return '#4CAF50';
    }
  };

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: getStatusColor(record.temperature, 'temperature') }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      
      <View style={styles.timelineContent}>
        <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <View style={styles.timelineTime}>
              <Ionicons name="time" size={16} color="#64748B" />
              <Text style={styles.timelineTimeText}>{record.time}</Text>
            </View>
            <Text style={styles.timelineDate}>{record.date}</Text>
          </View>
          
          <View style={styles.vitalsRow}>
            <View style={styles.vitalMini}>
              <View style={[styles.vitalMiniIcon, { backgroundColor: '#FF6B6B20' }]}>
                <Ionicons name="thermometer" size={14} color="#FF6B6B" />
              </View>
              <Text style={styles.vitalMiniValue}>{record.temperature}°C</Text>
            </View>
            
            <View style={styles.vitalMini}>
              <View style={[styles.vitalMiniIcon, { backgroundColor: '#FF6B9D20' }]}>
                <Ionicons name="heart" size={14} color="#FF6B9D" />
              </View>
              <Text style={styles.vitalMiniValue}>{record.heartRate}</Text>
            </View>
            
            <View style={styles.vitalMini}>
              <View style={[styles.vitalMiniIcon, { backgroundColor: '#4ECDC420' }]}>
                <Ionicons name="pulse" size={14} color="#4ECDC4" />
              </View>
              <Text style={styles.vitalMiniValue}>{record.respiratoryRate}</Text>
            </View>
            
            <View style={styles.vitalMini}>
              <View style={[styles.vitalMiniIcon, { backgroundColor: '#667eea20' }]}>
                <Ionicons name="water" size={14} color="#667eea" />
              </View>
              <Text style={styles.vitalMiniValue}>{record.oxygenSaturation}%</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export const HistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation'>('temperature');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const chartData = prepareChartData(historyData, selectedPeriod);
  const filteredRecords = filterDataByPeriod(historyData, selectedPeriod).slice(0, 15);
  const reportService = ReportService.getInstance();
  const vitalMonitoringService = VitalMonitoringService.getInstance();

  useEffect(() => {
    // Inicializar serviço de monitoramento
    vitalMonitoringService.initialize();
  }, []);

  const getMetricData = () => {
    const data = filteredRecords.map(record => record[selectedMetric]);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    return { avg: avg.toFixed(1), max, min, trend: data[0] > data[data.length - 1] ? 'down' : 'up' };
  };

  const metricData = getMetricData();

  const handleExportReport = async () => {
    try {
      setIsGeneratingReport(true);
      
      // Usar dados mock para teste
      const reportData = reportService.generateMockData();
      
      // Sobrescrever com dados reais do histórico
      reportData.vitals = filteredRecords.slice(0, 15).map(record => ({
        timestamp: `${record.time}`,
        temperature: record.temperature,
        heartRate: record.heartRate,
        respiratoryRate: record.respiratoryRate,
        oxygenSaturation: record.oxygenSaturation,
        movement: 'normal',
        status: getVitalStatus(record)
      }));
      
      reportData.summary = {
        totalReadings: filteredRecords.length,
        normalReadings: filteredRecords.filter(r => getVitalStatus(r) === 'normal').length,
        attentionReadings: filteredRecords.filter(r => getVitalStatus(r) === 'attention').length,
        emergencyReadings: filteredRecords.filter(r => getVitalStatus(r) === 'emergency').length,
        avgTemperature: filteredRecords.reduce((sum, r) => sum + r.temperature, 0) / filteredRecords.length || 36.5,
        avgHeartRate: filteredRecords.reduce((sum, r) => sum + r.heartRate, 0) / filteredRecords.length || 120,
        avgRespiratoryRate: filteredRecords.reduce((sum, r) => sum + r.respiratoryRate, 0) / filteredRecords.length || 35,
        avgOxygenSaturation: filteredRecords.reduce((sum, r) => sum + r.oxygenSaturation, 0) / filteredRecords.length || 98
      };

      console.log('Gerando PDF...');
      const pdfUri = await reportService.generateReport(reportData);
      console.log('PDF gerado:', pdfUri);
      
      console.log('Compartilhando PDF...');
      await reportService.shareReport(pdfUri);
      
    } catch (error) {
      console.error('Erro completo:', error);
      Alert.alert(
        'Erro ao Gerar Relatório',
        `Detalhes: ${(error as Error).message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getVitalStatus = (record: any): 'normal' | 'attention' | 'emergency' => {
    // Temperatura
    if (record.temperature >= 38.5 || record.temperature <= 35.0) return 'emergency';
    if (record.temperature >= 37.8 || record.temperature <= 35.5) return 'attention';
    
    // Frequência cardíaca
    if (record.heartRate >= 180 || record.heartRate <= 80) return 'emergency';
    if (record.heartRate >= 160 || record.heartRate <= 90) return 'attention';
    
    // Saturação de oxigênio
    if (record.oxygenSaturation <= 90) return 'emergency';
    if (record.oxygenSaturation <= 95) return 'attention';
    
    // Frequência respiratória
    if (record.respiratoryRate >= 60 || record.respiratoryRate <= 20) return 'emergency';
    if (record.respiratoryRate >= 50 || record.respiratoryRate <= 25) return 'attention';
    
    return 'normal';
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Histórico</Text>
        <Text style={styles.title}>Análise Detalhada</Text>
        <Text style={styles.subtitle}>Acompanhe a evolução dos sinais vitais</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Estatísticas */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatCard
              title="Média Temperatura"
              value={filteredRecords.reduce((sum, r) => sum + r.temperature, 0) / filteredRecords.length || 0}
              change="Últimos registros"
              trend={filteredRecords[0]?.temperature > filteredRecords[filteredRecords.length - 1]?.temperature ? 'down' : 'up'}
              gradient={['#FF6B6B', '#FF8E8E']}
              icon="thermometer"
            />
            
            <StatCard
              title="Média Batimentos"
              value={Math.round(filteredRecords.reduce((sum, r) => sum + r.heartRate, 0) / filteredRecords.length || 0)}
              change="BPM médio"
              trend="stable"
              gradient={['#FF6B9D', '#FF8FB3']}
              icon="heart"
            />
            
            <StatCard
              title="Média Respiração"
              value={Math.round(filteredRecords.reduce((sum, r) => sum + r.respiratoryRate, 0) / filteredRecords.length || 0)}
              change="RPM médio"
              trend="stable"
              gradient={['#4ECDC4', '#44A08D']}
              icon="pulse"
            />
            
            <StatCard
              title="Média Saturação"
              value={Math.round(filteredRecords.reduce((sum, r) => sum + r.oxygenSaturation, 0) / filteredRecords.length || 0)}
              change="SpO2 médio"
              trend="up"
              gradient={['#667eea', '#764ba2']}
              icon="water"
            />
          </View>
        </View>

        {/* Gráfico Interativo */}
        <View style={styles.chartSection}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.chartCard}>
            <Text style={styles.chartTitle}>Tendências dos Sinais Vitais</Text>
            
            <View style={styles.filtersContainer}>
              {/* Filtros de Período */}
              <View style={styles.periodFilters}>
                {(['24h', '7d', '30d'] as FilterPeriod[]).map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.filterButton,
                      selectedPeriod === period && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedPeriod === period && styles.filterButtonTextActive,
                    ]}>
                      {period === '24h' ? '24h' : period === '7d' ? '7 dias' : '30 dias'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Filtros de Métrica */}
              <View style={styles.metricFilters}>
                {[
                  { key: 'temperature', label: 'Temp' },
                  { key: 'heartRate', label: 'BPM' },
                  { key: 'respiratoryRate', label: 'Resp' },
                  { key: 'oxygenSaturation', label: 'SpO2' }
                ].map((metric) => (
                  <TouchableOpacity
                    key={metric.key}
                    style={[
                      styles.metricButton,
                      selectedMetric === metric.key && styles.metricButtonActive,
                    ]}
                    onPress={() => setSelectedMetric(metric.key as any)}
                  >
                    <Text style={[
                      styles.metricButtonText,
                      selectedMetric === metric.key && styles.metricButtonTextActive,
                    ]}>
                      {metric.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Gráfico */}
            <LineChart
              data={chartData}
              width={width - 88}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.8})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '5',
                  strokeWidth: '3',
                  stroke: '#FFFFFF',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: 'rgba(255,255,255,0.2)',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />

          </LinearGradient>
        </View>
        
        {/* Timeline de Registros */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>📋 Timeline de Registros</Text>
          
          {filteredRecords.map((record, index) => (
            <TimelineItem
              key={record.id}
              record={record}
              isLast={index === filteredRecords.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;