
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from 'sonner';
// Remove the incorrect import as the file '../types/AuthContextTypes' does not exist.
// Instead, define the AuthContextType inline or ensure the correct path and file exist.

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isResident: boolean;
}

// Sample users for demo purposes
const SAMPLE_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com'
  },
  {
    id: '2',
    username: 'staff',
    password: 'staff123',
    role: 'staff',
    firstName: 'Staff',
    lastName: 'Member',
    email: 'staff@example.com'
  },
  {
    id: '3',
    username: 'john.doe',
    password: '123.doe',
    role: 'resident',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  },
  {
    id: '4',
    username: 'jane.smith',
    password: '123.smith',
    role: 'resident',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com'
  }
];

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  isResident: false
});

// Removed useAuth hook to comply with Fast Refresh requirements.

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (via localStorage)
    const savedUser = localStorage.getItem('dormUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('dormUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // First check for standard admin/staff accounts
    const user = SAMPLE_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('dormUser', JSON.stringify(user));
      toast.success(`Welcome, ${user.firstName}!`);
      return true;
    }

    toast.error('Invalid username or password');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dormUser');
    toast.info('You have been logged out');
  };

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser?.role === 'staff' || currentUser?.role === 'admin';
  const isResident = currentUser?.role === 'resident';

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isStaff,
    isResident
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};