import React from 'react';
import './Menu.scss';
import { Icon } from '../Icon';
import { Nav } from '../Nav';
import { Logo } from '../Logo';

export const Menu: React.FC = React.memo(() => {
  return (
    <aside className="menu">
      <div className="container">
        <div className="menu__top">
          <Logo />

          <Icon href="#close" className="icon--close" />
        </div>

        <div className="menu__bottom">
          <Nav className="menu__nav" />

          <a href="tel:+380 977 44-37-46" className="menu__phone-number">
            +380 977-44-37-46
          </a>

          <a href="tel:+380 977 44-37-46" className="menu__call-to-info">
            Call to info
          </a>
        </div>
      </div>
    </aside>
  );
});
