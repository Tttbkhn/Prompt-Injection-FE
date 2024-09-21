import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    const token = localStorage.getItem('user');

    if (!user && !token) {
        return <Navigate to="/login" />;  // Redirect to login 
    }

    return children;
};
