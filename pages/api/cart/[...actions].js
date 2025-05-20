import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient();

// 验证用户中间件
const authenticateUser = (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  const userId = authenticateUser(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const [action] = req.query.actions || [];

  try {
    switch (action) {
      case 'add':
        if (req.method === 'POST') {
          const { productId, quantity = 1 } = req.body;

          // 检查商品是否存在
          const product = await prisma.product.findUnique({
            where: { id: productId },
          });

          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }

          // 检查库存
          if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
          }

          // 添加到购物车
          const cartItem = await prisma.cart.upsert({
            where: { userId_productId: { userId, productId } },
            update: { quantity: { increment: quantity } },
            create: { userId, productId, quantity },
          });

          res.status(200).json(cartItem);
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case 'update':
        if (req.method === 'PUT') {
          const { productId, quantity } = req.body;

          const updatedItem = await prisma.cart.update({
            where: { userId_productId: { userId, productId } },
            data: { quantity },
          });

          res.status(200).json(updatedItem);
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case 'remove':
        if (req.method === 'DELETE') {
          const { productId } = req.query;

          await prisma.cart.delete({
            where: { userId_productId: { userId, productId } },
          });

          res.status(200).json({ message: 'Item removed from cart' });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      default:
        // 获取购物车
        if (req.method === 'GET') {
          const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
          });

          const formattedItems = cartItems.map(item => ({
            id: item.id,
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              description: item.product.description,
              image: `https://picsum.photos/seed/${item.product.id}/200/200`,
            },
            quantity: item.quantity,
            subtotal: item.quantity * item.product.price,
          }));

          res.status(200).json(formattedItems);
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
    }
  } catch (error) {
    console.error('Cart API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}  