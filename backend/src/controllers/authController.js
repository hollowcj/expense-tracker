import User from '../models/User.js';
import jwt from 'jsonwebtoken';

//To help generate a JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    
    process.env.JWT_SECRET,            // This is the secret key form the .env
    { expiresIn: '30d' }               // The token will expire in 30 days
  );
};


export const registerUser = async (req, res, next) => {
  try {const { name, email, password } = req.body;  

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // To create a user
    const user = await User.create({ name, email, password });

  
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);  
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // To find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};


export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user }); 
};

