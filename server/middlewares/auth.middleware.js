const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // API routes now verify against SESSION_SECRET since these are long-lived tokens
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;   
    next();               
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};