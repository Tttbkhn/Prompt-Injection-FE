import axios from 'axios';
import { createContext, useCallback, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../util/constant';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Session timeout after 30 minutes
            if (user) {
                logout();
                alert('Session timed out, please log in again.');
            }
        }, 30 * 60 * 1000); // 30 minutes

        return () => clearTimeout(timeoutId); // Clean up timeout on component unmount
    }, [user]);

    const login = useCallback(async ({ username, password }) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { username, password });

            if (response?.data?.data?.access_token) {
                const token = response.data.data.access_token;
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
    }), [user, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
