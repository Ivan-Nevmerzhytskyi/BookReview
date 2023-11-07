import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import './Auth.scss';
import { AuthContext } from '../../store/AuthContext';
import { Loader } from '../../common/components/Loader';
import { ErrorNotification } from '../../common/components/ErrorNotification';

function validation(field: string, value: string): string {
  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d)[a-zA-Z\W_\d]+$/;

  switch (field) {
    case 'name':
    case 'username':
      if (value.trim().length < 4) {
        return 'At least 4 characters';
      }

      return '';

    case 'email':
      if (!emailPattern.test(value)) {
        return 'Email is not valid';
      }

      return '';

    case 'password':
      if (!passwordPattern.test(value) || value.length < 6) {
        return 'At least 6 chars with letter, symbol and number';
      }

      return '';

    default:
      return '';
  }
}

export const AuthPage: React.FC = React.memo(() => {
  const [{
    name, username, email, password,
  }, setValues] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needToRegister, setNeedToRegister] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  const isSubmitDisabled = needToRegister
    ? isSubmitting
      || !!errors.name || !name
      || !!errors.username || !username
      || !!errors.email || !email
      || !!errors.password || !password
    : isSubmitting
      || !!errors.email || !email
      || !!errors.password || !password;

  const registerUser = async () => {
    await register({
      name, username, email, password,
    });

    setRegistered(true);
  };

  const loginUser = async () => {
    await login({ email, password });

    navigate(state?.pathname || '/', { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (needToRegister) {
        await registerUser();
      } else {
        await loginUser();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.message) {
          setErrorMessage(error.message);
        }

        if (!error.response?.data) {
          return;
        }

        const errorDataFromServer = error.response.data;

        // Validations on the server side:
        if (errorDataFromServer.errors?.name) {
          setErrors(current => ({
            ...current,
            name: errorDataFromServer.errors.name,
          }));
        }

        if (errorDataFromServer.errors?.username) {
          setErrors(current => ({
            ...current,
            username: errorDataFromServer.errors.username,
          }));
        }

        if (errorDataFromServer.errors?.email) {
          setErrors(current => ({
            ...current,
            email: errorDataFromServer.errors.email,
          }));
        }

        if (errorDataFromServer.errors?.password) {
          setErrors(current => ({
            ...current,
            password: errorDataFromServer.errors.password,
          }));
        }

        if (errorDataFromServer.message) {
          setErrorMessage(errorDataFromServer.message);
        }
      } else {
        setErrorMessage('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: field, value } = event.target;

    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: '' }));
  };

  const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: field, value } = event.currentTarget;

    setErrors(current => ({
      ...current,
      [field]: validation(field, value),
    }));
  };

  if (registered) {
    return (
      <section className="auth">
        <div className="container">
          <h1>Check your email</h1>
          <p>We have sent you an email with the activation link</p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth">
      <div className="container">
        <h2 className="section-title">
          {needToRegister ? 'You need to register' : 'Log in to open account'}
        </h2>

        <div className="auth__content">
          <form
            action="/"
            method="POST"
            className="auth__form"
            onSubmit={handleSubmit}
          >
            {needToRegister && (
              <>
                <label htmlFor="name" className="auth__label">
                  Your Name:
                </label>
                {errors.name && (
                  <span className="auth__error">
                    {errors.name}
                  </span>
                )}
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="e.g. James Bond"
                  className="auth__field form-field"
                  disabled={isSubmitting}
                  value={name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />

                <label htmlFor="username" className="auth__label">
                  Your Username:
                </label>
                {errors.username && (
                  <span className="auth__error">
                    {errors.username}
                  </span>
                )}
                <input
                  id="username"
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  placeholder="e.g. James_Bond"
                  className="auth__field form-field"
                  disabled={isSubmitting}
                  value={username}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
              </>
            )}

            <label htmlFor="email" className="auth__label">
              Your Email:
            </label>
            {errors.email && (
              <span className="auth__error">
                {errors.email}
              </span>
            )}
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="e.g. James_Bond@gmail.com"
              className="auth__field form-field"
              disabled={isSubmitting}
              value={email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />

            <label htmlFor="password" className="auth__label">
              Your Password:
            </label>
            {errors.password && (
              <span className="auth__error">
                {errors.password}
              </span>
            )}
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="*******"
              className="auth__field form-field"
              disabled={isSubmitting}
              value={password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />

            <button
              type="submit"
              className="auth__button button"
              disabled={isSubmitDisabled}
            >
              {isSubmitting && <Loader />}
              {!isSubmitting && needToRegister && 'Sign up'}
              {!isSubmitting && !needToRegister && 'Log in'}
            </button>
          </form>

          <div className="auth__toggle">
            <label htmlFor="toggle" className="auth__label">
              {needToRegister
                ? 'Already have an account?'
                : 'Do not have an account?'}
            </label>
            <button
              id="toggle"
              type="button"
              className="button"
              onClick={() => setNeedToRegister(current => !current)}
            >
              {needToRegister ? 'Log in?' : 'Sign up'}
            </button>
          </div>
        </div>

        {errorMessage && <ErrorNotification message={errorMessage} />}
      </div>
    </section>
  );
});
