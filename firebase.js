import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDV_P2EiZIkodLT66HuPq3FLFLBXKObmag",
    authDomain: "messenger-3b9de.firebaseapp.com",
    projectId: "messenger-3b9de",
    storageBucket: "messenger-3b9de.appspot.com",
    messagingSenderId: "935532934319",
    appId: "1:935532934319:web:409a78071767612c51905a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });