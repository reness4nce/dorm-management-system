// filepath: src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
interface AuthContextTypes {
    currentUser: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AuthContextTypes['currentUser']>(null);

    const login = async (email: string, password: string) => {
        // Simulate login logic
        setCurrentUser({ id: '1', name: 'John Doe', email, role: 'admin' });
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

