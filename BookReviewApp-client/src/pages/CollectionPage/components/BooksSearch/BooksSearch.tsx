import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import './BooksSearch.scss';
import { BookType } from '../../../../common/types/BookType';
import { getSearchWith, SearchParams } from '../../../../utils/searchHelper';

// Decorator to implement delay for function running
// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(f: Function, delay: number) {
  let timerId = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(f, delay, ...args);
  };
}

function handleSearchQuery(string: string, searchQuery: string) {
  return string.toLowerCase().includes(searchQuery.toLowerCase());
}

type Props = {
  books: BookType[];
  onSearchedBooks: (searchedBooks: BookType[]) => void;
};

export const BooksSearch: React.FC<Props> = React.memo(
  ({ books, onSearchedBooks }) => {
    const firstRender = useRef(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [appliedQuery, setAppliedQuery] = useState(
      searchParams.get('query') || '',
    );

    useEffect(() => {
      // before "BooksSortAndGroup" component return some array of books
      if (firstRender.current) {
        firstRender.current = false;

        return;
      }

      const foundBooks = books.filter(book => {
        const { title, author } = book;

        return (
          handleSearchQuery(title, appliedQuery)
          || handleSearchQuery(author, appliedQuery)
        );
      });

      onSearchedBooks(foundBooks);
    }, [books, appliedQuery]);

    // set the search query to the url with additional 'params'
    const setSearchWith = (params: SearchParams) => {
      const search = getSearchWith(params, searchParams);

      setSearchParams(search);
    };

    // set a delay of 1s to defer the book search implementation
    const applyQuery = useCallback(
      debounce(setAppliedQuery, 1000),
      [],
    );

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setSearchWith({ query: value || null });
      applyQuery(value);
    };

    return (
      <div className="booksSearch">
        <label htmlFor="search-query" className="booksSearch__label">
          Search book
        </label>

        <input
          type="search"
          id="search-query"
          name="query"
          className="booksSearch__input form-field"
          placeholder="Type search word"
          value={query}
          onChange={handleQueryChange}
        />
      </div>
    );
  },
);
