import prisma from '../lib/prisma';
import { useAuth } from '../lib/auth';
import Link from 'next/link';

export async function getServerSideProps({ req }) {
  const user = req.session?.user;
  if (!user) return { props: { cart: null } };

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  return { props: { cart } };
}

export default function Cart({ cart }) {
  const { user } = useAuth();

  if (!user || !cart) {
    return <div className="container mx-auto p-4 text-white">Please login to view your cart.</div>;
  }

  const removeFromCart = async (itemId) => {
    const response = await fetch(`/api/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert('Failed to remove item.');
    }
  };

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold neon-text mb-6">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p className="text-white">Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h2 className="text-lg font-semibold neon-text">{item.product.name}</h2>
                  <p className="text-gray-300">Quantity: {item.quantity}</p>
                  <p className="text-cyan-400">Price: ${item.product.price}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold neon-text">Total: ${total.toFixed(2)}</p>
            <Link href="/checkout" className="neon-button">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}