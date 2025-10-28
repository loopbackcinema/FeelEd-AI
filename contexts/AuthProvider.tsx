

import React, { ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { isFirebaseConfigured, firebaseConfig } from '../firebase';
import { AuthContext, AuthContextType, ROLE_STORAGE_KEY_PREFIX, PENDING_ROLE_STORAGE_KEY } from './AuthContext';
import type { FirebaseUser, UserRole } from '../types';

// We will dynamically import these types to avoid static dependencies.
type AuthModule = typeof import('firebase/auth');
type AppModule = typeof import('firebase/app');
type Auth = AuthModule['Auth'];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const authRef = useRef<Auth | null>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const connectToFirebase = async () => {
            if (!isFirebaseConfigured) {
                console.warn(
                    "Firebase configuration is incomplete or invalid. Authentication features will be disabled. Please edit `firebase.ts` and replace the placeholder values with your actual Firebase project config."
                );
                setLoading(false);
                return;
            }

            try {
                const { initializeApp, getApps, getApp }: AppModule = await import('firebase/app');
                const { getAuth, onAuthStateChanged }: AuthModule = await import('firebase/auth');

                const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
                const auth = getAuth(app);
                authRef.current = auth;

                unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    try {
                        if (currentUser) {
                            const plainUser: FirebaseUser = {
                                uid: currentUser.uid,
                                displayName: currentUser.displayName,
                                photoURL: currentUser.photoURL,
                                email: currentUser.email,
                            };
                            setUser(plainUser);
                            
                            let storedRole: string | null = null;
                            let pendingRole: string | null = null;

                            try {
                                storedRole = localStorage.getItem(`${ROLE_STORAGE_KEY_PREFIX}${currentUser.uid}`);
                                pendingRole = localStorage.getItem(PENDING_ROLE_STORAGE_KEY);
                            } catch (e) {
                                console.warn("Could not access localStorage. User role persistence will be disabled.", e);
                            }

                            if (storedRole && ['Student', 'Teacher', 'Parent'].includes(storedRole)) {
                                setUserRole(storedRole as UserRole);
                                // Clean up pending role if it exists for some reason
                                if (pendingRole) {
                                    try { localStorage.removeItem(PENDING_ROLE_STORAGE_KEY); } catch (e) {}
                                }
                            } else if (pendingRole) {
                                const roleToSet: UserRole = pendingRole as UserRole;
                                setUserRole(roleToSet);
                                try {
                                    localStorage.setItem(`${ROLE_STORAGE_KEY_PREFIX}${currentUser.uid}`, roleToSet);
                                    localStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
                                } catch (e) {
                                    console.warn("Could not save role to localStorage.", e);
                                }
                            } else {
                                // Fallback to a default role if nothing is found
                                const defaultRole = 'Student';
                                setUserRole(defaultRole);
                                try {
                                    localStorage.setItem(`${ROLE_STORAGE_KEY_PREFIX}${currentUser.uid}`, defaultRole);
                                } catch (e) {
                                     console.warn("Could not save default role to localStorage.", e);
                                }
                            }
                        } else {
                            setUser(null);
                            setUserRole(null);
                        }
                    } catch (error) {
                        console.error("Error inside onAuthStateChanged callback:", error);
                        setUser(null);
                        setUserRole(null);
                    } finally {
                        setLoading(false);
                    }
                });

            } catch (error) {
                console.error("Failed to load Firebase auth service:", error);
                setLoading(false);
            }
        };

        connectToFirebase();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const loginWithGoogle = useCallback(async (role: Exclude<UserRole, null>): Promise<void> => {
        const authInstance = authRef.current;
        if (!authInstance) {
            alert("Authentication service is not available. Please check your Firebase configuration.");
            return;
        }
        try {
            localStorage.setItem(PENDING_ROLE_STORAGE_KEY, role);
        } catch (e) {
            console.warn("Could not save pending role to localStorage. Role persistence may fail.", e);
        }

        try {
            const { GoogleAuthProvider, signInWithPopup }: AuthModule = await import('firebase/auth');
            const provider = new GoogleAuthProvider();
            await signInWithPopup(authInstance, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            try {
                localStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
            } catch (e) {
                console.warn("Could not remove pending role from localStorage on login failure.", e);
            }
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        const authInstance = authRef.current;
        if (!authInstance) return;
        try {
            const { signOut }: AuthModule = await import('firebase/auth');
            await signOut(authInstance);
        } catch (error) {
            console.error("Error during sign-out:", error);
        }
    }, []);

    const value: AuthContextType = {
        user,
        userRole,
        loading,
        isConfigured: isFirebaseConfigured,
        loginWithGoogle,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};