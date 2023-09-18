import React, {
  useRef, useState, useContext, useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBook.scss';
import { BookType } from '../../common/types/BookType';
import { AuthContext } from '../../store/AuthContext';
import * as booksActions from '../../store/features/books';
import { useAppDispatch } from '../../customHooks/reduxHooks';

import { Loader } from '../../common/components/Loader';
import { ErrorNotification } from '../../common/components/ErrorNotification';

function validation(input: string) {
  return input.trim() !== '';
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(reader.error?.name);
    };
  });
}

export const AddBookPage: React.FC = React.memo(() => {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookCoverFiles, setBookCoverFiles] = useState<File[]>([]);
  const [bookCoversBase64, setBookCoversBase64] = useState<string[]>([]);
  const [isTitleError, setIsTitleError] = useState(false);
  const [isAuthorError, setIsAuthorError] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { user } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookCoverFiles.length) {
      setBookCoversBase64([]);

      return;
    }

    const readers: Promise<string>[] = [];

    bookCoverFiles.forEach(bookCoverFile => {
      readers.push(readFileAsBase64(bookCoverFile));
    });

    Promise.all(readers).then(setBookCoversBase64);
  }, [bookCoverFiles]);

  const isSubmitDisabled = (
    !validation(bookTitle)
    || !validation(bookAuthor)
    || !validation(bookDescription)
    || bookCoversBase64.length === 0
    || adding
  );

  const clearForm = () => {
    setBookTitle('');
    setBookAuthor('');
    setBookDescription('');
    setBookCoverFiles([]);
    setBookCoversBase64([]);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage('Please authorize before adding a book');

      return;
    }

    setAdding(true);
    setErrorMessage('');

    const newBook: Omit<BookType, 'id'> = {
      userId: user.id,
      coverSrc: bookCoversBase64,
      title: bookTitle,
      author: bookAuthor,
      description: bookDescription,
      averageRating: 0,
      numberOfRatings: 0,
    };

    dispatch(booksActions.addBook(newBook)).unwrap()
      .then(() => {
        clearForm();
        // event.currentTarget.reset();

        navigate('..');
      })
      .catch(() => {
        setErrorMessage('Unable to add a book');
      })
      .finally(() => {
        setAdding(false);
      });
  };

  const addBookTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookTitle(event.target.value);
    setIsTitleError(false);
  };

  const handleTitleBlur = () => {
    setIsTitleError(!validation(bookTitle));
  };

  const addBookAuthor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookAuthor(event.target.value);
    setIsAuthorError(false);
  };

  const handleAuthorBlur = () => {
    setIsAuthorError(!validation(bookAuthor));
  };

  const addBookDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setBookDescription(event.target.value);
    setIsDescriptionError(false);
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionError(!validation(bookDescription));
  };

  const addBookCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? [...event.target.files] : [];

    setBookCoverFiles(files);
  };

  return (
    <section className="addBook">
      <div className="container">
        <h2 className="section-title">Add Book</h2>

        <div className="addBook__content">
          <form
            action="/#"
            method="POST"
            className="addBook__form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="addBookTitle" className="addBook__label">
              Book title:
            </label>
            {isTitleError && (
              <span className="addBook__error">Title is required</span>
            )}
            <input
              name="bookTitle"
              id="addBookTitle"
              type="text"
              required
              placeholder="Enter a book title"
              className="addBook__field form-field"
              value={bookTitle}
              onChange={addBookTitle}
              onBlur={handleTitleBlur}
            />

            <label htmlFor="addBookAuthor" className="addBook__label">
              Book author:
            </label>
            {isAuthorError && (
              <span className="addBook__error">Author is required</span>
            )}
            <input
              name="bookAuthor"
              id="addBookAuthor"
              type="text"
              required
              placeholder="Enter a book author"
              className="addBook__field form-field"
              value={bookAuthor}
              onChange={addBookAuthor}
              onBlur={handleAuthorBlur}
            />

            <label htmlFor="addBookDescription" className="addBook__label">
              Book description:
            </label>
            {isDescriptionError && (
              <span className="addBook__error">Description is required</span>
            )}
            <textarea
              name="bookDescription"
              id="addBookDescription"
              required
              placeholder="Enter a book description"
              className="addBook__field form-field form-field--textarea"
              value={bookDescription}
              onChange={addBookDescription}
              onBlur={handleDescriptionBlur}
            />

            <label htmlFor="addBookCover" className="addBook__label">
              {bookCoverFiles.length ? (
                `Book covers:
                - ${bookCoverFiles
                  .map((bookCover) => bookCover.name)
                  .join('\n- ')}
                `
              ) : (
                <>
                  Click to select book covers:
                  <strong> no file chosen</strong>
                </>
              )}
            </label>
            <input
              name="bookCover"
              id="addBookCover"
              type="file"
              required
              multiple
              accept="image/png, image/jpeg"
              className="addBook__field addBook__field--file"
              onChange={addBookCover}
              ref={inputFileRef}
            />

            <button
              className="addBook__button button"
              type="submit"
              disabled={isSubmitDisabled}
            >
              {adding ? <Loader /> : 'Add book'}
            </button>
          </form>
        </div>

        {errorMessage && <ErrorNotification message={errorMessage} />}
      </div>
    </section>
  );
});
