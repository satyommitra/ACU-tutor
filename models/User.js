// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    progress: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // ✅ Proceed after hashing
  } catch (err) {
    next(err); // ✅ Handle any hashing errors
  }
});

const User = mongoose.model('User', userSchema);

export default User;

