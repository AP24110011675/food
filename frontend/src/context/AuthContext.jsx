import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.get('/auth/profile');
            setUser(data.data);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.data);
        return data;
    };

    const register = async (name, email, password, phone) => {
        const { data } = await api.post('/auth/register', { name, email, password, phone });
        localStorage.setItem('token', data.token);
        setUser(data.data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        register,
        checkAuth: getProfile
    }), [user, loading, getProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);