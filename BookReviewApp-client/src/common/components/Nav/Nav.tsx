import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import './Nav.scss';
import { AuthContext } from '../../../store/AuthContext';

type Props = {
  className?: string;
  row?: boolean;
};

export const Nav: React.FC<Props> = React.memo(({
  className = '',
  row = false,
}) => {
  const { user } = useContext(AuthContext);
  const { search } = useLocation();

  const navLinks = [
    {
      href: '/',
      linkText: 'Home',
    },
    {
      href: { pathname: '/books', search },
      linkText: 'Collection',
    },
    {
      href: '/user',
      linkText: user ? user.username : 'Account',
    },
  ];

  return (
    <nav className={`nav ${className}`}>
      <ul
        className={classNames('nav__list', {
          'nav__list--row': row,
        })}
      >
        {navLinks.map(({ href, linkText }) => (
          <li
            key={linkText}
            className={classNames('nav__item', {
              'nav__item--row': row,
            })}
          >
            <NavLink
              to={href}
              // end
              className={({ isActive }) => classNames(
                'nav__link',
                {
                  'nav__link--row': row,
                  'nav__link--is-active': isActive,
                },
              )}
            >
              {linkText}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
});
