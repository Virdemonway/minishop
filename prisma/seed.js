const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });

  // 创建示例产品
  const products = [
    { name: 'iPhone 14', price: 799, stock: 100, description: '最新款智能手机' },
    { name: 'MacBook Air', price: 1199, stock: 50, description: '轻薄便携笔记本电脑' },
    { name: 'iPad Pro', price: 799, stock: 75, description: '专业级平板电脑' },
    { name: 'Apple Watch Series 8', price: 399, stock: 80, description: '智能手表' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
      },
    });
  }

  console.log('🌱 Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });  