import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    const { actions } = req.query;
    const action = actions[0];

    if (action === 'login') {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && bcrypt.compareSync(password, user.password)) {
        return res.status(200).json({ id: user.id, email: user.email, name: user.name, role: user.role });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else if (action === 'register') {
      const { email, password, name } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      return res.status(200).json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } else if (action === 'logout') {
      return res.status(200).json({ message: 'Logged out' });
    } else if (action === 'user') {
      return res.status(200).json(null); // 暂时返回 null，客户端处理
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error); // 记录错误到日志
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
