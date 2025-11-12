import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Dimensions, Animated, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mockCaregivers, Caregiver, CaregiverRole, roleLabels, roleIcons, defaultPermissions } from '../../data/caregiversData';

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
  statsSection: {
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  addSection: {
    marginBottom: 24,
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  caregiversSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  caregiverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  caregiverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  caregiverEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  permissionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  inputFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  roleSelector: {
    marginBottom: 24,
  },
  roleSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  roleOptions: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  roleOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  roleOptionContent: {
    marginLeft: 12,
    flex: 1,
  },
  roleOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  roleOptionTitleActive: {
    color: '#FFFFFF',
  },
  roleOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  roleOptionDescriptionActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  permissionsSection: {
    marginBottom: 24,
  },
  permissionsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  permissionInfo: {
    flex: 1,
    marginRight: 12,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
});

const getRoleGradient = (role: CaregiverRole) => {
  switch (role) {
    case 'owner': return ['#8B5CF6', '#A78BFA'];
    case 'parent': return ['#3B82F6', '#60A5FA'];
    case 'babysitter': return ['#10B981', '#34D399'];
    case 'family': return ['#F59E0B', '#FCD34D'];
    case 'medical': return ['#EF4444', '#F87171'];
    default: return ['#6B7280', '#9CA3AF'];
  }
};

const getRoleDescription = (role: CaregiverRole) => {
  switch (role) {
    case 'parent': return 'Acesso completo aos dados do bebê';
    case 'babysitter': return 'Monitoramento durante cuidados';
    case 'family': return 'Acompanhamento familiar';
    case 'medical': return 'Profissional de saúde';
    default: return '';
  }
};

export const CaregiversScreen: React.FC = () => {
  const { theme } = useTheme();
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [selectedRole, setSelectedRole] = useState<CaregiverRole>('parent');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [customPermissions, setCustomPermissions] = useState({
    viewVitals: true,
    addRecords: true,
    receiveNotifications: true,
    editSettings: false,
  });

  const handleInviteCaregiver = () => {
    if (!inviteEmail || !inviteName) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newCaregiver: Caregiver = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: selectedRole,
      permissions: customPermissions,
      invitedBy: '1',
      invitedAt: new Date().toISOString(),
      status: 'pending',
    };

    setCaregivers([...caregivers, newCaregiver]);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
    setSelectedRole('parent');
    setCustomPermissions({
      viewVitals: true,
      addRecords: true,
      receiveNotifications: true,
      editSettings: false,
    });

    Alert.alert(
      'Convite Enviado! 🎉',
      `Convite enviado para ${inviteName}. Eles receberão um email com instruções para aceitar.`
    );
  };

  const handleRemoveCaregiver = (caregiverId: string) => {
    const caregiver = caregivers.find(c => c.id === caregiverId);
    if (!caregiver) return;

    Alert.alert(
      'Remover Cuidador',
      `Tem certeza que deseja remover ${caregiver.name}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setCaregivers(caregivers.filter(c => c.id !== caregiverId));
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'declined': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'declined': return 'Recusado';
      default: return status;
    }
  };

  const getPermissionLabels = (permissions: any) => {
    const labels = [];
    if (permissions.viewVitals) labels.push('✓ Ver Sinais Vitais');
    if (permissions.addRecords) labels.push('✓ Adicionar Registros');
    if (permissions.receiveNotifications) labels.push('✓ Receber Alertas');
    if (permissions.editSettings) labels.push('✓ Configurações');
    return labels;
  };

  const activeCount = caregivers.filter(c => c.status === 'accepted').length;
  const pendingCount = caregivers.filter(c => c.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Cuidadores</Text>
        <Text style={styles.title}>Gerenciar Equipe</Text>
        <Text style={styles.subtitle}>Compartilhe o cuidado do seu bebê</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Estatísticas */}
        <View style={styles.statsSection}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statsCard}>
            <Text style={styles.statsTitle}>Status da Equipe</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{caregivers.length}</Text>
                <Text style={styles.statLabel}>TOTAL</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activeCount}</Text>
                <Text style={styles.statLabel}>ATIVOS</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{pendingCount}</Text>
                <Text style={styles.statLabel}>PENDENTES</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Botão Adicionar */}
        <View style={styles.addSection}>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowInviteModal(true)}>
            <LinearGradient colors={['#10B981', '#34D399']} style={styles.addButtonGradient}>
              <Ionicons name="person-add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Convidar Novo Cuidador</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Lista de Cuidadores */}
        <View style={styles.caregiversSection}>
          <Text style={styles.sectionTitle}>👥 Equipe de Cuidadores</Text>
          
          {caregivers.map((caregiver) => (
            <View key={caregiver.id} style={styles.caregiverCard}>
              <View style={styles.caregiverHeader}>
                <LinearGradient 
                  colors={getRoleGradient(caregiver.role)} 
                  style={styles.avatarContainer}
                >
                  <Ionicons 
                    name={roleIcons[caregiver.role] as any} 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
                
                <View style={styles.caregiverInfo}>
                  <Text style={styles.caregiverName}>{caregiver.name}</Text>
                  <Text style={styles.caregiverEmail}>{caregiver.email}</Text>
                  <View style={styles.roleContainer}>
                    <Ionicons 
                      name={roleIcons[caregiver.role] as any} 
                      size={16} 
                      color={getRoleGradient(caregiver.role)[0]}
                    />
                    <Text style={[styles.roleText, { color: getRoleGradient(caregiver.role)[0] }]}>
                      {roleLabels[caregiver.role]}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(caregiver.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusLabel(caregiver.status)}
                    </Text>
                  </View>
                  
                  {caregiver.role !== 'owner' && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveCaregiver(caregiver.id)}
                    >
                      <Ionicons name="trash" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.permissionsContainer}>
                {getPermissionLabels(caregiver.permissions).map((label, index) => (
                  <View key={index} style={styles.permissionChip}>
                    <Text style={styles.permissionText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Convite */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIcon}>
                  <Ionicons name="person-add" size={40} color="#3B82F6" />
                </View>
                <Text style={styles.modalTitle}>Convidar Cuidador</Text>
                <Text style={styles.modalSubtitle}>
                  Adicione alguém à equipe de cuidados do seu bebê
                </Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'name' && styles.inputFocused
                  ]}
                  placeholder="Digite o nome completo"
                  value={inviteName}
                  onChangeText={setInviteName}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'email' && styles.inputFocused
                  ]}
                  placeholder="Digite o email"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.roleSelector}>
                <Text style={styles.roleSelectorTitle}>Função do Cuidador</Text>
                <View style={styles.roleOptions}>
                  {(['parent', 'babysitter', 'family', 'medical'] as CaregiverRole[]).map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        selectedRole === role && styles.roleOptionActive
                      ]}
                      onPress={() => setSelectedRole(role)}
                    >
                      <Ionicons 
                        name={roleIcons[role] as any} 
                        size={20} 
                        color={selectedRole === role ? '#FFFFFF' : getRoleGradient(role)[0]}
                      />
                      <View style={styles.roleOptionContent}>
                        <Text style={[
                          styles.roleOptionTitle,
                          selectedRole === role && styles.roleOptionTitleActive
                        ]}>
                          {roleLabels[role]}
                        </Text>
                        <Text style={[
                          styles.roleOptionDescription,
                          selectedRole === role && styles.roleOptionDescriptionActive
                        ]}>
                          {getRoleDescription(role)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.permissionsSection}>
                <Text style={styles.permissionsSectionTitle}>Permissões de Acesso</Text>
                
                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionTitle}>Ver Sinais Vitais</Text>
                    <Text style={styles.permissionDescription}>Visualizar temperatura, batimentos, etc.</Text>
                  </View>
                  <Switch
                    value={customPermissions.viewVitals}
                    onValueChange={(value) => setCustomPermissions({...customPermissions, viewVitals: value})}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={customPermissions.viewVitals ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>
                
                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionTitle}>Adicionar Registros</Text>
                    <Text style={styles.permissionDescription}>Registrar cuidados e observações</Text>
                  </View>
                  <Switch
                    value={customPermissions.addRecords}
                    onValueChange={(value) => setCustomPermissions({...customPermissions, addRecords: value})}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={customPermissions.addRecords ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>
                
                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionTitle}>Receber Alertas</Text>
                    <Text style={styles.permissionDescription}>Notificações de emergência e atenção</Text>
                  </View>
                  <Switch
                    value={customPermissions.receiveNotifications}
                    onValueChange={(value) => setCustomPermissions({...customPermissions, receiveNotifications: value})}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={customPermissions.receiveNotifications ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>
                
                <View style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionTitle}>Configurações</Text>
                    <Text style={styles.permissionDescription}>Alterar configurações do sistema</Text>
                  </View>
                  <Switch
                    value={customPermissions.editSettings}
                    onValueChange={(value) => setCustomPermissions({...customPermissions, editSettings: value})}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={customPermissions.editSettings ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalButton} onPress={handleInviteCaregiver}>
                <LinearGradient colors={['#3B82F6', '#60A5FA']} style={styles.modalButtonGradient}>
                  <Text style={styles.modalButtonText}>Enviar Convite</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CaregiversScreen;