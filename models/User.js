import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Other fields like progress, points can go here
});

const User = mongoose.model('User', userSchema);

export default User;


