import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { withAuth } from '../../../lib/auth';

export default withAuth(async function handler(req, res) {
  const { actions } = req.query;
  const action = actions[0];

  if (action === 'login') {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
      res.status(200).json(req.session.user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else if (action === 'register') {
    const { email, password, name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
      res.status(200).json(req.session.user);
    } catch (error) {
      res.status(400).json({ message: 'User already exists' });
    }
  } else if (action === 'logout') {
    req.session.destroy();
    res.status(200).json({ message: 'Logged out' });
  } else if (action === 'user') {
    res.status(200).json(req.session?.user || null);
  } else {
    res.status(400).json({ message: 'Invalid action' });
  }
});