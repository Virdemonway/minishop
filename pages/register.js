import { useAuth } from '../lib/auth';

export default function Register() {
  const { register, loading } = useAuth();

  if (loading) {
    return <div className="container mx-auto p-4 text-white">Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
    await register(email, password, name);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold neon-text mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-white">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            required
          />
        </div>
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
        <button type="submit" className="neon-button">Register</button>
      </form>
    </div>
  );
}
