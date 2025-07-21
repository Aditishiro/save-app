
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase/firebase'; // Assuming your firebase init is here
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// MOCK a public user object for a public-only app
const publicUser: User = {
  uid: 'public-user',
  email: 'public@example.com',
  displayName: 'Public User',
  photoURL: '',
  emailVerified: true,
  isAnonymous: true,
  metadata: {},
  providerData: [],
  providerId: 'firebase',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'public-token',
  getIdTokenResult: async () => ({
    token: 'public-token',
    claims: {},
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    expirationTime: '',
  }),
  reload: async () => {},
  toJSON: () => ({}),
};


export function AuthProvider({ children }: AuthProviderProps) {
  // In a fully public app, we can bypass real auth and use a mock user.
  // This avoids loading screens and auth checks.
  const [currentUser] = useState<User | null>(publicUser);
  const [loading] = useState(false); // Never in a loading state
  const router = useRouter();


  const logOut = async () => {
    // In a public app, logout doesn't do much, could just reload or go to home.
    console.log("Logout triggered in public mode. No action taken.");
    router.push('/');
  };

  const value = {
    currentUser,
    loading,
    logOut,
  };

  // No loading screen needed for a public-only app
  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-background">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
