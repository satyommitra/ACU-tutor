import jwt from 'jsonwebtoken';

// Secret key for signing the token
const secretKey = 'your-secret-key';

// Payload data (could be user data)
const payload = {
  userId: '12345',
  username: 'john_doe'
};

// Generate JWT token
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

// Print the generated token to the terminal
console.log('Generated JWT Token:', token);

