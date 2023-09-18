import React, { useEffect, useContext, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './common/styles/index.scss';
import { AuthContext } from './store/AuthContext';
import * as booksActions from './store/features/books';
import { useAppDispatch } from './customHooks/reduxHooks';

import { Header } from './common/components/Header';
import { Menu } from './common/components/Menu';
import { Footer } from './common/components/Footer';

export const App: React.FC = () => {
  const pageMenuRef = useRef<HTMLDivElement>(null);
  const pageMainRef = useRef<HTMLDivElement>(null);
  const { checkAuth } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('page');
    document.body.classList.add('page__body');

    // Check if user is authenticated on server
    checkAuth();
    // Get books from server using Redux store
    dispatch(booksActions.getBooks());
  }, []);

  // Scroll to the main content when changing the page
  useEffect(() => {
    pageMainRef.current?.scrollIntoView();
  }, [location.pathname]);

  // Control page overflow and menu opening when 'hash === #menu'
  useEffect(() => {
    if (location.hash === '#menu') {
      document.body.classList.add('page__body--with-menu');
      pageMenuRef.current?.classList.add('page__menu--target');
    } else {
      document.body.classList.remove('page__body--with-menu');
      pageMenuRef.current?.classList.remove('page__menu--target');
    }
  }, [location.hash]);

  return (
    <div className="page__content">
      <div className="page__menu" ref={pageMenuRef}>
        <Menu />
      </div>

      <Header />

      <div className="page__main" ref={pageMainRef}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
