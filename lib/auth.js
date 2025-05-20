import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const verifyToken = (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getServerSideUser = (req) => {
  const token = verifyToken(req);
  return token ? token.userId : null;
};  