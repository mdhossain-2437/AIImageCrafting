// Mock Firebase implementation until Firebase is properly installed
// This allows the app to run without the Firebase dependency

// Create a mock auth object with the necessary structure
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Immediately call with null (not logged in)
    setTimeout(() => callback(null), 0);
    
    // Return an unsubscribe function
    return () => {};
  },
  signOut: async () => {
    console.log("Mock signOut called");
    return Promise.resolve();
  }
};

export const googleProvider = {};

export async function signInWithGoogle() {
  console.log("Mock signInWithGoogle called");
  alert("Firebase authentication is currently disabled. The app is running in demo mode.");
  
  // Return a mock successful sign-in
  return Promise.resolve({
    user: {
      uid: "demo-user-id",
      email: "demo@example.com",
      displayName: "Demo User",
      photoURL: null
    }
  });
}

export async function signOut() {
  console.log("Mock signOut called");
  return Promise.resolve();
}
