import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutApi()
      .then(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        navigate('/login');
      })
      .catch(() => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        navigate('/login');
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
