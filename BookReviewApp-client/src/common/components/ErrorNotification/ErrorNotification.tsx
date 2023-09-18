import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './ErrorNotification.scss';

type Props = {
  message: string,
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  message,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  function handleError(error: string) {
    setErrorMessage(error);

    if (!error) {
      return;
    }

    setTimeout(() => setErrorMessage(''), 5000);
  }

  useEffect(() => {
    handleError(message);
  }, [message]);

  return (
    <div
      className={classNames(
        'errorNotification',
        { 'errorNotification--hidden': !errorMessage },
      )}
    >
      <button
        type="button"
        disabled={!errorMessage}
        className="errorNotification__hideError"
        aria-label="Hide Error Notification"
        onClick={() => handleError('')}
      >
        X
      </button>

      {errorMessage}
    </div>
  );
});
