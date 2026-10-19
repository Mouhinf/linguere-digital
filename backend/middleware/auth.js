const jwt = require('jsonwebtoken');

// Algorithme épinglé explicitement : empêche les attaques par confusion
// d'algorithme (jeton forgé avec "alg":"none", ou bascule RS256 → HS256).
const JWT_ALGORITHMS = ['HS256'];

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: JWT_ALGORITHMS
    });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  JWT_ALGORITHMS
};
