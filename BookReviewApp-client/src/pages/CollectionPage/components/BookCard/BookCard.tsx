import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BookCard.scss';

type Props = {
  id: string;
  coverSrc: string[];
  title: string;
  author: string;
  averageRating: number;
  numberOfRatings: number;
  className?: string;
};

export const BookCard: React.FC<Props> = React.memo(
  ({
    id, coverSrc, title, author, averageRating, numberOfRatings, className = '',
  }) => {
    const { search } = useLocation();

    return (
      <article className={`bookCard ${className}`}>
        <Link
          to={`${id}`}
          state={{ search }} // save in state and send search query to child route
          className="bookCard__link"
        >
          <div className="bookCard__cover">
            <img
              src={coverSrc[0]}
              alt={title}
              className="bookCard__photo"
            />
          </div>

          <h3 className="bookCard__title">{title}</h3>

          <p className="bookCard__author">{author}</p>

          <div
            className="bookCard__rating"
            style={{ '--rating': averageRating } as React.CSSProperties}
          />

          <p className="bookCard__reviews">
            (Reviews:&nbsp;
            {`${numberOfRatings}`}
            )
          </p>
        </Link>
      </article>
    );
  },
);
