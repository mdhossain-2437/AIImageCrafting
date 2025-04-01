import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  getRedirectResult, 
  User as FirebaseUser,
  UserCredential
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Add custom parameters to the Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign in with Google
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    await signInWithRedirect(auth, googleProvider);
    // This won't execute immediately - the page will redirect to Google
    // Handle the redirect result in handleRedirectResult function
    return {} as UserCredential; // This line won't actually execute due to redirect
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
}

// Handle redirect result after Google sign-in
export async function handleRedirectResult(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // User successfully signed in
      // Save user data to Firestore
      const user = result.user;
      await saveUserToFirestore(user);
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
}

// Save user data to Firestore
export async function saveUserToFirestore(user: FirebaseUser) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    } else {
      // Update last login time
      await updateDoc(userRef, {
        lastLoginAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
  }
}

// Sign out
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

// Upload image to Firebase Storage
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle error
        reject(error);
      },
      async () => {
        // Handle success - get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
