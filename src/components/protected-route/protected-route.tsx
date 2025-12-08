import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

type TProtectedRouteProps = {
  element: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ element }) => {
  const location = useLocation();
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const isAuth = !!(accessToken && refreshToken);

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
