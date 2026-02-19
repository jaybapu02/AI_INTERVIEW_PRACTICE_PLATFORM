import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  skills: [String],
  experienceLevel: String,
  targetRole: String,
  preferredDomain: String,

  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
export default User;