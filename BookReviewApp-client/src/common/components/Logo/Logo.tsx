import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.scss';
import logo from '../../../images/logo.svg';

export const Logo: React.FC = React.memo(() => {
  return (
    <Link
      to="/home"
      className="logo logo__link"
    >
      <img src={logo} alt="BooksReview logo" className="logo__img" />
    </Link>
  );
});
