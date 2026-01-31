import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios base URL - use relative path to allow proxying
    axios.defaults.baseURL = '/api';

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['x-auth-token'] = token;
                try {
                    const res = await axios.get('/auth/profile');
                    setUser({ ...res.data, token });
                } catch (err) {
                    console.error("Load user error", err);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['x-auth-token'];
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['x-auth-token'] = res.data.token;

            // Fetch user details immediately to ensure role is available
            const profile = await axios.get('/auth/profile');
            setUser({ ...profile.data, token: res.data.token });
            return { success: true, user: profile.data };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['x-auth-token'] = res.data.token;

            const profile = await axios.get('/auth/profile');
            setUser({ ...profile.data, token: res.data.token });
            return { success: true, user: profile.data };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
