const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'Neon Art Print', description: 'A vibrant neon art print', price: 29.99, stock: 100, image: 'https://via.placeholder.com/300?text=Neon+Art' },
      { name: 'Cyber Sculpture', description: 'A futuristic cyber sculpture', price: 49.99, stock: 50, image: 'https://via.placeholder.com/300?text=Cyber+Sculpture' },
    ],
  });
  console.log('Database seeded with products.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());