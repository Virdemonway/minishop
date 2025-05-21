import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        router.push('/');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        router.push('/');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return { user, login, register, logout, loading };
}

export function withAuth(handler) {
  return async (req, res) => {
    const user = req.session?.user;
    req.session = req.session || {};
    req.session.user = user;
    return handler(req, res);
  };
}
