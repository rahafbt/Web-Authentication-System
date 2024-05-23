import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, provider } from '../firebase/firebaseSetup';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { toast } from 'react-toastify'; 

interface Props {
  children?: ReactNode
}

// User object
interface User {
  uid: string;
  email: string | null;
  emailVerified?: boolean;
  fullName: string | null;
}

// authentication context
interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullNameEnglish: string, fullNameArabic: string, birthDate: string, mobileNumber: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  isEmailVerified: () => boolean | undefined;
  resendEmailVerification: () => Promise<void>;
  ResetPassword: (email: string) => Promise<void>; 
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to provide the authentication context to the app
export const AuthProvider= ({ children } : Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const fullName = await getUserFullName(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          fullName: fullName,
        });
      } else {
        setUser(null);
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Function to retrieve the user's full name
  const getUserFullName = async (uid: string): Promise<string | null> => {
    try {
      const collectionRef = collection(db, "users", uid, "data");
      const querySnapshot = await getDocs(collectionRef);
      
      let fullName: string | null = null;

      querySnapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          fullName = userData.fullNameEnglish;
        } else {
          console.log("No such document");
        }
      });

      return fullName;
    } catch (error: any) {
      console.error("Error getting user data:", error);
      return null;
    }
  };

  // Function to sign up user
  const signUp = async (email: string, password: string, fullNameEnglish: string, fullNameArabic: string, birthDate: string, mobileNumber: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
  
      // update user state
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: fullNameEnglish,
      });

      console.log('new user id', userCredential.user.uid);

      // add user data to firestore
      const registerData = {
        fullNameEnglish,
        fullNameArabic,
        birthDate,
        mobileNumber,
        email,
      };
      const userCollectionRef = collection(db, "users", userCredential.user.uid, "data");
      const docRef = await addDoc(userCollectionRef, registerData);
      console.log("Document written with ID: ", docRef.id);
      
      return true;
    } catch (error: any) {
      if (error.code == "auth/email-already-in-use") {
        toast.error('Email is already registered');
        throw error;
      } else {
        toast.error('Sorry, something went wrong');
        throw error;
      }      
    }
  };

  // Function to sign in user
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  // Function to sign in user with google
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
  
      // update user state
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
        fullName: result.user.displayName,
      });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  // Function to sign out user
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Function to check email verification
  const isEmailVerified = () => {
    return user ? user.emailVerified : false;
  }

  // Function to resened email verification
  const resendEmailVerification = async () => {
    try {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        await sendEmailVerification(currentUser);
        console.log('Resend Email Verification Successfully');
      }
    } catch (error) {
      throw error;
    }
  };

  // Function to rease user password
  const ResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, googleSignIn, logOut, isEmailVerified, resendEmailVerification, ResetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
