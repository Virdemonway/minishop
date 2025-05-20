import cookie from 'cookie';

export default function handler(req, res) {
  // 清除token cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );

  res.status(200).json({ message: 'Logged out successfully' });
}  