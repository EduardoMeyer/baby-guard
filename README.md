# 🍼 BabyGuard

**BabyGuard** é um aplicativo móvel completo para monitoramento, cuidado e bem-estar de bebês. Desenvolvido com React Native e TypeScript, oferece uma interface moderna, intuitiva e segura para pais e responsáveis.

## 📱 Funcionalidades Principais

### 🔐 Autenticação e Segurança
- Login com email e senha
- Cadastro de novos usuários
- Recuperação de senha
- Dados criptografados e seguros

### 🏠 Dashboard Interativo
- Ilustração interativa do bebê
- Pontos clicáveis para registrar desconfortos
- Resumo de alertas recentes
- Sinais vitais em tempo real

### 💓 Monitoramento de Sinais Vitais
- Registro de batimentos cardíacos
- Monitoramento de temperatura
- Controle de saturação de oxigênio
- Histórico com gráficos detalhados
- Alertas automáticos para valores anormais

### 🔔 Sistema de Notificações
- Alertas em tempo real
- Lembretes personalizáveis
- Notificações push configuráveis
- Diferentes tipos de alertas (alimentação, sono, medicação)

### 👶 Perfil do Bebê
- Cadastro completo (nome, idade, peso, altura)
- Registro de alergias
- Histórico médico
- Informações sempre atualizadas

### 📊 Histórico e Estatísticas
- Gráficos semanais, mensais e anuais
- Relatórios detalhados
- Exportação em PDF
- Análise de tendências

### 🍼 Registro de Cuidados
- **Alimentação**: Amamentação, mamadeira, sólidos
- **Sono**: Horários, qualidade, duração
- **Fraldas**: Tipos de troca, frequência
- Histórico completo de todos os cuidados

### 🎨 Design e UX
- Interface moderna e limpa
- Tema claro e escuro
- Cores suaves e amigáveis
- Animações fluidas
- Responsivo para diferentes dispositivos

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework multiplataforma
- **TypeScript** - Tipagem estática
- **Expo** - Plataforma de desenvolvimento
- **Firebase** - Backend e autenticação
- **React Navigation** - Navegação
- **React Native Paper** - Componentes UI
- **React Native Chart Kit** - Gráficos
- **Expo Notifications** - Notificações push

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase
- Android Studio (para Android) ou Xcode (para iOS)

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/babyguard.git
cd babyguard
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication (Email/Password)
3. Crie um banco Firestore
4. Copie as credenciais do Firebase
5. Substitua as credenciais em `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

### 4. Configure as notificações

Para Android, adicione o arquivo `google-services.json` na pasta `android/app/`.
Para iOS, adicione o arquivo `GoogleService-Info.plist` na pasta `ios/`.

### 5. Execute o projeto

```bash
# Iniciar o servidor de desenvolvimento
npm start
# ou
yarn start

# Para Android
npm run android
# ou
yarn android

# Para iOS
npm run ios
# ou
yarn ios
```

## 📁 Estrutura do Projeto

```
babyguard/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/         # Componentes básicos (Button, Input)
│   │   └── dashboard/      # Componentes específicos do dashboard
│   ├── contexts/           # Contextos React (Auth, Theme, Notifications)
│   ├── navigation/         # Configuração de navegação
│   ├── screens/           # Telas do aplicativo
│   │   ├── auth/          # Telas de autenticação
│   │   └── main/          # Telas principais
│   ├── services/          # Serviços (NotificationService)
│   ├── types/             # Definições de tipos TypeScript
│   └── config/            # Configurações (Firebase)
├── assets/                # Imagens e recursos
├── App.tsx               # Componente principal
├── package.json          # Dependências e scripts
└── README.md            # Este arquivo
```

## 🔧 Configurações Avançadas

### Personalização de Temas
O aplicativo suporta temas claro e escuro. Para personalizar as cores, edite o arquivo `src/contexts/ThemeContext.tsx`.

### Configuração de Notificações
As notificações podem ser personalizadas no arquivo `src/services/NotificationService.ts`. Você pode adicionar novos tipos de notificações e configurar horários específicos.

### Integração com Sensores
Para integrar com sensores externos (como LilyPad), adicione as configurações necessárias nos arquivos de configuração do Expo.

## 📱 Funcionalidades por Tela

### Tela de Login
- Autenticação segura
- Recuperação de senha
- Cadastro de novos usuários
- Design moderno com gradiente

### Dashboard
- Ilustração interativa do bebê
- Pontos de desconforto clicáveis
- Resumo de sinais vitais
- Alertas recentes

### Sinais Vitais
- Registro manual de dados
- Gráficos históricos
- Alertas automáticos
- Validação de valores

### Cuidados do Bebê
- Registro de alimentação
- Controle de sono
- Troca de fraldas
- Histórico detalhado

### Histórico e Estatísticas
- Gráficos interativos
- Filtros por período
- Exportação de relatórios
- Análise de tendências

### Configurações
- Perfil do usuário
- Configurações de notificação
- Temas claro/escuro
- Informações do aplicativo

## 🔒 Segurança e Privacidade

- Autenticação Firebase segura
- Dados criptografados
- Armazenamento local seguro
- Comunicação HTTPS
- Conformidade com LGPD

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@babyguard.app
- GitHub Issues: [Abrir issue](https://github.com/seu-usuario/babyguard/issues)

## 🎯 Roadmap

### Versão 1.1
- [ ] Integração com câmeras IP
- [ ] Reconhecimento de choro
- [ ] Backup automático na nuvem
- [ ] Múltiplos perfis de bebês

### Versão 1.2
- [ ] Integração com wearables
- [ ] IA para recomendações
- [ ] Compartilhamento com pediatras
- [ ] Modo offline completo

### Versão 2.0
- [ ] Versão web
- [ ] API pública
- [ ] Integração com IoT
- [ ] Análise preditiva

---

**Desenvolvido com ❤️ para cuidar do que mais importa: seu bebê.**
