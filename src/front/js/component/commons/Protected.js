import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, requiredRole }) {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = storedRole ? storedRole : null;

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (requiredRole && role !== requiredRole) {
            navigate('/inicio'); // Redirect to home or unauthorized page
        }
    }, [user, requiredRole, navigate, role]);

    return (
        <>
            {children}
        </>
    );
}
