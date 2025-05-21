import { useAuth } from '../lib/auth';

export default function Login() {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    await login(email, password);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold neon-text mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-white">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-white">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="neon-button">Login</button>
      </form>
    </div>
  );
}