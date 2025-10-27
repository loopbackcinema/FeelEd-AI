import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured, firebaseConfig } from '../firebase';
import { AuthContext, ROLE_STORAGE_KEY_PREFIX, PENDING_ROLE_STORAGE_KEY } from './AuthContext';
import type { FirebaseUser, UserRole } from '../types';

// Use 'import type' for Firebase types to prevent module execution at load time.
import type {
    Auth,
    User,
    GoogleAuthProvider,
    UserCredential,
    AuthProvider as FirebaseAuthProvider,
} from 'firebase/auth';

// Define the shape of the auth service that will be dynamically loaded.
interface AuthService {
    auth: Auth;
    GoogleAuthProvider: new () => GoogleAuthProvider;
    signInWithPopup: (auth: Auth, provider: FirebaseAuthProvider) => Promise<UserCredential>;
    signOut: (auth: Auth) => Promise<void>;
    onAuthStateChanged: (auth: Auth, callback: (user: User | null) => void) => () => void;
}

// Memoize the promise for the auth service to prevent re-initialization.
let authServicePromise: Promise<AuthService | null> | null = null;

/**
 * Dynamically imports and initializes Firebase services ONLY if configured.
 */
const getAuthService = (): Promise<AuthService | null> => {
    if (!isFirebaseConfigured) {
        return Promise.resolve(null);
    }
    if (authServicePromise) {
        return authServicePromise;
    }
    authServicePromise = (async () => {
        try {
            const { initializeApp, getApps, getApp } = await import('firebase/app');
            const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = await import('firebase/auth');
            const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
            const auth = getAuth(app);
            return { auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged };
        } catch (error) {
            console.error("Failed to load and initialize Firebase services:", error);
            return null;
        }
    })();
    return authServicePromise;
};

// This is the actual provider component implementation.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const [isConfigured] = useState(isFirebaseConfigured);

    useEffect(() => {
        if (!isConfigured) {
            console.error(
                "Firebase configuration is incomplete or invalid. Authentication features will be disabled. Please edit `firebase.ts` and replace the placeholder values with your actual Firebase project config."
            );
            setLoading(false);
            return;
        }

        let unsubscribe: (() => void) | undefined;
        
        const initializeAuth = async () => {
            const authService = await getAuthService();
            if (authService) {
                unsubscribe = authService.onAuthStateChanged(authService.auth, (currentUser: User | null) => {
                    setUser(currentUser);
                    if (currentUser) {
                        const storedRole = localStorage.getItem(`${ROLE_STORAGE_KEY_PREFIX}${currentUser.uid}`);
                        const pendingRole = localStorage.getItem(PENDING_ROLE_STORAGE_KEY);
                        
                        if (storedRole && ['Student', 'Teacher', 'Parent'].includes(storedRole)) {
                            setUserRole(storedRole as UserRole);
                        } else if (pendingRole) {
                            const roleToSet: UserRole = pendingRole as UserRole;
                            localStorage.setItem(`${ROLE_STORAGE_KEY_PREFIX}${currentUser.uid}`, roleToSet);
                            setUserRole(roleToSet);
                            localStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
                        } else {
                            setUserRole('Student'); // Default
                        }
                    } else {
                        setUser(null);
                        setUserRole(null);
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        };
        
        initializeAuth();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [isConfigured]);

    const loginWithGoogle = useCallback(async (role: Exclude<UserRole, null>): Promise<void> => {
        const authService = await getAuthService();
        if (!authService) {
            console.error("Login failed: Firebase auth service not available.");
            return;
        }
        localStorage.setItem(PENDING_ROLE_STORAGE_KEY, role);
        try {
            const provider = new authService.GoogleAuthProvider();
            await authService.signInWithPopup(authService.auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            localStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        const authService = await getAuthService();
        if (!authService) {
            console.error("Logout failed: Firebase auth service not available.");
            return;
        }
        try {
            await authService.signOut(authService.auth);
        } catch (error) {
            console.error("Error during sign-out:", error);
        }
    }, []);
    
    const value = { user, userRole, loading, isConfigured, loginWithGoogle, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};