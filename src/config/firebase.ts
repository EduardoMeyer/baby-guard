// Firebase desabilitado para desenvolvimento
// Para usar Firebase real, descomente e configure as credenciais

/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
*/

// Exports vazios para compatibilidade
export const auth = null;
export const db = null;
export const storage = null;
export default null;

console.log('🔧 Firebase desabilitado - usando modo desenvolvimento');
