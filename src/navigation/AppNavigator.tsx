import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import DashboardScreen from "../screens/main/DashboardScreen";
import HistoryScreen from "../screens/main/HistoryScreen";
import AlertsScreen from "../screens/main/AlertsScreen";
import SettingsScreen from "../screens/main/SettingsScreen";
import TipsScreen from "../screens/main/TipsScreen";
import CaregiversScreen from "../screens/main/CaregiversScreen";
import DebugScreen from "../screens/main/DebugScreen";
import AlertSettingsScreen from "../screens/main/AlertSettingsScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
  History: undefined;
  Alerts: undefined;
  Settings: undefined;
  Tips: undefined;
  Caregivers: undefined;
  AlertSettings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Tips" component={TipsScreen} />
      <Stack.Screen name="Caregivers" component={CaregiversScreen} />
      <Stack.Screen name="Debug" component={DebugScreen} />
      <Stack.Screen name="AlertSettings" component={AlertSettingsScreen} />
    </Stack.Navigator>
  );
}
