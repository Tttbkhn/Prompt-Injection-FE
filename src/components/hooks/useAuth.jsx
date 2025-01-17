import axios from 'axios';
import { createContext, useCallback, useContext, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../util/constant';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Session timeout after 60 minutes
            if (user) {
                logout();
                alert('Session timed out, please log in again.');
            }
        }, 30 * 60 * 1000); // 30 minutes

        return () => clearTimeout(timeoutId); // Clean up timeout on component unmount
    }, [user]);

    const login = useCallback(async ({ username, password }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, new URLSearchParams({
                username: username,
                password: password
            }));
            setUsername(username)
            if (response?.data?.access_token) {
                const token = response.data.access_token;
                setUser(token);
                navigate('/chat', { replace: true });
            }
        } catch (error) {
            throw error;
        }
    }, [setUser, navigate]);

    const logout = useCallback(() => {
        setUser(null);
        navigate('/login', { replace: true });
    }, [setUser, navigate]);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        username
    }), [user, login, logout, username]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
