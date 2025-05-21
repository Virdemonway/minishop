import prisma from '../lib/prisma';
import { useAuth } from '../lib/auth';

export async function getServerSideProps({ req }) {
  const user = req.session?.user;
  if (!user) return { props: { orders: [] } };

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  return { props: { orders } };
}

export default function Orders({ orders }) {
  const { user } = useAuth();

  if (!user) {
    return <div className="container mx-auto p-4 text-white">Please login to view your orders.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold neon-text mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-white">You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold neon-text">Order #{order.id}</h2>
            <p className="text-gray-300">Status: {order.status}</p>
            <p className="text-cyan-400">Total: ${order.total}</p>
            <h3 className="mt-2 font-medium text-white">Items:</h3>
            {order.items.map(item => (
              <div key={item.id} className="py-1 text-gray-300">
                <span>{item.product.name} x {item.quantity} - ${item.price}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}