import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import './RequireAuth.scss';
import { AuthContext } from '../../../store/AuthContext';
import { Loader } from '../../../common/components/Loader';

export const RequireAuth: React.FC = () => {
  const { isChecked, user } = useContext(AuthContext);
  const { pathname } = useLocation();

  if (!isChecked) {
    return (
      <section className="requireAuth">
        <Loader />
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ pathname }} replace />;
  }

  return <Outlet />;
};
