import React, { useState } from 'react';
import { AuthContext } from './contexts/AuthContextObject';

function getInitialAuthState() {
  try {
    const storedUser = localStorage.getItem('financeUser');

    if (!storedUser) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    const parsedUser = JSON.parse(storedUser);

    return {
      isAuthenticated: true,
      user: { email: parsedUser.email, name: parsedUser.name },
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}

export function AuthProvider({ children }) {
  const initialAuthState = getInitialAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated);
  const [user, setUser] = useState(initialAuthState.user);
  const [authMessage, setAuthMessage] = useState('');
  const [loading] = useState(false);

  const login = (email, password) => {
    console.log('Login attempt:', { email, password });
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const storedUser = localStorage.getItem('financeUser');
    console.log('Stored user in localStorage:', storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed stored user:', parsedUser);
      console.log('Comparing:', {
        inputEmail: email,
        storedEmail: parsedUser.email,
        emailsMatch: parsedUser.email === email,
        inputPassword: password,
        storedPassword: parsedUser.password,
        passwordsMatch: parsedUser.password === password
      });
      if (parsedUser.email === email && parsedUser.password === password) {
        const userData = { email: parsedUser.email, name: parsedUser.name };
        console.log('Setting user and authentication:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('Login successful');
        return { success: true };
      }
    }

    console.log('Checking demo credentials');
    if (email === 'demo@example.com' && password === 'demo123') {
      const demoUser = { email, name: 'Demo User' };
      console.log('Setting demo user');
      setUser(demoUser);
      setIsAuthenticated(true);
      console.log('Demo login successful');
      return { success: true };
    }

    console.log('Login failed - no matching credentials found');
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password, confirmPassword) => {
    console.log('Signup attempt:', { name, email, password, confirmPassword });
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: 'All fields are required' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const userData = { email, name, password };
    console.log('Storing user data:', userData);
    localStorage.setItem('financeUser', JSON.stringify(userData));
    console.log('Setting user and authentication');
    setUser({ email, name });
    setIsAuthenticated(true);
    console.log('Signup successful');
    return { success: true };
  };

  const logout = () => {
    // Don't remove localStorage - keep user data for future logins
    setUser(null);
    setIsAuthenticated(false);
    setAuthMessage('Logged out successfully!');
  };

  const clearAuthMessage = () => {
    setAuthMessage('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, signup, logout, authMessage, clearAuthMessage }}>
      {children}
    </AuthContext.Provider>
  );
}
