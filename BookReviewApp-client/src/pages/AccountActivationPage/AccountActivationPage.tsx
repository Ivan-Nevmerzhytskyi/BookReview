import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AccountActivation.scss';
import { AuthContext } from '../../store/AuthContext';
import { Loader } from '../../common/components/Loader';

export const AccountActivationPage: React.FC = React.memo(() => {
  const [errorMessage, setErrorMessage] = useState('');
  const [done, setDone] = useState(false);

  const { activate } = useContext(AuthContext);
  const { activationToken } = useParams();

  useEffect(() => {
    activate(activationToken as string)
      .catch(error => {
        setErrorMessage(
          error.response?.data?.message
          || 'Wrong activation link',
        );
      })
      .finally(() => {
        setDone(true);
      });
  }, []);

  if (!done) {
    return (
      <section className="accountActivation">
        <Loader />
      </section>
    );
  }

  return (
    <section className="accountActivation">
      <div className="container">
        <h1 className="section-title">Account activation</h1>

        {errorMessage ? (
          <p
            className={`
              accountActivation__notification
              accountActivation__notification--is-error
            `}
          >
            {errorMessage}
          </p>
        ) : (
          <p
            className={`
              accountActivation__notification
              accountActivation__notification--is-success
            `}
          >
            Your account is now active
          </p>
        )}
      </div>
    </section>
  );
});
