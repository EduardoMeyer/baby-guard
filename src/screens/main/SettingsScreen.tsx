import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert, Dimensions, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/MockAuthContext';
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
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  settingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  settingCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  settingIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  rightContainer: {
    marginLeft: 12,
    alignItems: 'center',
  },
  customSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  temperatureOptions: {
    flexDirection: 'row',
  },
  temperatureOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  temperatureOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  temperatureOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  temperatureOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  profileModalContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileModalAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileModalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  profileModalEmail: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  profileInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfoText: {
    marginLeft: 16,
    flex: 1,
  },
  profileInfoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  profileInfoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  editProfileButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  editProfileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

interface SettingCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  isLast?: boolean;
}

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, user }) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.profileModalContent}>
            <View style={styles.profileModalAvatar}>
              <Ionicons name="person" size={50} color="#FFFFFF" />
            </View>
            <Text style={styles.profileModalName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.profileModalEmail}>{user?.email || 'usuario@email.com'}</Text>
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.section}>
            <Text style={styles.profileSectionTitle}>👤 Informações Pessoais</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoItem}>
                <Ionicons name="person" size={20} color="#3B82F6" />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileInfoLabel}>Nome Completo</Text>
                  <Text style={styles.profileInfoValue}>{user?.name || 'Não informado'}</Text>
                </View>
              </View>
              
              <View style={styles.profileInfoItem}>
                <Ionicons name="mail" size={20} color="#3B82F6" />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileInfoLabel}>Email</Text>
                  <Text style={styles.profileInfoValue}>{user?.email || 'Não informado'}</Text>
                </View>
              </View>
              
              <View style={styles.profileInfoItem}>
                <Ionicons name="calendar" size={20} color="#3B82F6" />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileInfoLabel}>Membro desde</Text>
                  <Text style={styles.profileInfoValue}>Janeiro 2024</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.profileSectionTitle}>👶 Informações do Bebê</Text>
            
            <View style={styles.profileInfoCard}>
              <View style={styles.profileInfoItem}>
                <Ionicons name="heart" size={20} color="#FF6B9D" />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileInfoLabel}>Nome do Bebê</Text>
                  <Text style={styles.profileInfoValue}>Meu Bebê</Text>
                </View>
              </View>
              
              <View style={styles.profileInfoItem}>
                <Ionicons name="calendar" size={20} color="#FF6B9D" />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileInfoLabel}>Data de Nascimento</Text>
                  <Text style={styles.profileInfoValue}>15/12/2023</Text>
                </View>
              </View>
              
              <View style={styles.profileInfoItem}>
                <Ionicons name="fitness" size={20} color="#FF6B9D" />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileInfoLabel}>Peso Atual</Text>
                  <Text style={styles.profileInfoValue}>4.2 kg</Text>
                </View>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => {
              Alert.alert(
                'Editar Perfil',
                'Funcionalidade de edição será implementada em breve!',
                [{ text: 'OK' }]
              );
            }}
          >
            <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.editProfileGradient}>
              <Ionicons name="create" size={20} color="#FFFFFF" />
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const EnhancedSettingCard: React.FC<SettingCardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  gradient,
  onPress, 
  rightComponent,
  isLast = false 
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={{ 
      transform: [{ scale: scaleAnim }],
      marginBottom: isLast ? 0 : 16,
    }}>
      <Component 
        style={styles.settingCard} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient colors={gradient} style={styles.settingCardGradient}>
          <View style={styles.settingIconContainer}>
            <Ionicons name={icon} size={28} color="#FFFFFF" />
          </View>
          
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.settingSubtitle} numberOfLines={2} ellipsizeMode="tail">
              {subtitle}
            </Text>
          </View>
          
          {rightComponent && (
            <View style={styles.rightContainer}>
              {rightComponent}
            </View>
          )}
          
          {onPress && !rightComponent && (
            <View style={styles.rightContainer}>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          )}
        </LinearGradient>
      </Component>
    </Animated.View>
  );
};

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [temperatureUnit, setTemperatureUnit] = useState<'°C' | '°F'>('°C');
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair? Você precisará fazer login novamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Configurações</Text>
        <Text style={styles.title}>Personalizar Experiência</Text>
        <Text style={styles.subtitle}>Ajuste o app do seu jeito</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Perfil do Usuário */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.profileCard}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={50} color="#FFFFFF" />
              </View>
              <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'usuario@email.com'}</Text>
              
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>127</Text>
                  <Text style={styles.profileStatLabel}>Dias monitorando</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>2.4k</Text>
                  <Text style={styles.profileStatLabel}>Medições</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatNumber}>98%</Text>
                  <Text style={styles.profileStatLabel}>Uptime</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notificações</Text>
          
          <EnhancedSettingCard
            title="Alertas Push"
            subtitle="Receber notificações sobre sinais vitais anormais em tempo real"
            icon="notifications"
            gradient={['#F59E0B', '#F97316']}
            rightComponent={
              <Switch
                style={styles.customSwitch}
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          
          <EnhancedSettingCard
            title="Sons de Alerta"
            subtitle="Reproduzir sons quando alertas críticos forem detectados"
            icon="volume-high"
            gradient={['#8B5CF6', '#A855F7']}
            rightComponent={
              <Switch
                style={styles.customSwitch}
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          
          <EnhancedSettingCard
            title="Vibração"
            subtitle="Vibrar o dispositivo para alertas importantes"
            icon="phone-portrait"
            gradient={['#06B6D4', '#0891B2']}
            rightComponent={
              <Switch
                style={styles.customSwitch}
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
                thumbColor="#FFFFFF"
              />
            }
            isLast
          />
        </View>

        {/* Preferências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Preferências</Text>
          
          <EnhancedSettingCard
            title="Unidade de Temperatura"
            subtitle="Escolha entre Celsius ou Fahrenheit para exibição"
            icon="thermometer"
            gradient={['#EF4444', '#F87171']}
            rightComponent={
              <View style={styles.temperatureOptions}>
                <TouchableOpacity
                  style={[
                    styles.temperatureOption,
                    temperatureUnit === '°C' && styles.temperatureOptionActive
                  ]}
                  onPress={() => setTemperatureUnit('°C')}
                >
                  <Text style={[
                    styles.temperatureOptionText,
                    temperatureUnit === '°C' && styles.temperatureOptionTextActive
                  ]}>
                    °C
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.temperatureOption,
                    temperatureUnit === '°F' && styles.temperatureOptionActive
                  ]}
                  onPress={() => setTemperatureUnit('°F')}
                >
                  <Text style={[
                    styles.temperatureOptionText,
                    temperatureUnit === '°F' && styles.temperatureOptionTextActive
                  ]}>
                    °F
                  </Text>
                </TouchableOpacity>
              </View>
            }
            isLast
          />
        </View>

        {/* Compartilhamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Compartilhamento</Text>
          
          <EnhancedSettingCard
            title="Gerenciar Cuidadores"
            subtitle="Adicionar familiares e cuidadores para monitoramento compartilhado"
            icon="people"
            gradient={['#10B981', '#059669']}
            onPress={() => navigation.navigate('Caregivers')}
            isLast
          />
        </View>

        {/* Avançado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Avançado</Text>
          
          <EnhancedSettingCard
            title="Configurar Alertas"
            subtitle="Personalizar limites e tipos de alertas para cada sinal vital"
            icon="settings"
            gradient={['#6366F1', '#8B5CF6']}
            onPress={() => navigation.navigate('AlertSettings')}
          />
          
          <EnhancedSettingCard
            title="Debug Arduino"
            subtitle="Ferramentas de diagnóstico e teste de conexão com sensores"
            icon="bug"
            gradient={['#F97316', '#EA580C']}
            onPress={() => navigation.navigate('Debug')}
            isLast
          />
        </View>

        {/* Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Conta</Text>
          
          <EnhancedSettingCard
            title="Sair da Conta"
            subtitle="Desconectar e retornar à tela de login"
            icon="log-out"
            gradient={['#EF4444', '#DC2626']}
            onPress={handleLogout}
            isLast
          />
        </View>
      </ScrollView>

      {/* Modal de Perfil */}
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        user={user}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;