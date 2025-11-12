import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

// Contexts
// import { AuthProvider } from "./src/contexts/AuthContext";
import { MockAuthProvider as AuthProvider } from "./src/contexts/MockAuthContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { NotificationProvider } from "./src/contexts/NotificationContext";
import { VitalsProvider } from "./src/contexts/VitalsContext";

// Navegação
import AppNavigator from "./src/navigation/AppNavigator";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native",
  "Expo peerDependencies warning",
  "Remote debugger",
]);

export default function App() {
  useEffect(() => {
    console.log("🍼 BabyGuard App iniciado!");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <VitalsProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </NavigationContainer>
              </NotificationProvider>
            </VitalsProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
