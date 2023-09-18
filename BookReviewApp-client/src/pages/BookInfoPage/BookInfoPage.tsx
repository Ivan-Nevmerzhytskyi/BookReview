import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import {
  Link, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import './BookInfo.scss';
import { UserType } from '../../common/types/UserType';
import { CommentType } from '../../common/types/CommentType';
import { useAppSelector } from '../../customHooks/reduxHooks';
import * as userService from '../../services/users';
import * as commentService from '../../services/comments';

import { Carousel } from './components/Carousel';
import { UserInfo } from './components/UserInfo';
import { Rate } from './components/Rate';
import { CommentList } from './components/CommentList';
import { Loader } from '../../common/components/Loader';
import { ErrorNotification } from '../../common/components/ErrorNotification';

export const BookInfoPage: React.FC = React.memo(() => {
  const [user, setUser] = useState<UserType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { books } = useAppSelector(state => state.books);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams();
  // const normalizedBookId = bookId ? +bookId : 0; // when bookId is integer
  const selectedBook = useMemo(
    () => books.find(book => book.id === bookId) || null,
    [books, bookId],
  );

  useEffect(() => {
    // For the first render when "books" in context is an empty array
    if (books.length === 0) {
      setErrorMessage('No books yet');

      return;
    }

    if (!selectedBook) {
      setErrorMessage('No book selected');

      setTimeout(() => {
        navigate('..');
      }, 2000);

      return;
    }

    setLoading(true);
    setErrorMessage('');

    Promise.all([
      userService.getUserById(selectedBook.userId),
      commentService.getCommentsByBookId(selectedBook.id),
    ])
      .then(([userFromServer, commentsFromServer]) => {
        setUser(userFromServer);
        setComments(commentsFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load user or comments');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedBook?.userId, selectedBook?.id]);

  const updateComment = useCallback((apdatedComment: CommentType) => {
    setComments((currentComments) => {
      const newComments = [...currentComments];
      const index = newComments.findIndex(
        (comment) => comment.id === apdatedComment.id,
      );

      newComments.splice(index, 1, apdatedComment);

      return newComments;
    });
  }, []);

  // If "bookId" not a number or an integer => go to parent route
  // if (!normalizedBookId || !Number.isInteger(normalizedBookId)) {
  //   return <Navigate to=".." />;
  // }

  return (
    <section className="bookInfo">
      <div className="container">
        <h2 className="section-title">Book info</h2>

        <Link
          to={{
            pathname: '..',
            search: state?.search, // save search parameters when returning to the parent router
          }}
          className="bookInfo__link"
        >
          Go back
        </Link>

        <div className="bookInfo__content">
          {selectedBook && (
            <>
              <Carousel coverSrc={selectedBook.coverSrc} />

              <h3 className="bookInfo__title">
                {`${selectedBook.title} write by ${selectedBook.author}`}
              </h3>

              <p className="bookInfo__user">
                {'Posted by '}
                {user && <UserInfo user={user} />}
              </p>

              <p className="bookInfo__description">
                {selectedBook.description}
              </p>

              <div className="bookInfo__vote">
                Your vote:&nbsp;
                <Rate
                  bookId={selectedBook.id}
                />
              </div>

              {loading && <Loader />}

              {!loading && comments.length > 0 && (
                <CommentList
                  comments={comments}
                  onUpdate={updateComment}
                />
              )}

              {!loading && !errorMessage && comments.length === 0 && (
                <div className="bookInfo__comments">
                  <hr />
                  <b>No comments yet</b>
                </div>
              )}
            </>
          )}

          {errorMessage && <ErrorNotification message={errorMessage} />}
        </div>
      </div>
    </section>
  );
});
