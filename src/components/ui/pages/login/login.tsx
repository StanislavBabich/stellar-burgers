import { FC, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { LoginUIProps } from './type';

export const LoginUI: FC<LoginUIProps> = ({
  email,
  setEmail,
  errorText,
  handleSubmit,
  password,
  setPassword
}) => (
  <main className={styles.container}>
    <div className={clsx('pt-6', styles.wrapCenter)}>
      <h3 className='pb-6 text text_type_main-medium'>Sign in</h3>
      <form
        className={clsx('pb-15', styles.form)}
        name='login'
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='E-mail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name='email'
              error={false}
              errorText=''
              size='default'
            />
          </div>
          <div className='pb-6'>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name='password'
              placeholder='Password'
              errorText='Invalid password'
            />
          </div>
          <div className={clsx('pb-6', styles.button)}>
            <Button type='primary' size='medium' htmlType='submit'>
              Sign in
            </Button>
          </div>
          {errorText && (
            <p
              className={clsx(
                styles.error,
                'text',
                'text_type_main-default',
                'pb-6'
              )}
            >
              {errorText}
            </p>
          )}
        </>
      </form>
      <div
        className={clsx(
          'pb-4',
          styles.question,
          'text',
          'text_type_main-default'
        )}
      >
        New user?
        <Link to='/register' className={clsx('pl-2', styles.link)}>
          Sign up
        </Link>
      </div>
      <div
        className={clsx(
          styles.question,
          'text',
          'text_type_main-default',
          'pb-6'
        )}
      >
        Forgot your password?
        <Link to={'/forgot-password'} className={clsx('pl-2', styles.link)}>
          Recover password
        </Link>
      </div>
    </div>
  </main>
);
