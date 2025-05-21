import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <nav className="bg-gray-900 bg-opacity-80 p-4"></nav>; // 加载时显示空导航栏
  }

  return (
    <nav className="bg-gray-900 bg-opacity-80 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold neon-text cursor-pointer">Art & Design</span>
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-cyan-400">Products</Link>
          <Link href="/cart" className="text-white hover:text-cyan-400">Cart</Link>
          {user ? (
            <>
              <Link href="/orders" className="text-white hover:text-cyan-400">Orders</Link>
              <button onClick={logout} className="text-white hover:text-cyan-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-cyan-400">Login</Link>
              <Link href="/register" className="text-white hover:text-cyan-400">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
