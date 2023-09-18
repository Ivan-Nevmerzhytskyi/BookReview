import React, { useMemo, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './Collection.scss';
import { BookType } from '../../common/types/BookType';
import { AuthContext } from '../../store/AuthContext';
import { useAppSelector } from '../../customHooks/reduxHooks';

import { BooksSortAndGroup } from './components/BooksSortAndGroup';
import { BooksSearch } from './components/BooksSearch';
import { BookCard } from './components/BookCard';
import { Pagination } from './components/Pagination';
import { Loader } from '../../common/components/Loader';
import { ErrorNotification } from '../../common/components/ErrorNotification';

export const CollectionPage: React.FC = React.memo(() => {
  const location = useLocation();
  const isUserCollection = location.pathname === '/user/books';
  const { user } = useContext(AuthContext);
  const { books, loading, errorMessage } = useAppSelector(state => state.books);

  // Show the books of the authenticated user
  const filteredBooks = useMemo(
    () => (isUserCollection
      ? books.filter(book => book.userId === user?.id)
      : books),
    [books, isUserCollection],
  );
  const [
    sortedAndGroupedBooks,
    setSortedAndGroupedBooks,
  ] = useState<BookType[]>([]);
  const [searchedBooks, setSearchedBooks] = useState<BookType[]>([]);
  const [visibleBooks, setVisibleBooks] = useState<BookType[]>([]);

  return (
    <section className="collection">
      <div className="container">
        <div className="collection__content">
          <h2 className="section-title">
            {isUserCollection ? 'Your collection' : 'Books collection'}
          </h2>

          {loading && <Loader />}

          {!loading && !errorMessage && filteredBooks.length > 0 && (
            <>
              <BooksSortAndGroup
                books={filteredBooks}
                onSortedAndGroupedBooks={setSortedAndGroupedBooks}
              />

              <BooksSearch
                books={sortedAndGroupedBooks}
                onSearchedBooks={setSearchedBooks}
              />

              <Pagination
                items={searchedBooks}
                setVisibleItems={setVisibleBooks}
              >
                <div className="collection__books">
                  {visibleBooks.map(({
                    id, coverSrc, title, author, averageRating, numberOfRatings,
                  }) => (
                    <BookCard
                      key={id}
                      id={id}
                      coverSrc={coverSrc}
                      title={title}
                      author={author}
                      averageRating={averageRating}
                      numberOfRatings={numberOfRatings}
                      className="collection__book"
                    />
                  ))}
                </div>

                {visibleBooks.length === 0 && (
                  <div>
                    There are no books matching the current search criteria
                  </div>
                )}
              </Pagination>
            </>
          )}

          {!loading
            && !errorMessage
            && filteredBooks.length === 0
            && !isUserCollection && (
            <div>There are no books on the server</div>
          )}

          {!loading
            && !errorMessage
            && filteredBooks.length === 0
            && isUserCollection && (
            <div>You don&apos;t have any books yet</div>
          )}

          {errorMessage && <ErrorNotification message={errorMessage} />}
        </div>
      </div>
    </section>
  );
});
