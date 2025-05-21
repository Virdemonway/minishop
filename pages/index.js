import prisma from '../lib/prisma';
import Link from 'next/link';

export async function getServerSideProps() {
  const products = await prisma.product.findMany();
  return { props: { products } };
}

export default function Home({ products }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold neon-text mb-6 text-center">Welcome to Art & Design</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
              <h3 className="text-lg font-semibold neon-text mt-2">{product.name}</h3>
              <p className="text-gray-300">{product.description}</p>
              <p className="text-xl font-bold text-cyan-400 mt-2">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}