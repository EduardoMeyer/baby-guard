import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useVitals } from '../../contexts/VitalsContext';
import ApiService from '../../services/ApiService';

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
  statusSection: {
    marginBottom: 24,
  },
  statusCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  connectionInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  connectionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
  },
  actionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  resultText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#374151',
    lineHeight: 18,
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  vitalsSection: {
    marginBottom: 24,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  vitalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  vitalUnit: {
    fontSize: 12,
    color: '#64748B',
  },
});

interface TestResult {
  id: string;
  timestamp: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const DebugScreen: React.FC = () => {
  const { theme } = useTheme();
  const { isConnected, connectionStatus, vitals, latency } = useVitals();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (type: 'success' | 'error' | 'info', message: string) => {
    const result: TestResult = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setTestResults(prev => [result, ...prev.slice(0, 19)]); // Keep last 20 results
  };

  const testConnection = async () => {
    setTesting(true);
    addResult('info', 'Iniciando teste de conexão...');
    
    try {
      const apiService = ApiService.getInstance();
      const result = await apiService.testConnection();
      
      if (result.connected) {
        addResult('success', `✅ Conexão estabelecida! Latência: ${result.latency}ms`);
        addResult('info', `Endpoint: ${result.endpoint}`);
      } else {
        addResult('error', `❌ Falha na conexão: ${result.message}`);
      }
    } catch (error: any) {
      addResult('error', `❌ Erro: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const testAllEndpoints = async () => {
    setTesting(true);
    addResult('info', 'Testando todos os endpoints...');
    
    const endpoints = [
      { path: '/api/dados', desc: 'Endpoint principal' },
      { path: '/dados', desc: 'Endpoint alternativo' },
      { path: '/status', desc: 'Status do sistema' },
      { path: '/', desc: 'Raiz da API' },
    ];
    
    const baseUrl = 'http://192.168.1.77:3000';
    
    for (const endpoint of endpoints) {
      try {
        addResult('info', `Testando: ${endpoint.path}`);
        
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.text();
          addResult('success', `✅ ${endpoint.path} - Status: ${response.status}`);
          addResult('info', `Dados: ${data.substring(0, 100)}...`);
        } else {
          addResult('error', `❌ ${endpoint.path} - Status: ${response.status}`);
        }
      } catch (error: any) {
        addResult('error', `❌ ${endpoint.path} - Erro: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
  };

  const testDataFetch = async () => {
    setTesting(true);
    addResult('info', 'Testando busca de dados...');
    
    try {
      const apiService = ApiService.getInstance();
      const data = await apiService.getLatestVitals();
      
      addResult('success', '✅ Dados recebidos com sucesso!');
      addResult('info', `Temperatura: ${data.temperatura || data.temperature || 'N/A'}`);
      addResult('info', `Batimentos: ${data.batimentos || data.heartRate || 'N/A'}`);
      addResult('info', `Respiração: ${data.respiracao || data.respiratoryRate || 'N/A'}`);
      addResult('info', `Saturação: ${data.saturacao || data.oxygenSaturation || 'N/A'}`);
    } catch (error: any) {
      addResult('error', `❌ Erro ao buscar dados: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    addResult('info', 'Resultados limpos');
  };

  const getConnectionGradient = () => {
    if (isConnected) return ['#10B981', '#34D399'];
    return ['#EF4444', '#F87171'];
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Debug Arduino</Text>
        <Text style={styles.title}>Diagnóstico Avançado</Text>
        <Text style={styles.subtitle}>Teste e monitore a conexão com sensores</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status da Conexão */}
        <View style={styles.statusSection}>
          <LinearGradient colors={getConnectionGradient()} style={styles.statusCard}>
            <Text style={styles.statusTitle}>Status da Conexão</Text>
            
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <View style={styles.statusIcon}>
                  <Ionicons 
                    name={isConnected ? 'checkmark-circle' : 'close-circle'} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </View>
                <Text style={styles.statusLabel}>CONEXÃO</Text>
                <Text style={styles.statusValue}>
                  {isConnected ? 'ATIVA' : 'INATIVA'}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <View style={styles.statusIcon}>
                  <Ionicons name="time" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statusLabel}>LATÊNCIA</Text>
                <Text style={styles.statusValue}>
                  {latency ? `${latency}ms` : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <View style={styles.statusIcon}>
                  <Ionicons name="pulse" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statusLabel}>ÚLTIMA ATUALIZAÇÃO</Text>
                <Text style={styles.statusValue}>
                  {vitals.lastUpdate.toLocaleTimeString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionText}>
                {isConnected 
                  ? `✅ Conectado ao Arduino em 192.168.1.77:3000\nRecebendo dados em tempo real`
                  : `❌ Sem conexão com o Arduino\nVerifique se o dispositivo está ligado e na rede`
                }
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Dados Atuais */}
        <View style={styles.vitalsSection}>
          <Text style={styles.sectionTitle}>📊 Dados Atuais dos Sensores</Text>
          
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalCard}>
              <View style={styles.vitalHeader}>
                <View style={[styles.vitalIcon, { backgroundColor: '#FF6B6B20' }]}>
                  <Ionicons name="thermometer" size={16} color="#FF6B6B" />
                </View>
                <Text style={styles.vitalLabel}>Temperatura</Text>
              </View>
              <Text style={styles.vitalValue}>{vitals.temperature.toFixed(1)}</Text>
              <Text style={styles.vitalUnit}>°C</Text>
            </View>
            
            <View style={styles.vitalCard}>
              <View style={styles.vitalHeader}>
                <View style={[styles.vitalIcon, { backgroundColor: '#FF6B9D20' }]}>
                  <Ionicons name="heart" size={16} color="#FF6B9D" />
                </View>
                <Text style={styles.vitalLabel}>Batimentos</Text>
              </View>
              <Text style={styles.vitalValue}>{vitals.heartRate}</Text>
              <Text style={styles.vitalUnit}>bpm</Text>
            </View>
            
            <View style={styles.vitalCard}>
              <View style={styles.vitalHeader}>
                <View style={[styles.vitalIcon, { backgroundColor: '#4ECDC420' }]}>
                  <Ionicons name="pulse" size={16} color="#4ECDC4" />
                </View>
                <Text style={styles.vitalLabel}>Respiração</Text>
              </View>
              <Text style={styles.vitalValue}>{vitals.respiratoryRate}</Text>
              <Text style={styles.vitalUnit}>rpm</Text>
            </View>
            
            <View style={styles.vitalCard}>
              <View style={styles.vitalHeader}>
                <View style={[styles.vitalIcon, { backgroundColor: '#667eea20' }]}>
                  <Ionicons name="water" size={16} color="#667eea" />
                </View>
                <Text style={styles.vitalLabel}>Saturação</Text>
              </View>
              <Text style={styles.vitalValue}>{vitals.oxygenSaturation}</Text>
              <Text style={styles.vitalUnit}>%</Text>
            </View>
          </View>
        </View>

        {/* Ações de Teste */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>🔧 Ferramentas de Diagnóstico</Text>
          
          <View style={[styles.actionCard, { borderLeftColor: '#3B82F6' }]}>
            <View style={styles.actionHeader}>
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                <Ionicons name="wifi" size={24} color="#3B82F6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Teste de Conexão</Text>
                <Text style={styles.actionDescription}>
                  Verifica se o Arduino está respondendo e mede a latência
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={testConnection}
              disabled={testing}
            >
              <LinearGradient colors={['#3B82F6', '#60A5FA']} style={styles.actionButtonGradient}>
                <Text style={styles.actionButtonText}>
                  {testing ? 'Testando...' : 'Testar Conexão'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.actionCard, { borderLeftColor: '#10B981' }]}>
            <View style={styles.actionHeader}>
              <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="search" size={24} color="#10B981" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Scan de Endpoints</Text>
                <Text style={styles.actionDescription}>
                  Testa todos os endpoints disponíveis na API do Arduino
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={testAllEndpoints}
              disabled={testing}
            >
              <LinearGradient colors={['#10B981', '#34D399']} style={styles.actionButtonGradient}>
                <Text style={styles.actionButtonText}>
                  {testing ? 'Escaneando...' : 'Escanear Endpoints'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.actionCard, { borderLeftColor: '#F59E0B' }]}>
            <View style={styles.actionHeader}>
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="download" size={24} color="#F59E0B" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Buscar Dados</Text>
                <Text style={styles.actionDescription}>
                  Faz uma requisição para obter os dados mais recentes dos sensores
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={testDataFetch}
              disabled={testing}
            >
              <LinearGradient colors={['#F59E0B', '#FCD34D']} style={styles.actionButtonGradient}>
                <Text style={styles.actionButtonText}>
                  {testing ? 'Buscando...' : 'Buscar Dados'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resultados dos Testes */}
        {testResults.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.resultsTitle}>📋 Log de Testes</Text>
                <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
                  <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
              </View>
              
              {testResults.map((result) => (
                <View 
                  key={result.id} 
                  style={[
                    styles.resultItem, 
                    { borderLeftColor: getResultColor(result.type) }
                  ]}
                >
                  <Text style={styles.resultText}>
                    [{result.timestamp}] {result.message}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DebugScreen;