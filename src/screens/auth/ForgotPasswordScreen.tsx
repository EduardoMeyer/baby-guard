import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/MockAuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { resetPassword } = useAuth();
  const { theme } = useTheme();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetPassword = async () => {
    if (!email) {
      setError("Email é obrigatório");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    } catch (error: any) {
      setError("Não foi possível enviar o email de recuperação");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      padding: theme.spacing.lg,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.xl * 2,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: theme.spacing.lg,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.3)",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: "#FFFFFF",
      textAlign: "center",
      opacity: 0.9,
    },
    formContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      marginHorizontal: theme.spacing.sm,
    },
    successContainer: {
      backgroundColor: "#E8F5E8",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#4CAF50",
    },
    successText: {
      color: "#2E7D32",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      marginTop: theme.spacing.sm,
    },
    backButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.spacing.xl,
      backgroundColor: "rgba(255,255,255,0.1)",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    formTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: { marginTop: theme.spacing.md },
    backButton: {
      alignItems: "center",
      marginTop: theme.spacing.lg,
    },
    backText: {
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#FF6B9D", "#4ECDC4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="key" size={48} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Esqueci minha senha</Text>
              <Text style={styles.subtitle}>
                Recupere o acesso à sua conta
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Redefinir Senha</Text>
              <Text style={styles.description}>
                Digite seu email para receber as instruções de recuperação
              </Text>

              {!success ? (
                <>
                  <Input
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError("");
                    }}
                    placeholder="Digite seu email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon="mail"
                    error={error}
                  />

                  <View style={styles.buttonContainer}>
                    <Button
                      title="Enviar Email"
                      onPress={handleResetPassword}
                      loading={loading}
                      size="large"
                      leftIcon="send"
                    />
                  </View>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                  <Text style={styles.successText}>
                    Email enviado com sucesso!{"\n"}
                    Verifique sua caixa de entrada para redefinir sua senha.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.backButtonContainer}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.backText}>Voltar ao Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;