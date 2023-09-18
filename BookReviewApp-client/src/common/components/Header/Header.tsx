import React from 'react';
import './Header.scss';
import { TopBar } from '../TopBar';
import { ThemeSwitcher } from '../ThemeSwitcher';

export const Header: React.FC = React.memo(() => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__top">
            <TopBar />

            <ThemeSwitcher />
          </div>

          <div className="header__bottom">
            <h1 className="header__title">Books Review</h1>
          </div>
        </div>
      </div>
    </header>
  );
});
