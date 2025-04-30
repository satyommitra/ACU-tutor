// controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  // Step 1: Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Step 2: Create a new user if it doesn't exist
  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    // Step 3: If user is created successfully, return response
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Signup Error:', error); // Log the error
    res.status(500).json({ message: 'Something went wrong during signup', error });
  }
});


