import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './User.scss';
import { AuthContext } from '../../store/AuthContext';

export const UserPage: React.FC = React.memo(() => {
  const { user } = useContext(AuthContext);

  return (
    <section className="user">
      <div className="container">
        <h2 className="section-title">
          {`Hello, ${user?.username}!`}
        </h2>

        <div className="user__content">
          <Link
            to="books"
            className="user__link button"
          >
            Go to your books
          </Link>

          <Link
            to="books/new"
            className="user__link button"
          >
            Add new book
          </Link>
        </div>
      </div>
    </section>
  );
});
