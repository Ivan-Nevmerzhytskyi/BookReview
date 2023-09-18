import React, { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Pagination.scss';
import classNames from 'classnames';
import { BookType } from '../../../../common/types/BookType';
import { getSearchWith, SearchParams } from '../../../../utils/searchHelper';
import { SearchLink } from '../../../../common/components/SearchLink';

type Props = {
  items: BookType[];
  setVisibleItems: (visibleItems: BookType[]) => void;
  children: React.ReactNode;
};

export const Pagination: React.FC<Props> = React.memo(({
  items,
  setVisibleItems,
  children,
}) => {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page') || 1);
  const itemsPerPage = Number(searchParams.get('itemsPerPage') || 5);

  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const startOffset = (currentPage - 1) * itemsPerPage;
  const endOffset = Math.min(currentPage * itemsPerPage, items.length);

  const itemsPerPageRender = useMemo(() => [3, 5, 10, 20], []);
  const pagesRender = useMemo(() => {
    return Array.from({ length: totalPages }, (_x, i) => i + 1);
  }, [totalPages]);

  const setSearchWith = (params: SearchParams) => {
    const search = getSearchWith(params, searchParams);

    setSearchParams(search);
  };

  useEffect(() => {
    // before "BooksSearch" component return some array of books
    if (firstRender.current) {
      firstRender.current = false;

      return;
    }

    if (!itemsPerPageRender.includes(itemsPerPage)) {
      setSearchWith({ itemsPerPage: null });

      return;
    }

    if (currentPage > totalPages) {
      setSearchWith({ page: null });

      return;
    }

    const itemsToDisplay = items.slice(startOffset, endOffset);

    setVisibleItems(itemsToDisplay);
  }, [items, startOffset, endOffset]);

  const handleItemsPerPageSelector = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSearchWith({
      itemsPerPage: event.target.value,
      page: null,
    });
  };

  return (
    <div className="pagination">
      <h3 className="pagination__title">
        {`Page ${currentPage} `}
        {items.length !== 0
          ? `(items ${startOffset + 1} - ${endOffset} of ${items.length})`
          : ''}
      </h3>

      <div className="pagination__content">
        <select
          id="itemsPerPageSelector"
          className="pagination__selector"
          value={itemsPerPage}
          onChange={handleItemsPerPageSelector}
        >
          {itemsPerPageRender.map(itemPerPage => (
            <option
              key={itemPerPage}
              value={itemPerPage}
            >
              {itemPerPage}
            </option>
          ))}
        </select>

        <label
          htmlFor="itemsPerPageSelector"
          className="pagination__label"
        >
          items per page
        </label>
      </div>

      {children}

      <ul className="pagination__list">
        <li className="pagination__item">
          <SearchLink
            params={{ page: currentPage - 1 }}
            className={classNames(
              'pagination__link',
              { 'pagination__link--disabled': isFirstPage },
            )}
            tabIndex={isFirstPage ? -1 : 0}
          >
            «
          </SearchLink>
        </li>

        {pagesRender.map(page => (
          <li
            key={page}
            className="pagination__item"
          >
            <SearchLink
              params={{ page }}
              className={classNames(
                'pagination__link',
                { 'pagination__link--active': currentPage === page },
              )}
            >
              {page}
            </SearchLink>
          </li>
        ))}

        <li className="pagination__item">
          <SearchLink
            params={{ page: currentPage + 1 }}
            className={classNames(
              'pagination__link',
              { 'pagination__link--disabled': isLastPage },
            )}
            tabIndex={isLastPage ? -1 : 0}
          >
            »
          </SearchLink>
        </li>
      </ul>
    </div>
  );
});
