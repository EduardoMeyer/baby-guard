import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { alertsData } from '../../data/alertsData';
import { RootStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
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
  dashboardSection: {
    marginBottom: 24,
  },
  dashboardCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  statIcon: {
    marginBottom: 8,
  },
  filtersSection: {
    marginBottom: 24,
  },
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  alertsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  alertCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBadges: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pulseBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  alertMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  quickTipsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeaderContent: {
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAlertInfo: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalTime: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  urgencyContainer: {
    alignItems: 'center',
  },
  urgencyBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  urgencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  recommendationNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  modalActions: {
    marginTop: 20,
  },
  tipsButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  tipsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

const getSeverityGradient = (severity: string) => {
  switch (severity) {
    case 'emergency': return ['#EF4444', '#F87171'];
    case 'attention': return ['#F59E0B', '#FCD34D'];
    case 'monitoring': return ['#FFC107', '#FFE082'];
    case 'good': return ['#10B981', '#34D399'];
    default: return ['#10B981', '#34D399'];
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'emergency': return 'warning';
    case 'attention': return 'alert-circle';
    case 'monitoring': return 'eye';
    case 'good': return 'checkmark-circle';
    default: return 'checkmark-circle';
  }
};

const getPriorityText = (severity: string) => {
  switch (severity) {
    case 'emergency': return 'EMERGÊNCIA';
    case 'attention': return 'ATENÇÃO';
    case 'monitoring': return 'MONITORAR';
    case 'good': return 'NORMAL';
    default: return 'NORMAL';
  }
};

type AlertsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Alerts'>;

interface Props {
  navigation: AlertsScreenNavigationProp;
}

interface AlertCardProps {
  alert: any;
  onPress: () => void;
  onViewTips: (tipType: string) => void;
}

interface AlertDetailModalProps {
  alert: any;
  visible: boolean;
  onClose: () => void;
  onViewTips: (tipType: string) => void;
}

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, visible, onClose, onViewTips }) => {
  const getRecommendations = (type: string) => {
    switch (type) {
      case 'temperature':
        return [
          'Verifique se o bebê está com febre usando termômetro',
          'Mantenha o ambiente bem ventilado e fresco',
          'Ofereça líquidos frequentemente (leite materno/fórmula)',
          'Vista roupas leves se estiver com calor',
          'Consulte pediatra se temperatura persistir alterada'
        ];
      case 'heartRate':
        return [
          'Mantenha o bebê em ambiente calmo e tranquilo',
          'Verifique se não há desconforto ou dor',
          'Monitore a respiração e coloração da pele',
          'Evite estímulos excessivos (ruídos, luzes)',
          'Procure ajuda médica imediatamente se persistir'
        ];
      case 'respiratoryRate':
        return [
          'Observe se há dificuldade para respirar',
          'Mantenha vias aéreas desobstruídas',
          'Posicione o bebê adequadamente (decúbito dorsal)',
          'Verifique se não há objetos obstruindo',
          'Busque atendimento médico urgente'
        ];
      case 'oxygenSaturation':
        return [
          'Verifique coloração dos lábios e unhas',
          'Mantenha ambiente bem ventilado',
          'Observe sinais de cianose (coloração azulada)',
          'Não deixe o bebê sozinho',
          'Procure emergência médica imediatamente'
        ];
      default:
        return [
          'Monitore o bebê de perto constantemente',
          'Mantenha um ambiente calmo e seguro',
          'Registre todos os sintomas observados',
          'Tenha contatos médicos sempre à mão',
          'Consulte profissional de saúde quando necessário'
        ];
    }
  };

  if (!alert) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient colors={getSeverityGradient(alert.severity)} style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.modalAlertInfo}>
              <Ionicons name={getSeverityIcon(alert.severity)} size={32} color="#FFFFFF" />
              <Text style={styles.modalTitle}>{alert.title}</Text>
              <Text style={styles.modalTime}>{alert.time}</Text>
            </View>
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>📋 Descrição Detalhada</Text>
            <Text style={styles.modalDescription}>{alert.message}</Text>
          </View>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>⚡ Nível de Urgência</Text>
            <View style={styles.urgencyContainer}>
              <LinearGradient 
                colors={getSeverityGradient(alert.severity)} 
                style={styles.urgencyBadge}
              >
                <Text style={styles.urgencyText}>
                  {alert.severity === 'emergency' ? 'EMERGÊNCIA - Ação Imediata Necessária' :
                   alert.severity === 'attention' ? 'ATENÇÃO - Monitorar de Perto' :
                   alert.severity === 'monitoring' ? 'MONITORAMENTO - Acompanhar Evolução' :
                   'NORMAL - Tudo Bem'}
                </Text>
              </LinearGradient>
            </View>
          </View>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>💡 Recomendações Médicas</Text>
            {getRecommendations(alert.type).map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationBullet}>
                  <Text style={styles.recommendationNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.tipsButton}
              onPress={() => {
                onViewTips(alert.type);
                onClose();
              }}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.tipsButtonGradient}>
                <Ionicons name="bulb" size={20} color="#FFFFFF" />
                <Text style={styles.tipsButtonText}>Ver Guia Completo de Cuidados</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const EnhancedAlertCard: React.FC<AlertCardProps> = ({ alert, onPress, onViewTips }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    if (alert.severity === 'emergency') {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [alert.severity]);

  return (
    <Animated.View style={{ 
      transform: [{ scale: scaleAnim }, { scale: pulseAnim }] 
    }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient colors={getSeverityGradient(alert.severity)} style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertIconContainer}>
              <Ionicons name={getSeverityIcon(alert.severity)} size={28} color="#FFFFFF" />
            </View>
            <View style={styles.alertBadges}>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>{getPriorityText(alert.severity)}</Text>
              </View>
              {alert.severity === 'emergency' && (
                <View style={styles.pulseBadge}>
                  <Ionicons name="radio-button-on" size={12} color="#FFFFFF" />
                </View>
              )}
            </View>
          </View>
          
          <Text style={styles.alertTitle} numberOfLines={2} ellipsizeMode="tail">
            {alert.title}
          </Text>
          
          <Text style={styles.alertMessage} numberOfLines={3} ellipsizeMode="tail">
            {alert.message}
          </Text>
          
          <View style={styles.alertFooter}>
            <View style={styles.timeContainer}>
              <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.timeText}>{alert.time}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.quickTipsButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onViewTips(alert.type);
                }}
              >
                <Ionicons name="bulb" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.detailsButton}>
                <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const AlertsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'emergency' | 'attention' | 'good'>('all');

  const handleViewTips = (tipType: string) => {
    navigation.navigate('Tips');
  };

  const handleAlertPress = (alert: any) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const filteredAlerts = alertsData.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  const emergencyCount = alertsData.filter(a => a.severity === 'emergency').length;
  const attentionCount = alertsData.filter(a => a.severity === 'attention').length;
  const monitoringCount = alertsData.filter(a => a.severity === 'monitoring').length;
  const goodCount = alertsData.filter(a => a.severity === 'good').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Alertas</Text>
        <Text style={styles.title}>Central de Monitoramento</Text>
        <Text style={styles.subtitle}>Mantenha-se informado sobre seu bebê</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dashboard de Alertas */}
        <View style={styles.dashboardSection}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.dashboardCard}>
            <Text style={styles.dashboardTitle}>Status dos Alertas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name="warning" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statNumber}>{emergencyCount}</Text>
                <Text style={styles.statLabel}>EMERGÊNCIA</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statNumber}>{attentionCount}</Text>
                <Text style={styles.statLabel}>ATENÇÃO</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statNumber}>{goodCount}</Text>
                <Text style={styles.statLabel}>NORMAL</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Filtros */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersContainer}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'emergency', label: 'Emerg.' },
              { key: 'attention', label: 'Aten.' },
              { key: 'good', label: 'Normal' }
            ].map((filterOption) => (
              <TouchableOpacity
                key={filterOption.key}
                style={[
                  styles.filterButton,
                  filter === filterOption.key && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(filterOption.key as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === filterOption.key && styles.filterButtonTextActive,
                ]}>
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lista de Alertas */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>
            {filter === 'all' ? '🔔 Todos os Alertas' :
             filter === 'emergency' ? '🚨 Alertas de Emergência' :
             filter === 'attention' ? '⚠️ Alertas de Atenção' : '✅ Status Normal'}
          </Text>
          
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <EnhancedAlertCard
                key={alert.id}
                alert={alert}
                onPress={() => handleAlertPress(alert)}
                onViewTips={handleViewTips}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="checkmark-circle" size={40} color="#10B981" />
              </View>
              <Text style={styles.emptyTitle}>Tudo Perfeito!</Text>
              <Text style={styles.emptyMessage}>
                {filter === 'all' 
                  ? 'Não há alertas ativos no momento. Todos os sinais vitais estão normais!'
                  : `Não há alertas do tipo "${filter}" no momento.`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Detalhes */}
      <AlertDetailModal
        alert={selectedAlert}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onViewTips={handleViewTips}
      />
    </SafeAreaView>
  );
};

export default AlertsScreen;