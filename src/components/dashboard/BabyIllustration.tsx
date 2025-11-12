import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Svg, Circle, Ellipse, Path } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';

interface InteractivePoint {
  id: string;
  x: number;
  y: number;
  label: string;
  bodyPart: string;
}

interface BabyIllustrationProps {
  onPointPress: (point: InteractivePoint) => void;
}

export const BabyIllustration: React.FC<BabyIllustrationProps> = ({ onPointPress }) => {
  const { theme } = useTheme();

  const interactivePoints: InteractivePoint[] = [
    { id: 'head', x: 150, y: 80, label: 'Cabeça', bodyPart: 'head' },
    { id: 'chest', x: 150, y: 140, label: 'Peito', bodyPart: 'chest' },
    { id: 'stomach', x: 150, y: 180, label: 'Barriga', bodyPart: 'stomach' },
    { id: 'left_arm', x: 110, y: 150, label: 'Braço Esquerdo', bodyPart: 'left_arm' },
    { id: 'right_arm', x: 190, y: 150, label: 'Braço Direito', bodyPart: 'right_arm' },
    { id: 'left_leg', x: 130, y: 220, label: 'Perna Esquerda', bodyPart: 'left_leg' },
    { id: 'right_leg', x: 170, y: 220, label: 'Perna Direita', bodyPart: 'right_leg' },
  ];

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    svgContainer: {
      position: 'relative',
    },
    interactivePoint: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    pointText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    pulseAnimation: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      opacity: 0.3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width="300" height="280" viewBox="0 0 300 280">
          {/* Cabeça */}
          <Circle
            cx="150"
            cy="80"
            r="35"
            fill="#FFE4B5"
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Corpo */}
          <Ellipse
            cx="150"
            cy="160"
            rx="40"
            ry="60"
            fill="#FFE4B5"
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Braço Esquerdo */}
          <Ellipse
            cx="110"
            cy="150"
            rx="15"
            ry="35"
            fill="#FFE4B5"
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Braço Direito */}
          <Ellipse
            cx="190"
            cy="150"
            rx="15"
            ry="35"
            fill="#FFE4B5"
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Perna Esquerda */}
          <Ellipse
            cx="130"
            cy="240"
            rx="18"
            ry="40"
            fill="#FFE4B5"
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Perna Direita */}
          <Ellipse
            cx="170"
            cy="240"
            rx="18"
            ry="40"
            fill="#FFE4B5"
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Rosto - Olhos */}
          <Circle cx="140" cy="75" r="3" fill="#333" />
          <Circle cx="160" cy="75" r="3" fill="#333" />
          
          {/* Rosto - Nariz */}
          <Circle cx="150" cy="82" r="1.5" fill="#333" />
          
          {/* Rosto - Boca */}
          <Path
            d="M 145 88 Q 150 92 155 88"
            stroke="#333"
            strokeWidth="2"
            fill="none"
          />
        </Svg>

        {/* Pontos Interativos */}
        {interactivePoints.map((point) => (
          <TouchableOpacity
            key={point.id}
            style={[
              styles.interactivePoint,
              {
                left: point.x - 12,
                top: point.y - 12,
              },
            ]}
            onPress={() => onPointPress(point)}
            activeOpacity={0.7}
          >
            <Text style={styles.pointText}>!</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
