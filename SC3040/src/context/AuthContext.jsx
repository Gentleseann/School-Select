import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check authentication status on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/verifySession', {
                    method: 'GET',
                    credentials: 'include', // Include cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) {
                        setLoggedIn(true);
                    }
                }
            } catch (error) {
                console.log('Auth check failed:', error);
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
