export type CaregiverRole = 'owner' | 'parent' | 'babysitter' | 'family' | 'medical';

export interface Caregiver {
  id: string;
  name: string;
  email: string;
  role: CaregiverRole;
  permissions: CaregiverPermissions;
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  avatar?: string;
}

export interface CaregiverPermissions {
  viewVitals: boolean;
  viewHistory: boolean;
  viewAlerts: boolean;
  receiveNotifications: boolean;
  addRecords: boolean;
  editSettings: boolean;
  inviteOthers: boolean;
  removeCaregiver: boolean;
}

export const defaultPermissions: Record<CaregiverRole, CaregiverPermissions> = {
  owner: {
    viewVitals: true,
    viewHistory: true,
    viewAlerts: true,
    receiveNotifications: true,
    addRecords: true,
    editSettings: true,
    inviteOthers: true,
    removeCaregiver: true,
  },
  parent: {
    viewVitals: true,
    viewHistory: true,
    viewAlerts: true,
    receiveNotifications: true,
    addRecords: true,
    editSettings: false,
    inviteOthers: true,
    removeCaregiver: false,
  },
  babysitter: {
    viewVitals: true,
    viewHistory: false,
    viewAlerts: true,
    receiveNotifications: true,
    addRecords: true,
    editSettings: false,
    inviteOthers: false,
    removeCaregiver: false,
  },
  family: {
    viewVitals: true,
    viewHistory: true,
    viewAlerts: true,
    receiveNotifications: false,
    addRecords: false,
    editSettings: false,
    inviteOthers: false,
    removeCaregiver: false,
  },
  medical: {
    viewVitals: true,
    viewHistory: true,
    viewAlerts: true,
    receiveNotifications: false,
    addRecords: false,
    editSettings: false,
    inviteOthers: false,
    removeCaregiver: false,
  },
};

export const roleLabels: Record<CaregiverRole, string> = {
  owner: 'Proprietário',
  parent: 'Pai/Mãe',
  babysitter: 'Babá/Cuidador',
  family: 'Familiar',
  medical: 'Profissional Médico',
};

export const roleIcons: Record<CaregiverRole, string> = {
  owner: 'crown',
  parent: 'heart',
  babysitter: 'people',
  family: 'home',
  medical: 'medical',
};

// Mock data
export const mockCaregivers: Caregiver[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    role: 'owner',
    permissions: defaultPermissions.owner,
    invitedBy: 'self',
    invitedAt: '2024-01-01',
    status: 'accepted',
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'parent',
    permissions: defaultPermissions.parent,
    invitedBy: '1',
    invitedAt: '2024-01-02',
    status: 'accepted',
  },
  {
    id: '3',
    name: 'Ana Santos',
    email: 'ana@email.com',
    role: 'babysitter',
    permissions: defaultPermissions.babysitter,
    invitedBy: '1',
    invitedAt: '2024-01-03',
    status: 'pending',
  },
];