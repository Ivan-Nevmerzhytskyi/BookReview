import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign(
    user,
    process.env.JWT_ACCESS_KEY,
    { expiresIn: '10m' },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    user,
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '30 days' },
  );
}

function validateAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY);
  } catch (error) {
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY);
  } catch (error) {
    return null;
  }
}

export const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};
