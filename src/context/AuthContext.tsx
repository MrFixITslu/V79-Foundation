import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role } from '../types.js';
import { useToast } from './ToastContext.tsx';

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (email: string, password?: string) => Promise<any>;
  verifyMfa: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: Role) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  register: (name: string, email: string, password?: string, role?: Role) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'admin', // Default to admin for immediate access to all tools
  login: async () => false,
  verifyMfa: async () => false,
  logout: () => {},
  setRole: () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  register: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>({
    id: 'usr_admin',
    name: 'Sarah Vision Director',
    email: 'admin@vision79.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    verified: true,
    createdAt: '2025-01-15T08:00:00Z',
  });

  const [role, setRoleState] = useState<Role>('admin');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Sync session on startup for the default admin user
  useEffect(() => {
    fetch('/api/auth/set-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', email: 'admin@vision79.org', name: 'Sarah Vision Director' }),
    }).catch((err) => console.error('Initial session sync failed:', err));
  }, []);

  const setRole = async (newRole: Role) => {
    setRoleState(newRole);
    let mockUser = user;
    if (user) {
      mockUser = { ...user, role: newRole };
      setUser(mockUser);
    } else {
      mockUser = {
        id: `usr_${newRole}_demo`,
        name: `${newRole.toUpperCase()} Demo User`,
        email: `${newRole}@vision79.org`,
        role: newRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        verified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
    }
    showToast(`Switched active view role to: ${newRole.toUpperCase()}`, 'info');

    // Securely synchronize active view role with backend session
    try {
      await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          email: mockUser?.email || `${newRole}@vision79.org`,
          name: mockUser?.name || `${newRole.toUpperCase()} Demo User`,
        }),
      });
    } catch (err) {
      console.error('Error synchronizing view role:', err);
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.mfaRequired) {
          showToast('Multi-Factor Authentication is required.', 'info');
          return { mfaRequired: true, email: data.email };
        }
        setUser(data.user);
        setRoleState(data.user.role);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        closeAuthModal();
        return true;
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Login failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Login network error', 'error');
    }
    return false;
  };

  const verifyMfa = async (email: string, code: string) => {
    try {
      const res = await fetch('/api/auth/login/mfa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setRoleState(data.user.role);
        showToast('Multi-Factor Authentication verified. Access granted!', 'success');
        closeAuthModal();
        return true;
      } else {
        const errData = await res.json();
        showToast(errData.error || 'MFA verification failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('MFA verification network error', 'error');
    }
    return false;
  };

  const register = async (name: string, email: string, password?: string, role: Role = 'donor') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        const resData = await res.json();
        setUser(resData.user);
        setRoleState(resData.user.role);
        showToast(`Account registered successfully as ${resData.user.role}!`, 'success');
        closeAuthModal();
        return true;
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Registration failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Registration network error', 'error');
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setRoleState('guest');
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        verifyMfa,
        logout,
        setRole,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
