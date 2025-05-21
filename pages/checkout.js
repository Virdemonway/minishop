import { useAuth } from '../lib/auth';
import prisma from '../lib/prisma';

export async function getServerSideProps({ req }) {
  const user = req.session?.user;
  if (!user) return { props: { cart: null } };

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  return { props: { cart } };
}

export default function Checkout({ cart }) {
  const { user } = useAuth();

  if (!user || !cart || cart.items.length === 0) {
    return <div className="container mx-auto p-4 text-white">Your cart is empty or you need to login.</div>;
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: cart.id, total }),
    });

    if (response.ok) {
      alert('Order placed successfully!');
      window.location.href = '/orders';
    } else {
      alert('Failed to place order.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold neon-text mb-6">Checkout</h1>
      <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
        <h2 className="text-xl font-semibold neon-text mb-4">Order Summary</h2>
        {cart.items.map(item => (
          <div key={item.id} className="flex justify-between py-2">
            <span className="text-gray-300">{item.product.name} x {item.quantity}</span>
            <span className="text-cyan-400">${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4">
          <span className="neon-text">Total:</span>
          <span className="text-cyan-400">${total.toFixed(2)}</span>
        </div>
      </div>
      <button onClick={handleCheckout} className="mt-6 neon-button">Place Order</button>
    </div>
  );
}