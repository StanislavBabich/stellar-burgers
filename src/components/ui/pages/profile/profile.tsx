import { FC } from 'react';
import clsx from 'clsx';

import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';

import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange,
  editingFields,
  handleIconClick,
  userPassword
}) => {
  const getPasswordDisplayValue = () => {
    if (editingFields.password) {
      return formValue.password;
    }
    return userPassword;
  };

  return (
    <main className={commonStyles.container}>
      <div className={clsx('mt-30', 'mr-15', styles.menu)}>
        <ProfileMenu />
      </div>
      <form
        className={clsx('mt-30', styles.form, commonStyles.form)}
        onSubmit={handleSubmit}
      >
        <>
          <div className={clsx('pb-6', styles.inputWrapper)}>
            <Input
              type={'text'}
              placeholder={'Имя'}
              onChange={handleInputChange}
              value={formValue.name}
              name={'name'}
              error={false}
              errorText={''}
              size={'default'}
              icon={editingFields.name ? 'CloseIcon' : 'EditIcon'}
              readOnly={!editingFields.name}
              onIconClick={() => handleIconClick('name')}
            />
          </div>
          <div className={clsx('pb-6', styles.inputWrapper)}>
            <Input
              type={'email'}
              placeholder={'E-mail'}
              onChange={handleInputChange}
              value={formValue.email}
              name={'email'}
              error={false}
              errorText={''}
              size={'default'}
              icon={editingFields.email ? 'CloseIcon' : 'EditIcon'}
              readOnly={!editingFields.email}
              onIconClick={() => handleIconClick('email')}
            />
          </div>
          <div className={clsx('pb-6', styles.inputWrapper)}>
            <Input
              type={editingFields.password ? 'password' : 'text'}
              placeholder={'Пароль'}
              onChange={handleInputChange}
              value={getPasswordDisplayValue()}
              name={'password'}
              error={false}
              errorText={''}
              size={'default'}
              icon={editingFields.password ? 'CloseIcon' : 'EditIcon'}
              readOnly={!editingFields.password}
              onIconClick={() => handleIconClick('password')}
            />
          </div>
          {isFormChanged && (
            <div className={styles.button}>
              <Button
                type='secondary'
                htmlType='button'
                size='medium'
                onClick={handleCancel}
              >
                Отменить
              </Button>
              <Button type='primary' size='medium' htmlType='submit'>
                Сохранить
              </Button>
            </div>
          )}
          {updateUserError && (
            <p
              className={clsx(
                commonStyles.error,
                'pt-5',
                'text',
                'text_type_main-default'
              )}
            >
              {updateUserError}
            </p>
          )}
        </>
      </form>
    </main>
  );
};
