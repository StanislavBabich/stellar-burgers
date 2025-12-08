import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { setCookie, getCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    loginUserApi({ email, password })
      .then((data) => {
        if (data.success && data.accessToken && data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
          setCookie('accessToken', data.accessToken);
          const from = (location.state as { from?: { pathname: string } })?.from
            ?.pathname;
          navigate(from || '/', { replace: true });
        }
      })
      .catch((err) => {
        let errorMessage = 'email or password are incorrect';
        if (err?.message) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else if (err?.error) {
          errorMessage = err.error;
        } else if (err?.data?.message) {
          errorMessage = err.data.message;
        } else if (err?.response?.message) {
          errorMessage = err.response.message;
        }
        setErrorText(errorMessage);
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
