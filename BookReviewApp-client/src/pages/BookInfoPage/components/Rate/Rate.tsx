import React, { useState, useContext, useEffect } from 'react';
import './Rate.scss';

import { useAppDispatch } from '../../../../customHooks/reduxHooks';
import { AuthContext } from '../../../../store/AuthContext';
import * as booksActions from '../../../../store/features/books';
import * as userService from '../../../../services/users';
import {
  ErrorNotification,
} from '../../../../common/components/ErrorNotification';

type Props = {
  bookId: string;
};

export const Rate = React.memo<Props>(({ bookId }) => {
  const dispatch = useAppDispatch();
  const [stars, setStars] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, setUser } = useContext(AuthContext);

  // set the user's rating of the book when the page is loaded
  useEffect(() => {
    const userRating = user?.booksRating
      .find(bookRating => bookRating.bookId === bookId);

    setStars(userRating ? userRating.rating : null);
  }, [user?.id]);

  const handleRate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setErrorMessage('Please authorize before rating the book');

      return;
    }

    const { value } = event.currentTarget;

    setUpdating(true);
    setErrorMessage('');

    const bookRating = (value === stars)
      ? { bookId, rating: null }
      : { bookId, rating: value };

    userService.updateUserBookRating(user.id, bookRating)
      .then(setUser)
      .then(() => dispatch(booksActions.updateBook({ id: bookId })).unwrap())
      .then(() => {
        if (value === stars) {
          setStars(null);
        } else {
          setStars(value);
        }
      })
      .catch(() => {
        setErrorMessage('Unable to update book vote');
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <div className="rate">
      {errorMessage && <ErrorNotification message={errorMessage} />}

      {['5', '4', '3', '2', '1'].map((star) => (
        <React.Fragment key={star}>
          <input
            id={`star${star}`}
            className="rate__star"
            type="checkbox"
            name={`star${star}`}
            value={`${star}`}
            checked={stars === star}
            disabled={updating}
            onChange={handleRate}
          />
          <label
            htmlFor={`star${star}`}
            className="rate__star-label"
            aria-label={`Book rate - ${star} star`}
          >
            {' '}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
});
