// userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
    password: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    badges: [
      {
        name: { type: String },
        dateAwarded: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving it
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash password if it's modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for authentication
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update level based on XP
userSchema.methods.updateLevel = function () {
  if (this.xp >= 1000) {
    this.level = 2;
  }
  // Additional level-up logic based on XP
  return this.save();
};

// Indexing email for fast lookup
userSchema.index({ email: 1 });

// Check if the model already exists before creating it
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;



