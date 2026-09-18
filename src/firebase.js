import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBpqpKf9JvTGMUR2WLJ8LG_rZKcJ304nWM",
  authDomain: "tamar-events-app-123.firebaseapp.com",
  projectId: "tamar-events-app-123",
  storageBucket: "tamar-events-app-123.firebasestorage.app",
  messagingSenderId: "943004099431",
  appId: "1:943004099431:web:4a02a29fb3580d77b4c5c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Functions and get a reference to the service
export const functions = getFunctions(app);
