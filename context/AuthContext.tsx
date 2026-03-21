
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export interface User {
  id: string; // This will be the uid
  name: string;
  surname: string;
  email: string;
  role: string;
  tokens: number;
  package: string;
  createdAt: string;
  // Optional fields that were in the original interface but not in blueprint
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  tcNo?: string;
  targetExam?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateProfile: (updatedUser: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            // Fallback if document doesn't exist but auth does
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: '',
              surname: '',
              role: 'user',
              tokens: 1,
              package: 'free',
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (userData: { email?: string, password?: string }) => {
    if (userData.email && userData.password) {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const normalizePhone = (phone: string) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('90')) cleaned = cleaned.substring(2);
    if (!cleaned.startsWith('0')) cleaned = '0' + cleaned;
    return cleaned;
  };

  const register = async (userData: any) => {
    // Check if phone number is already in use
    let normalizedPhone = '';
    if (userData.phone) {
      normalizedPhone = normalizePhone(userData.phone);
      const phoneRef = doc(db, 'phone_numbers', normalizedPhone);
      const exactPhoneRef = doc(db, 'phone_numbers', userData.phone);
      
      const [phoneDoc, exactPhoneDoc] = await Promise.all([
        getDoc(phoneRef),
        getDoc(exactPhoneRef)
      ]);
      
      if (phoneDoc.exists() || (exactPhoneDoc.exists() && normalizedPhone !== userData.phone)) {
        throw new Error('phone-already-in-use');
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const newUser = userCredential.user;
    
    const userDocData = {
      uid: newUser.uid,
      email: userData.email || '',
      name: userData.name || '',
      surname: userData.surname || '',
      role: 'user',
      tokens: 1,
      package: 'free',
      createdAt: new Date().toISOString(),
      // Extra fields
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      district: userData.district || '',
      tcNo: userData.tcNo || '',
      targetExam: userData.targetExam || ''
    };

    const batch = writeBatch(db);
    batch.set(doc(db, 'users', newUser.uid), userDocData);
    if (normalizedPhone) {
      batch.set(doc(db, 'phone_numbers', normalizedPhone), { uid: newUser.uid });
    }
    
    try {
      await batch.commit();
    } catch (error) {
      // If Firestore write fails, delete the created Auth user to prevent orphaned accounts
      await newUser.delete();
      throw error;
    }
    
    setUser({ id: newUser.uid, ...userDocData });
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (user && auth.currentUser) {
      try {
        const batch = writeBatch(db);
        const userRef = doc(db, 'users', user.id);
        
        // If phone number is being updated, check uniqueness and update phone_numbers collection
        if (updatedData.phone !== undefined && updatedData.phone !== user.phone) {
          let newNormalizedPhone = '';
          if (updatedData.phone) {
            newNormalizedPhone = normalizePhone(updatedData.phone);
            const phoneRef = doc(db, 'phone_numbers', newNormalizedPhone);
            const exactPhoneRef = doc(db, 'phone_numbers', updatedData.phone);
            
            const [phoneDoc, exactPhoneDoc] = await Promise.all([
              getDoc(phoneRef),
              getDoc(exactPhoneRef)
            ]);
            
            if (phoneDoc.exists() || (exactPhoneDoc.exists() && newNormalizedPhone !== updatedData.phone)) {
              throw new Error('phone-already-in-use');
            }
            batch.set(phoneRef, { uid: user.id });
          }
          
          // Delete old phone number if it existed
          if (user.phone) {
            const oldNormalizedPhone = normalizePhone(user.phone);
            const oldPhoneRef = doc(db, 'phone_numbers', oldNormalizedPhone);
            batch.delete(oldPhoneRef);
            
            // Also delete the exact unnormalized phone if it exists to clean up old data
            if (oldNormalizedPhone !== user.phone) {
              const exactOldPhoneRef = doc(db, 'phone_numbers', user.phone);
              batch.delete(exactOldPhoneRef);
            }
          }
        }

        batch.update(userRef, updatedData);
        await batch.commit();
        
        setUser({ ...user, ...updatedData });
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    }
  };

  const deleteAccount = async () => {
    if (user && auth.currentUser) {
      try {
        const batch = writeBatch(db);
        
        // Delete user document from Firestore
        const userRef = doc(db, 'users', user.id);
        batch.delete(userRef);
        
        // Delete phone number from phone_numbers collection
        if (user.phone) {
          const normalizedPhone = normalizePhone(user.phone);
          const phoneRef = doc(db, 'phone_numbers', normalizedPhone);
          batch.delete(phoneRef);
          
          if (normalizedPhone !== user.phone) {
            const exactPhoneRef = doc(db, 'phone_numbers', user.phone);
            batch.delete(exactPhoneRef);
          }
        }
        
        await batch.commit();
        
        // Delete user from Firebase Auth
        await auth.currentUser.delete();
        setUser(null);
      } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (auth.currentUser && user?.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
      } catch (error) {
        console.error("Error changing password:", error);
        throw error;
      }
    } else {
      throw new Error("Kullanıcı oturumu bulunamadı.");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      register, 
      updateProfile,
      deleteAccount,
      changePassword,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
