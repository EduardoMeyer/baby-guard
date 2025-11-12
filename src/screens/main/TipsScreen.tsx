import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getAllTips, TipData } from '../../data/tipsData';

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
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  tipsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  tipIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  tipSummary: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  expandButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tipDetails: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  stepsContainer: {
    marginTop: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
});

interface CategoryCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  count: number;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, gradient, count, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient colors={gradient} style={styles.categoryCard}>
          <View style={styles.categoryIcon}>
            <Ionicons name={icon} size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categoryCount}>{count} dicas</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface EnhancedTipCardProps {
  tip: TipData;
  isExpanded: boolean;
  onToggle: () => void;
}

const EnhancedTipCard: React.FC<EnhancedTipCardProps> = ({ tip, isExpanded, onToggle }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sinais Vitais': return '#3B82F6';
      case 'Conforto': return '#F59E0B';
      case 'Emergência': return '#EF4444';
      case 'Respiração': return '#10B981';
      case 'Oxigenação': return '#06B6D4';
      case 'Desenvolvimento': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getSteps = (category: string) => {
    switch (category) {
      case 'Sinais Vitais':
        return [
          'Observe a coloração da pele do bebê',
          'Verifique se a respiração está regular',
          'Sinta se a temperatura está normal',
          'Monitore o comportamento geral',
          'Anote qualquer mudança observada'
        ];
      case 'Emergência':
        return [
          'Mantenha a calma e avalie a situação',
          'Verifique se o bebê está consciente',
          'Ligue imediatamente para emergência (192)',
          'Siga as instruções do atendente',
          'Prepare-se para ir ao hospital'
        ];
      case 'Respiração':
        return [
          'Posicione o bebê de costas',
          'Mantenha vias aéreas desobstruídas',
          'Observe movimentos do peito',
          'Conte respirações por minuto',
          'Procure ajuda se houver dificuldade'
        ];
      default:
        return [
          'Observe o bebê cuidadosamente',
          'Mantenha ambiente seguro',
          'Registre informações importantes',
          'Consulte profissional quando necessário'
        ];
    }
  };

  const categoryColor = getCategoryColor(tip.category);

  return (
    <View style={styles.tipCard}>
      <TouchableOpacity style={styles.tipHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={[styles.tipIconContainer, { backgroundColor: categoryColor + '20' }]}>
          <Ionicons name={tip.icon as any} size={28} color={categoryColor} />
        </View>
        
        <View style={styles.tipContent}>
          <Text style={[styles.tipCategory, { 
            backgroundColor: categoryColor + '20', 
            color: categoryColor 
          }]}>
            {tip.category}
          </Text>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <Text style={styles.tipSummary} numberOfLines={2} ellipsizeMode="tail">
            {tip.summary}
          </Text>
        </View>
        
        <View style={styles.expandButton}>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#64748B" 
          />
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.tipDetails}>{tip.details}</Text>
          
          <View style={styles.stepsContainer}>
            <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>
              📋 Passos Recomendados:
            </Text>
            {getSteps(tip.category).map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          
          {tip.category === 'Emergência' && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ ATENÇÃO IMPORTANTE</Text>
              <Text style={styles.warningText}>
                Em situações de emergência, sempre priorize buscar ajuda médica profissional. 
                Estas dicas são orientações gerais e não substituem atendimento médico especializado.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export const TipsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const tips = getAllTips();

  const toggleTip = (tipId: string) => {
    setExpandedTip(expandedTip === tipId ? null : tipId);
  };

  const categories = [
    { name: 'Sinais Vitais', icon: 'heart' as const, gradient: ['#3B82F6', '#60A5FA'] },
    { name: 'Emergência', icon: 'warning' as const, gradient: ['#EF4444', '#F87171'] },
    { name: 'Respiração', icon: 'pulse' as const, gradient: ['#10B981', '#34D399'] },
    { name: 'Conforto', icon: 'happy' as const, gradient: ['#F59E0B', '#FCD34D'] },
    { name: 'Oxigenação', icon: 'water' as const, gradient: ['#06B6D4', '#67E8F9'] },
    { name: 'Desenvolvimento', icon: 'trending-up' as const, gradient: ['#8B5CF6', '#A78BFA'] },
  ];

  const filteredTips = selectedCategory 
    ? tips.filter(tip => tip.category === selectedCategory)
    : tips;

  const getCategoryCount = (categoryName: string) => {
    return tips.filter(tip => tip.category === categoryName).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Dicas Educacionais</Text>
        <Text style={styles.title}>Guia Completo de Cuidados</Text>
        <Text style={styles.subtitle}>Aprenda a cuidar melhor do seu bebê</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Categorias */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>📚 Categorias de Dicas</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                title={category.name}
                icon={category.icon}
                gradient={category.gradient}
                count={getCategoryCount(category.name)}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
              />
            ))}
          </View>
        </View>

        {/* Lista de Dicas */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `💡 Dicas de ${selectedCategory}` : '💡 Todas as Dicas'}
          </Text>
          
          {selectedCategory && (
            <TouchableOpacity 
              style={{ marginBottom: 16 }}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={{ color: '#3B82F6', fontSize: 14 }}>
                ← Voltar para todas as categorias
              </Text>
            </TouchableOpacity>
          )}
          
          {filteredTips.map((tip) => (
            <EnhancedTipCard
              key={tip.id}
              tip={tip}
              isExpanded={expandedTip === tip.id}
              onToggle={() => toggleTip(tip.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TipsScreen;