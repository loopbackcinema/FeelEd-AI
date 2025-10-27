import React, { createContext, useContext } from 'react';
import type { FirebaseUser, UserRole } from '../types';

export const ROLE_STORAGE_KEY_PREFIX = 'feeled_user_role_';
export const PENDING_ROLE_STORAGE_KEY = 'feeled_pending_role';

// This interface defines the shape of the context data.
// It's used by the provider and consumers.
export interface AuthContextType {
  user: FirebaseUser | null;
  userRole: UserRole;
  loading: boolean;
  isConfigured: boolean;
  loginWithGoogle: (role: Exclude<UserRole, null>) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default undefined value.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The hook that components will use to access the auth context.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};