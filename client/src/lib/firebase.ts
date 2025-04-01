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
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration to avoid cryptic errors
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => 
    !firebaseConfig[field as keyof typeof firebaseConfig]
  );
  
  if (missingFields.length > 0) {
    console.error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    console.error('Please ensure all required environment variables are set.');
  }
}

validateFirebaseConfig();

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
    if (!auth || !googleProvider) {
      throw new Error("Firebase authentication is not initialized properly");
    }
    
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
      throw new Error("Firebase configuration is incomplete. Please check your environment variables.");
    }
    
    // Check if we're in a valid origin for authentication
    const currentOrigin = window.location.origin;
    console.log(`Current Origin: ${currentOrigin}`);
    
    // Setting reCAPTCHA parameter for better security
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    
    await signInWithRedirect(auth, googleProvider);
    // This won't execute immediately - the page will redirect to Google
    // Handle the redirect result in handleRedirectResult function
    return {} as UserCredential; // This line won't actually execute due to redirect
  } catch (error: any) {
    console.error("Error during Google sign-in:", error);
    if (error.code === 'auth/configuration-not-found') {
      console.error("Firebase Auth configuration issue: Make sure your domain is added to authorized domains in Firebase console");
    }
    throw error;
  }
}

// Handle redirect result after Google sign-in
export async function handleRedirectResult(): Promise<FirebaseUser | null> {
  try {
    // Try to get redirect result
    const result = await getRedirectResult(auth);
    if (result) {
      // User successfully signed in
      // Save user data to Firestore
      const user = result.user;
      
      // Log success information
      console.log("Successfully authenticated user:", user.displayName || user.email);
      
      try {
        await saveUserToFirestore(user);
      } catch (firestoreError) {
        // If Firestore save fails, we still want to continue with authentication
        console.error("Error saving to Firestore, but continuing authentication:", firestoreError);
      }
      
      return user;
    }
    return null;
  } catch (error: any) {
    console.error("Error handling redirect result:", error);
    
    // Special handling for common Firebase Auth errors
    if (error.code === 'auth/configuration-not-found') {
      console.error("Firebase Auth configuration issue: Make sure your domain is added to authorized domains in Firebase console");
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.log("User closed the authentication popup");
    }
    
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
