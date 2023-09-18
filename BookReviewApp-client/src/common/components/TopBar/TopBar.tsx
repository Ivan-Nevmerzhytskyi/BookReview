import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './TopBar.scss';
import { Icon } from '../Icon';
import { Nav } from '../Nav';
import { Logo } from '../Logo';

export const TopBar: React.FC = React.memo(() => {
  const [isFixed, setIsFixed] = useState(false);

  // #region Set '.topBar' as fixed when '.page__main' at the top of window
  useEffect(() => {
    const main = document.querySelector<HTMLElement>('.page__main');

    const handleFixedTopBar = () => {
      const mainTopCoordinate = main?.getBoundingClientRect().top || 0;

      if (mainTopCoordinate > 0) { // (window.scrollY < window.innerHeight)
        setIsFixed(false);
      } else {
        setIsFixed(true);
      }
    };

    window.addEventListener('scroll', handleFixedTopBar);

    return () => window.removeEventListener('scroll', handleFixedTopBar);
  }, []);
  // #endregion

  return (
    <div
      className={classNames(
        'topBar',
        { 'topBar--fixed': isFixed },
      )}
    >
      <div className="topBar__content">
        <div className="topBar__animation" />

        <Logo />
      </div>

      <Nav className="nav--disabledOnSmallScreen" row />

      <div className="topBar__icons">
        <Icon href="tel:+380 977-44-37-46" className="icon--phone">
          <div className="icon__tooltip">+380 977-44-37-46</div>
        </Icon>

        <Icon href="#menu" className="icon--menu" />
      </div>
    </div>
  );
});
