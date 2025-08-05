import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  updateBudget: (newBudget: number) => void;
  monthlyBudget?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  // Initialize monthlyBudget from localStorage if available
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const stored = localStorage.getItem('monthlyBudget');
    return stored ? JSON.parse(stored) : 0;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    setUser(decoded);
    // Optionally, you could also load monthlyBudget from user profile here if available
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMonthlyBudget(0);
    localStorage.removeItem('monthlyBudget');
  };

  const updateBudget = (newBudget: number) => {
    setMonthlyBudget(newBudget);
    localStorage.setItem('monthlyBudget', JSON.stringify(newBudget));
  };

  // Keep monthlyBudget in sync with localStorage if changed elsewhere
  useEffect(() => {
    localStorage.setItem('monthlyBudget', JSON.stringify(monthlyBudget));
  }, [monthlyBudget]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateBudget, monthlyBudget }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};