const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const register = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    token,
  };

  return userResponse;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.password) {
    throw new Error('Please use Google login for this account');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    token,
  };

  return userResponse;
};

const googleLogin = async (googleProfile) => {
  const { googleId, email, name, picture } = googleProfile;

  // Check if user exists with this Google ID
  let user = await User.findOne({ googleId });

  if (user) {
    user.name = name;
    user.avatar = picture;
    await user.save();
  } else {
    user = await User.findOne({ email });

    if (user) {
      user.googleId = googleId;
      user.avatar = picture;
      user.provider = 'google';
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        provider: 'google',
      });
    }
  }

  const token = generateToken(user._id);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    token,
  };

  return userResponse;
};

module.exports = {
  register,
  login,
  googleLogin,
};

