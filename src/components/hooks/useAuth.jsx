import axios from 'axios';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../util/constant';
import { useLocalStorage } from './useLocalStorage';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const navigate = useNavigate();

    const login = useCallback(
        async ({ username, password }) => {
            try {
                const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });

                if (response?.data) {
                    const token = response?.data?.access_token;
                    if (token) {
                        const decodedToken = jwtDecode(token);
                        setUser(token);  // Store the JWT token in localStorage
                        navigate('/chat', { replace: true });
                    }
                }
            } catch (error) {
                throw error;
            }
        },
        [setUser, navigate]
    );

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');  // Clear the JWT token
        navigate('/login', { replace: true });
    }, [setUser, navigate]);

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
