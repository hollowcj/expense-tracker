import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true              
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,            
    lowercase: true,       
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
}, { timestamps: true });  

// This is to hash passwords for security
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This is to compare the password entered to the password that was hashed in the previous code
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
