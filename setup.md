# 🚀 Guia de Configuração Rápida - BabyGuard

## 📋 Checklist de Instalação

### ✅ Pré-requisitos
- [ ] Node.js 16+ instalado
- [ ] npm ou yarn instalado
- [ ] Expo CLI instalado (`npm install -g @expo/cli`)
- [ ] Conta no Firebase criada
- [ ] Android Studio (para Android) ou Xcode (para iOS)

### 🔧 Configuração do Projeto

1. **Instalar dependências:**
```bash
cd baby-guard
npm install
```

2. **Configurar Firebase:**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto
   - Ative Authentication > Email/Password
   - Crie banco Firestore Database
   - Copie as credenciais para `src/config/firebase.ts`

3. **Configurar Notificações:**
   - No Firebase Console, vá em Project Settings
   - Baixe `google-services.json` (Android) ou `GoogleService-Info.plist` (iOS)
   - Coloque os arquivos nas pastas apropriadas

4. **Executar o projeto:**
```bash
npm start
```

### 🔐 Configuração do Firebase

Substitua as credenciais em `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "babyguard-xxxxx.firebaseapp.com",
  projectId: "babyguard-xxxxx",
  storageBucket: "babyguard-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 📊 Estrutura do Firestore

Crie as seguintes coleções no Firestore:

```
users/
├── {userId}/
    ├── name: string
    ├── email: string
    └── createdAt: timestamp

babies/
├── {babyId}/
    ├── name: string
    ├── birthDate: string
    ├── weight: number
    ├── height: number
    ├── allergies: array
    ├── parentId: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp

vital_signs/
├── {recordId}/
    ├── babyId: string
    ├── heartRate: number
    ├── temperature: number
    ├── oxygenSaturation: number
    ├── timestamp: string
    └── notes: string

discomfort_reports/
├── {reportId}/
    ├── babyId: string
    ├── bodyPart: string
    ├── discomfortType: string
    ├── intensity: number
    ├── timestamp: string
    └── notes: string

feeding_records/
├── {recordId}/
    ├── babyId: string
    ├── type: string
    ├── amount: number
    ├── duration: number
    ├── timestamp: string
    └── notes: string

sleep_records/
├── {recordId}/
    ├── babyId: string
    ├── startTime: string
    ├── endTime: string
    ├── quality: string
    └── notes: string

diaper_records/
├── {recordId}/
    ├── babyId: string
    ├── type: string
    ├── timestamp: string
    └── notes: string
```

### 🔔 Configuração de Notificações

#### Android
1. Baixe `google-services.json` do Firebase
2. Coloque em `android/app/google-services.json`
3. As permissões já estão configuradas no `app.json`

#### iOS
1. Baixe `GoogleService-Info.plist` do Firebase
2. Coloque em `ios/GoogleService-Info.plist`
3. Configure as permissões no Xcode se necessário

### 🎨 Personalização

#### Cores do Tema
Edite `src/contexts/ThemeContext.tsx`:
```typescript
const lightTheme: Theme = {
  colors: {
    primary: '#FF6B9D',    // Rosa principal
    secondary: '#4ECDC4',  // Verde água
    // ... outras cores
  }
};
```

#### Ícones e Imagens
- Substitua os ícones em `assets/`
- Atualize as referências no `app.json`

### 🧪 Testando o App

1. **Modo de Desenvolvimento:**
```bash
npm start
```

2. **Build para Produção:**
```bash
# Android
expo build:android

# iOS
expo build:ios
```

### 🐛 Solução de Problemas

#### Erro de Permissões
- Verifique se as permissões estão configuradas no `app.json`
- Para iOS, configure no `Info.plist`

#### Firebase não conecta
- Verifique as credenciais em `firebase.ts`
- Certifique-se que Authentication e Firestore estão ativos

#### Notificações não funcionam
- Verifique se os arquivos de configuração estão nas pastas corretas
- Teste as permissões no dispositivo

### 📱 Comandos Úteis

```bash
# Limpar cache
expo r -c

# Ver logs
expo logs

# Publicar no Expo
expo publish

# Ejetar do Expo (cuidado!)
expo eject
```

### 🎯 Próximos Passos

Após a configuração básica:

1. [ ] Teste todas as funcionalidades
2. [ ] Configure backup automático
3. [ ] Adicione mais sensores se necessário
4. [ ] Personalize o design
5. [ ] Configure analytics
6. [ ] Prepare para produção

---

**🍼 Seu BabyGuard está pronto para cuidar do seu bebê!**
