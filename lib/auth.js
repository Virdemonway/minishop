import { useEffect, useState } from 'react';
import Router from 'next/router';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      Router.push('/');
    } else {
      alert('Login failed');
    }
  };

  const register = async (email, password, name) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      Router.push('/');
    } else {
      alert('Registration failed');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    Router.push('/login');
  };

  return { user, login, register, logout };
}

export function withAuth(handler) {
  return async (req, res) => {
    const user = req.session?.user;
    req.session = req.session || {};
    req.session.user = user;
    return handler(req, res);
  };
}