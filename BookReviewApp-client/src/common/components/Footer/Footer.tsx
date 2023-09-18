import React from 'react';
import './Footer.scss';
import { Logo } from '../Logo';
import { Nav } from '../Nav';

export const Footer: React.FC = React.memo(() => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <Logo />

          <Nav />
        </div>
      </div>
    </footer>
  );
});
