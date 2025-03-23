import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to authenticate users using JWT.
 * @param {Array} roles - Array of allowed roles (e.g., ['superadmin', 'manager']).
 * @returns {Function} - Express middleware function.
 */
const auth = (roles = []) => {
  return async (req, res, next) => {
   
    const token = req.header('Authorization')?.replace('Bearer ', '');

    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }

      req.userId = decoded.userId;
      req.role = decoded.role;

  
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.', error: error.message });
    }
  };
};

export default auth;