import React from 'react';
import './Home.scss';
import { AboutUs } from './components/AboutUs';
import { Contacts } from './components/Contacts';

export const HomePage: React.FC = React.memo(() => {
  return (
    <main className="home">
      {/* ↑ responsible for the background */}
      <div className="container">
        {/* ↑ responsible for horizontal constraints */}
        <div className="home__content">
          {/* ↑ responsible for the internal filling */}
          <AboutUs />
          <Contacts />
        </div>
      </div>
    </main>
  );
});
