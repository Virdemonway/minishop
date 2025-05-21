import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { cartId, total } = req.body;

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.status(200).json({ message: 'Order placed', order });
}