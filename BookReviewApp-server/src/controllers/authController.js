import bcrypt from 'bcrypt';

import * as userService from '../services/userService.js';
import { jwtService } from '../services/jwtService.js';
import { tokenService } from '../services/tokenService.js';
import { ApiError } from '../exceptions/ApiError.js';

function validation(field, value) {
  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d)[a-zA-Z\W_\d]+$/;

  switch (field) {
    case 'name':
    case 'username':
      if (value.trim().length < 4) {
        return 'At least 4 characters';
      }

      break;

    case 'email':
      if (!value) {
        return 'Email is required';
      }

      if (!emailPattern.test(value)) {
        return 'Email is not valid';
      }

      break;

    case 'password':
      if (!value) {
        return 'Password is required';
      }

      if (!passwordPattern.test(value) || value.length < 6) {
        return 'At least 6 chars with letter, symbol and number';
      }

      break;
  }
}

export const register = async(req, res, next) => {
  const { name, username, email, password } = req.body;

  const errors = {
    name: validation('name', name),
    username: validation('username', username),
    email: validation('email', email),
    password: validation('password', password),
  };

  if (errors.name || errors.username || errors.email || errors.password) {
    throw ApiError.BadRequest('Validation error', errors);
  }

  const existingUser = await userService.getByEmail(email);

  if (existingUser) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already taken',
    });
  }

  await userService.register({
    name, username, email, password,
  });

  res.statusCode = 201;
  res.send({ message: 'OK' });
};

export const activate = async(req, res, next) => {
  const { activationToken } = req.params;

  const user = await userService.getByActivationToken(activationToken);

  if (!user) {
    throw ApiError.NotFound();
  }

  // user has successfully verified his email:
  user.activationToken = null;
  await user.save();

  await sendAuthentication(res, user);
};

export const login = async(req, res, next) => {
  const { email, password } = req.body;

  const user = await userService.getByEmail(email);

  if (!user) {
    throw ApiError.BadRequest('Validation error', {
      email: 'User with this email does not exist',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Validation error', {
      password: 'Password is wrong',
    });
  }

  await sendAuthentication(res, user);
};

export const logout = async(req, res, next) => {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  await tokenService.remove(userData.id);

  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

export const refresh = async(req, res, next) => {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  if (!userData) {
    throw ApiError.Unauthorized();
  }

  const token = await tokenService.getByToken(refreshToken);

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.getByEmail(userData.email);

  await sendAuthentication(res, user);
};

const sendAuthentication = async(res, user) => {
  const userData = userService.normalize(user);
  const accessToken = jwtService.generateAccessToken(userData);
  const refreshToken = jwtService.generateRefreshToken(userData);

  await tokenService.save(userData.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true, // client JS will not have access to the cookie
    // sameSite: 'none', // does not require the same domain
    // secure: true, // set cookies only over https
  });

  res.send({
    user: userData,
    accessToken,
  });
};
