import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = await prisma.product.findMany();
    
    const formattedProducts = products.map(product => ({
      ...product,
      image: `https://picsum.photos/seed/${product.id}/200/200`,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}  