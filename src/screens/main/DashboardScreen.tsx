import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/MockAuthContext';
import { useVitals } from '../../contexts/VitalsContext';
import { ConnectionStatus } from '../../components/common/ConnectionStatus';
import { RootStackParamList } from '../../navigation/types';
import VitalMonitoringService from '../../services/VitalMonitoringService';

const { width } = Dimensions.get('window');

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

interface VitalCardProps {
  title: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: 'normal' | 'warning' | 'critical';
  gradient: string[];
  description: string;
}

const VitalCard: React.FC<VitalCardProps> = ({ title, value, unit, icon, status, gradient, description }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();

    if (status === 'critical') {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#FF5252';
      case 'warning': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'critical': return 'CRÍTICO';
      case 'warning': return 'ATENÇÃO';
      default: return 'NORMAL';
    }
  };

  const cardStyles = StyleSheet.create({
    vitalCard: {
      width: (width - 60) / 2,
      marginBottom: 30,
      borderRadius: 24,
      padding: 20,
      minHeight: 180,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 12,
    },
    vitalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    vitalIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    vitalTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 8,
    },
    vitalValueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 8,
    },
    vitalValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    vitalUnit: {
      fontSize: 16,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.8)',
      marginLeft: 4,
    },
    vitalDescription: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 18,
      fontWeight: '500',
      flexWrap: 'wrap',
    },
  });

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }, { scale: pulseAnim }]
    }}>
      <LinearGradient colors={gradient} style={cardStyles.vitalCard}>
        <View style={cardStyles.vitalHeader}>
          <View style={cardStyles.vitalIconContainer}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={[cardStyles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={cardStyles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
        
        <Text style={cardStyles.vitalTitle}>{title}</Text>
        
        <View style={cardStyles.vitalValueContainer}>
          <Text style={cardStyles.vitalValue}>{value}</Text>
          <Text style={cardStyles.vitalUnit}>{unit}</Text>
        </View>
        
        <Text style={cardStyles.vitalDescription} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, subtitle, icon, color, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const actionStyles = StyleSheet.create({
    actionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderLeftWidth: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 14,
      color: '#64748B',
      lineHeight: 20,
      flexWrap: 'wrap',
    },
  });

  return (
    <TouchableOpacity 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[
        actionStyles.actionCard, 
        { borderLeftColor: color, transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={[actionStyles.actionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={actionStyles.actionContent}>
          <Text style={actionStyles.actionTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={actionStyles.actionSubtitle} numberOfLines={2} ellipsizeMode="tail">
            {subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { vitals, isConnected, connectionStatus, latency, testConnection, refreshVitals, loading } = useVitals();
  const [refreshing, setRefreshing] = useState(false);
  const [vitalMonitoringService] = useState(() => VitalMonitoringService.getInstance());
  const [previousVitals, setPreviousVitals] = useState(vitals);

  // Inicializar serviço de monitoramento
  useEffect(() => {
    vitalMonitoringService.initialize();
  }, []);

  // Monitorar mudanças nos sinais vitais e disparar notificações
  useEffect(() => {
    const hasSignificantChange = (
      Math.abs(vitals.temperature - previousVitals.temperature) > 0.5 ||
      Math.abs(vitals.heartRate - previousVitals.heartRate) > 10 ||
      Math.abs(vitals.respiratoryRate - previousVitals.respiratoryRate) > 5 ||
      Math.abs(vitals.oxygenSaturation - previousVitals.oxygenSaturation) > 2
    );

    if (hasSignificantChange && isConnected) {
      vitalMonitoringService.analyzeVitals({
        temperature: vitals.temperature,
        heartRate: vitals.heartRate,
        respiratoryRate: vitals.respiratoryRate,
        oxygenSaturation: vitals.oxygenSaturation,
        timestamp: new Date().toISOString(),
      });
      
      setPreviousVitals(vitals);
    }
  }, [vitals, isConnected, previousVitals]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshVitals();
    } finally {
      setRefreshing(false);
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp >= 38.5 || temp <= 35.0) return 'critical';
    if (temp >= 37.8 || temp <= 35.5) return 'warning';
    return 'normal';
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr >= 180 || hr <= 80) return 'critical';
    if (hr >= 160 || hr <= 90) return 'warning';
    return 'normal';
  };

  const getRespiratoryStatus = (rr: number) => {
    if (rr >= 60 || rr <= 20) return 'critical';
    if (rr >= 50 || rr <= 25) return 'warning';
    return 'normal';
  };

  const getOxygenStatus = (spo2: number) => {
    if (spo2 <= 90) return 'critical';
    if (spo2 <= 94) return 'warning';
    return 'normal';
  };

  const getMovementStatus = (movement: string) => {
    if (movement === 'restless') return 'warning';
    return 'normal';
  };

  const getMovementText = (movement: string) => {
    switch (movement) {
      case 'active': return 'Ativo';
      case 'sleeping': return 'Dormindo';
      case 'restless': return 'Agitado';
      default: return 'Desconhecido';
    }
  };

  const getTemperatureDescription = (temp: number) => {
    if (temp >= 38.5) return 'Febre alta - Procure médico';
    if (temp >= 37.8) return 'Febre baixa - Monitore';
    if (temp <= 35.0) return 'Hipotermia - Urgente!';
    if (temp <= 35.5) return 'Temperatura baixa';
    return 'Temperatura ideal';
  };

  const getHeartRateDescription = (hr: number) => {
    if (hr >= 180) return 'Taquicardia severa';
    if (hr >= 160) return 'Frequência elevada';
    if (hr <= 80) return 'Bradicardia severa';
    if (hr <= 90) return 'Frequência baixa';
    return 'Ritmo cardíaco normal';
  };

  const getRespiratoryDescription = (rr: number) => {
    if (rr >= 60) return 'Respiração muito rápida';
    if (rr >= 50) return 'Respiração acelerada';
    if (rr <= 20) return 'Respiração muito lenta';
    if (rr <= 25) return 'Respiração lenta';
    return 'Respiração normal';
  };

  const getOxygenDescription = (spo2: number) => {
    if (spo2 <= 90) return 'Saturação crítica';
    if (spo2 <= 94) return 'Saturação baixa';
    return 'Oxigenação excelente';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    greeting: {
      fontSize: 16,
      color: '#64748B',
      marginBottom: 4,
    },
    userName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: '#64748B',
    },
    scrollContainer: {
      padding: 20,
    },
    healthStatusSection: {
      marginBottom: 24,
    },
    healthStatusCard: {
      borderRadius: 24,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
    },
    healthStatusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    healthStatusTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: 12,
    },
    healthStatusSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 20,
    },
    vitalsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 16,
    },
    vitalsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    vitalCardFull: {
      width: width - 40,
      marginBottom: 16,
      borderRadius: 24,
      padding: 24,
      minHeight: 140,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 12,
    },
    vitalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    vitalIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    vitalTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 8,
    },
    vitalValueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 8,
    },
    vitalValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    vitalUnit: {
      fontSize: 16,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.8)',
      marginLeft: 4,
    },
    vitalDescription: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 18,
      fontWeight: '500',
      flexWrap: 'wrap',
    },
    actionsSection: {
      marginBottom: 24,
    },
    lastUpdate: {
      textAlign: 'center',
      fontSize: 12,
      color: '#64748B',
      marginTop: 16,
      fontStyle: 'italic',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.subtitle}>Monitorando seu bebê com carinho</Text>
        
        <View style={{ marginTop: 24 }}>
          <ConnectionStatus 
            isConnected={isConnected}
            isLoading={loading}
            latency={latency}
            onPress={testConnection}
          />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Geral de Saúde */}
        <View style={styles.healthStatusSection}>
          <LinearGradient 
            colors={[
              getTemperatureStatus(vitals.temperature) === 'critical' || 
              getHeartRateStatus(vitals.heartRate) === 'critical' ||
              getRespiratoryStatus(vitals.respiratoryRate) === 'critical' ||
              getOxygenStatus(vitals.oxygenSaturation) === 'critical' ? '#FF5252' :
              getTemperatureStatus(vitals.temperature) === 'warning' || 
              getHeartRateStatus(vitals.heartRate) === 'warning' ||
              getRespiratoryStatus(vitals.respiratoryRate) === 'warning' ||
              getOxygenStatus(vitals.oxygenSaturation) === 'warning' ? '#FF9800' : '#4CAF50',
              getTemperatureStatus(vitals.temperature) === 'critical' || 
              getHeartRateStatus(vitals.heartRate) === 'critical' ||
              getRespiratoryStatus(vitals.respiratoryRate) === 'critical' ||
              getOxygenStatus(vitals.oxygenSaturation) === 'critical' ? '#FF7979' :
              getTemperatureStatus(vitals.temperature) === 'warning' || 
              getHeartRateStatus(vitals.heartRate) === 'warning' ||
              getRespiratoryStatus(vitals.respiratoryRate) === 'warning' ||
              getOxygenStatus(vitals.oxygenSaturation) === 'warning' ? '#FFB74D' : '#81C784'
            ]}
            style={styles.healthStatusCard}
          >
            <View style={styles.healthStatusHeader}>
              <Ionicons 
                name={
                  getTemperatureStatus(vitals.temperature) === 'critical' || 
                  getHeartRateStatus(vitals.heartRate) === 'critical' ||
                  getRespiratoryStatus(vitals.respiratoryRate) === 'critical' ||
                  getOxygenStatus(vitals.oxygenSaturation) === 'critical' ? 'warning' :
                  getTemperatureStatus(vitals.temperature) === 'warning' || 
                  getHeartRateStatus(vitals.heartRate) === 'warning' ||
                  getRespiratoryStatus(vitals.respiratoryRate) === 'warning' ||
                  getOxygenStatus(vitals.oxygenSaturation) === 'warning' ? 'alert-circle' : 'checkmark-circle'
                } 
                size={32} 
                color="#FFFFFF" 
              />
              <Text style={styles.healthStatusTitle}>
                {
                  getTemperatureStatus(vitals.temperature) === 'critical' || 
                  getHeartRateStatus(vitals.heartRate) === 'critical' ||
                  getRespiratoryStatus(vitals.respiratoryRate) === 'critical' ||
                  getOxygenStatus(vitals.oxygenSaturation) === 'critical' ? 'ATENÇÃO URGENTE' :
                  getTemperatureStatus(vitals.temperature) === 'warning' || 
                  getHeartRateStatus(vitals.heartRate) === 'warning' ||
                  getRespiratoryStatus(vitals.respiratoryRate) === 'warning' ||
                  getOxygenStatus(vitals.oxygenSaturation) === 'warning' ? 'MONITORAR DE PERTO' : 'TUDO NORMAL'
                }
              </Text>
            </View>
            <Text style={styles.healthStatusSubtitle}>
              {
                getTemperatureStatus(vitals.temperature) === 'critical' || 
                getHeartRateStatus(vitals.heartRate) === 'critical' ||
                getRespiratoryStatus(vitals.respiratoryRate) === 'critical' ||
                getOxygenStatus(vitals.oxygenSaturation) === 'critical' ? 'Alguns sinais vitais estão fora do normal. Considere procurar ajuda médica.' :
                getTemperatureStatus(vitals.temperature) === 'warning' || 
                getHeartRateStatus(vitals.heartRate) === 'warning' ||
                getRespiratoryStatus(vitals.respiratoryRate) === 'warning' ||
                getOxygenStatus(vitals.oxygenSaturation) === 'warning' ? 'Alguns valores precisam de atenção. Continue monitorando.' : 'Todos os sinais vitais estão dentro dos parâmetros normais.'
              }
            </Text>
          </LinearGradient>
        </View>

        {/* Sinais Vitais */}
        <View style={styles.vitalsSection}>
          <Text style={styles.sectionTitle}>Sinais Vitais Detalhados</Text>
          
          <View style={styles.vitalsGrid}>
            <VitalCard
              title="Temperatura"
              value={vitals.temperature.toFixed(1)}
              unit="°C"
              icon="thermometer"
              status={getTemperatureStatus(vitals.temperature)}
              gradient={['#FF6B6B', '#FF8E8E']}
              description={getTemperatureDescription(vitals.temperature)}
            />
            
            <VitalCard
              title="Batimentos"
              value={vitals.heartRate.toString()}
              unit="bpm"
              icon="heart"
              status={getHeartRateStatus(vitals.heartRate)}
              gradient={['#FF6B9D', '#FF8FB3']}
              description={getHeartRateDescription(vitals.heartRate)}
            />
            
            <VitalCard
              title="Respiração"
              value={vitals.respiratoryRate.toString()}
              unit="rpm"
              icon="pulse"
              status={getRespiratoryStatus(vitals.respiratoryRate)}
              gradient={['#4ECDC4', '#44A08D']}
              description={getRespiratoryDescription(vitals.respiratoryRate)}
            />
            
            <VitalCard
              title="Saturação"
              value={vitals.oxygenSaturation.toString()}
              unit="%"
              icon="water"
              status={getOxygenStatus(vitals.oxygenSaturation)}
              gradient={['#667eea', '#764ba2']}
              description={getOxygenDescription(vitals.oxygenSaturation)}
            />
          </View>

          {/* Movimento - Card Full Width */}
          <LinearGradient 
            colors={['#f093fb', '#f5576c']} 
            style={styles.vitalCardFull}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalIconContainer}>
                <Ionicons name="body" size={24} color="#FFFFFF" />
              </View>
              <View style={[styles.statusBadge, { 
                backgroundColor: getMovementStatus(vitals.movement) === 'warning' ? '#FF9800' : '#4CAF50' 
              }]}>
                <Text style={styles.statusText}>
                  {getMovementStatus(vitals.movement) === 'warning' ? 'ATENÇÃO' : 'NORMAL'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.vitalTitle}>Estado do Bebê</Text>
            
            <View style={styles.vitalValueContainer}>
              <Text style={styles.vitalValue}>{getMovementText(vitals.movement)}</Text>
            </View>
            
            <Text style={styles.vitalDescription}>
              {vitals.movement === 'sleeping' ? 'Bebê descansando tranquilamente' :
               vitals.movement === 'active' ? 'Bebê acordado e ativo' :
               'Bebê agitado - verifique se precisa de atenção'}
            </Text>
          </LinearGradient>

          <Text style={styles.lastUpdate}>
            Última atualização: {vitals.lastUpdate.toLocaleString('pt-BR')}
          </Text>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <ActionCard
            title="Histórico Completo"
            subtitle="Visualizar dados anteriores e tendências"
            icon="analytics"
            color="#3B82F6"
            onPress={() => navigation.navigate('History')}
          />
          
          <ActionCard
            title="Alertas Ativos"
            subtitle="Gerenciar notificações e configurações"
            icon="notifications"
            color="#F59E0B"
            onPress={() => navigation.navigate('Alerts')}
          />
          
          <ActionCard
            title="Configurações"
            subtitle="Personalizar limites e preferências"
            icon="settings"
            color="#8B5CF6"
            onPress={() => navigation.navigate('Settings')}
          />

          <ActionCard
            title="Debug Arduino"
            subtitle="Testar conexão e diagnosticar problemas"
            icon="bug"
            color="#EF4444"
            onPress={() => navigation.navigate('Debug')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;