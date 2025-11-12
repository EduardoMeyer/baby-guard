import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login } = useAuth();
  const { theme } = useTheme();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Se o login for bem-sucedido, vai pra Dashboard
      navigation.replace("Dashboard");
    } catch (error: any) {
      Alert.alert("Erro", "Email ou senha incorretos");
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
      backgroundColor: "#FFF",
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 32,
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
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    formTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: { marginTop: theme.spacing.md },
    linkContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.lg,
    },
    linkText: {
      fontSize: 14,
      color: theme.colors.primary,
      textDecorationLine: "underline",
    },
    registerContainer: {
      alignItems: "center",
      marginTop: theme.spacing.xl,
    },
    registerText: {
      fontSize: 16,
      color: "#FFFFFF",
      marginBottom: theme.spacing.sm,
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
          {/* Logo e título */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={{ fontSize: 40 }}>👶</Text>
            </View>
            <Text style={styles.title}>BabyGuard</Text>
            <Text style={styles.subtitle}>
              Cuidando do seu bebê com amor e tecnologia
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Entrar</Text>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
            />

            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              isPassword
              leftIcon="lock-closed"
              error={errors.password}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                size="large"
              />
            </View>

            {/* Link "Esqueci minha senha" */}
            <View style={styles.linkContainer}>
              <Text
                style={styles.linkText}
                onPress={() =>
                  Alert.alert(
                    "Ops!",
                    "Tela de recuperação de senha ainda não implementada."
                  )
                }
              >
                Esqueci minha senha
              </Text>
            </View>
          </View>

          {/* Cadastro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta?</Text>
            <Button
              title="Criar Conta"
              onPress={() =>
                Alert.alert(
                  "Em breve",
                  "Tela de cadastro será adicionada nas próximas versões."
                )
              }
              variant="outline"
              style={{ borderColor: "#FFFFFF" }}
              textStyle={{ color: "#FFFFFF" }}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
