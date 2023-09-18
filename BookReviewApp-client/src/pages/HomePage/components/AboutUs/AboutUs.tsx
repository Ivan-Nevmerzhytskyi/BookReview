/* eslint-disable max-len */
import React from 'react';
import './AboutUs.scss';

export const AboutUs: React.FC = React.memo(() => {
  return (
    <section className="aboutUs">
      <h2 className="section-title">About us</h2>
      <h3 className="aboutUs__title">
        Books Review: Find the best books to read today
      </h3>
      <p className="aboutUs__description">
        Welcome Booklovers!
        I’m John, an Ukrainian book reviewer. I started this Books Review site in 2023 and quickly realised I enjoy blogging and reviewing books almost as much as actually reading them. I hope you enjoy browsing all the reviews of books and book lists I have amassed over that time and find the perfect book for you. Then, sit back in your favourite reading chair and join me on this bookworm’s quest to find the best books to read!
      </p>
    </section>
  );
});
