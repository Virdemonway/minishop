import prisma from '../lib/prisma';

export default function Home({ products }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold neon-text mb-6">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl text-white">{product.name}</h2>
            <p className="text-white">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const products = await prisma.product.findMany();
    return { props: { products } };
  } catch (error) {
    console.error('getServerSideProps Error:', error);
    return { props: { products: [] } }; // 返回空数组，避免页面崩溃
  }
}
