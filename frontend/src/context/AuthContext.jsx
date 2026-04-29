import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axios.get('https://rumahrapi.com/backend/api/me');
            setUser(res.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (ncs) => {
        const res = await axios.post('https://rumahrapi.com/backend/api/login', { ncs });
        const { user, token } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const register = async (ncs, nama) => {
        const res = await axios.post('https://rumahrapi.com/backend/api/register', { ncs, nama });
        const { user, token } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = async () => {
        try {
            await axios.post('https://rumahrapi.com/backend/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAdmin = () => user?.role === 'admin' || user?.role === 'superadmin';
    const isSuperadmin = () => user?.role === 'superadmin';
    const isMember = () => user?.role === 'member';

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            isAdmin, 
            isSuperadmin,
            isMember, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}