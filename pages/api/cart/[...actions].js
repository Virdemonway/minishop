import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { actions } = req.query;
  const action = actions[0];
  const user = req.session?.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  if (action === 'add') {
    const { productId, quantity } = req.body;
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
    res.status(200).json({ message: 'Added to cart' });
  } else if (action === 'remove') {
    const { itemId } = req.body;
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
    res.status(200).json({ message: 'Removed from cart' });
  } else {
    res.status(400).json({ message: 'Invalid action' });
  }
}