import prisma from '../../lib/prisma';
import { useAuth } from '../../lib/auth';

export async function getServerSideProps({ params }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });
  const relatedProducts = await prisma.product.findMany({
    where: { id: { not: parseInt(params.id) } },
    take: 3,
  });
  return { props: { product, relatedProducts } };
}

export default function ProductDetail({ product, relatedProducts }) {
  const { user } = useAuth();

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart.');
      return;
    }

    const response = await fetch(`/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    if (response.ok) {
      alert('Added to cart!');
    } else {
      alert('Failed to add to cart.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 bg-gray-800 bg-opacity-50 rounded-lg p-6">
        <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-96 object-cover rounded" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold neon-text mb-4">{product.name}</h1>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-cyan-400 mb-4">${product.price}</p>
          <button onClick={addToCart} className="neon-button">Add to Cart</button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold neon-text mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map(related => (
            <Link key={related.id} href={`/product/${related.id}`}>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <img src={related.image} alt={related.name} className="w-full h-48 object-cover rounded" />
                <h3 className="text-lg font-semibold neon-text mt-2">{related.name}</h3>
                <p className="text-gray-300">{related.description}</p>
                <p className="text-xl font-bold text-cyan-400 mt-2">${related.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}