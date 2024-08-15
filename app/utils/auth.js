import { getAuth } from 'firebase/auth';
import { app } from '../firebase'; // Ensure the app is imported and initialized

export const checkUserLoggedIn = () => {
  const auth = getAuth(app); // Use the initialized app
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};