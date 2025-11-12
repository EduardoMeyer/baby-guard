export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  weight: number;
  height: number;
  allergies: string[];
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  id: string;
  babyId: string;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  timestamp: string;
  notes?: string;
}

export interface DiscomfortReport {
  id: string;
  babyId: string;
  bodyPart: string;
  discomfortType: 'pain' | 'irritation' | 'fever' | 'other';
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  timestamp: string;
}

export interface FeedingRecord {
  id: string;
  babyId: string;
  type: 'breastfeeding' | 'bottle' | 'solid';
  amount?: number;
  duration?: number;
  timestamp: string;
  notes?: string;
}

export interface SleepRecord {
  id: string;
  babyId: string;
  startTime: string;
  endTime?: string;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
}

export interface DiaperRecord {
  id: string;
  babyId: string;
  type: 'wet' | 'dirty' | 'both';
  timestamp: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface NotificationSettings {
  feeding: boolean;
  sleeping: boolean;
  vitals: boolean;
  diaper: boolean;
  medication: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  language: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
  VitalSigns: undefined;
  CareTracking: undefined;
  History: undefined;
  Settings: undefined;
  BabyProfile: undefined;
};
