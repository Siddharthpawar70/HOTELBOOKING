import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  joinedDate: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const defaultUser: UserProfile = {
  id: 'usr_rahul_99',
  name: 'Rahul Mehta',
  email: 'rahul.mehta@example.com',
  phone: '+91 98200 12345',
  city: 'Pune, Maharashtra',
  loyaltyTier: 'Gold',
  loyaltyPoints: 4850,
  joinedDate: 'Jan 2024'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('stayaura_user');
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('stayaura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stayaura_user');
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0].replace('.', ' '),
      email,
      phone: '+91 98000 00000',
      city: 'Pune, Maharashtra',
      loyaltyTier: 'Silver',
      loyaltyPoints: 500,
      joinedDate: 'Sep 2026'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
