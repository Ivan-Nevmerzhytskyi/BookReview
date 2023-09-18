import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import './BooksSortAndGroup.scss';
import { BookType } from '../../../../common/types/BookType';
import { SearchLink } from '../../../../common/components/SearchLink';

enum BooksGroup {
  NONE = 'none',
  REVIEWS = 'reviews',
}

enum BooksSort {
  NONE = 'none',
  TITLE = 'title',
  RATING = 'rating',
}

type ReorderOptions = {
  group: BooksGroup;
  sort: BooksSort;
  isReversed: boolean;
};

function isOfEnumType(
  value: string | null,
  enumType: { [s: string]: string },
) {
  if (!value) {
    return false;
  }

  return Object.values(enumType).includes(value);
}

function getReorderedBooks(
  books: BookType[],
  { group, sort, isReversed }: ReorderOptions,
) {
  let visibleBooks = [...books];

  if (group !== BooksGroup.NONE) {
    visibleBooks = visibleBooks.filter((book) => {
      switch (group) {
        case BooksGroup.REVIEWS:
          return book.numberOfRatings > 0;

        default:
          return true;
      }
    });
  }

  if (sort !== BooksSort.NONE) {
    visibleBooks.sort((book1, book2) => {
      switch (sort) {
        case BooksSort.TITLE:
          return book1.title.localeCompare(book2.title);

        case BooksSort.RATING: {
          return book2.averageRating - book1.averageRating;
        }

        default:
          return 0;
      }
    });
  }

  if (isReversed) {
    visibleBooks.reverse();
  }

  return visibleBooks;
}

type Props = {
  books: BookType[];
  onSortedAndGroupedBooks: (sortedAndGroupedBooks: BookType[]) => void;
};

export const BooksSortAndGroup: React.FC<Props> = React.memo(
  ({ books, onSortedAndGroupedBooks }) => {
    const [searchParams] = useSearchParams();
    const group = isOfEnumType(searchParams.get('groupBy'), BooksGroup)
      ? searchParams.get('groupBy') as BooksGroup
      : BooksGroup.NONE;
    const sort = isOfEnumType(searchParams.get('sortBy'), BooksSort)
      ? searchParams.get('sortBy') as BooksSort
      : BooksSort.NONE;
    const isReversed = (searchParams.get('isReversed') === 'true') || false;
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
      const reorderedBooks = getReorderedBooks(books, {
        group,
        sort,
        isReversed,
      });

      onSortedAndGroupedBooks(reorderedBooks);
    }, [books, group, sort, isReversed]);

    useEffect(() => {
      if (!isExpanded) {
        return;
      }

      const handleDocumentClick = () => {
        setIsExpanded(false);
      };

      document.addEventListener('click', handleDocumentClick);

      // eslint-disable-next-line consistent-return
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, [isExpanded]);

    const handleDropdownTrigger = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.stopPropagation();
      setIsExpanded(current => !current);
    };

    return (
      <div className="booksSortAndGroup">
        <div className="booksSortAndGroup__sort-by">
          <button
            type="button"
            className={classNames('booksSortAndGroup__trigger', {
              'booksSortAndGroup__trigger--active': sort !== BooksSort.NONE,
            })}
            onClick={handleDropdownTrigger}
          >
            Sort by:
            {sort !== BooksSort.NONE && ` ${sort}`}
          </button>

          <div
            className={classNames('booksSortAndGroup__dropdown-content', {
              'booksSortAndGroup__dropdown-content--visible': isExpanded,
            })}
          >
            <SearchLink
              params={{ sortBy: BooksSort.TITLE }}
              className="booksSortAndGroup__dropdown-element"
              tabIndex={isExpanded ? 0 : -1}
            >
              title
            </SearchLink>

            <SearchLink
              params={{ sortBy: BooksSort.RATING }}
              className="booksSortAndGroup__dropdown-element"
              tabIndex={isExpanded ? 0 : -1}
            >
              rating
            </SearchLink>
          </div>
        </div>

        <div className="booksSortAndGroup__group-by">
          <SearchLink
            params={{
              groupBy: group === BooksGroup.NONE ? BooksGroup.REVIEWS : null,
            }}
            className={classNames('booksSortAndGroup__trigger', {
              'booksSortAndGroup__trigger--active':
                group === BooksGroup.REVIEWS,
            })}
          >
            with reviews
          </SearchLink>
        </div>

        <SearchLink
          params={{ isReversed: !isReversed || null }}
          className={classNames('booksSortAndGroup__trigger', {
            'booksSortAndGroup__trigger--active': isReversed,
          })}
        >
          reverse
        </SearchLink>

        {(group !== BooksGroup.NONE
          || sort !== BooksSort.NONE
          || isReversed) && (
          <SearchLink
            params={{
              isReversed: null,
              groupBy: null,
              sortBy: null,
            }}
            className="booksSortAndGroup__trigger"
          >
            reset
          </SearchLink>
        )}
      </div>
    );
  },
);
