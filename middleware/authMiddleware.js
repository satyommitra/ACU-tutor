// authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using JWT_SECRET from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user information to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If token is not provided in the Authorization header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };  // Correct export statement



