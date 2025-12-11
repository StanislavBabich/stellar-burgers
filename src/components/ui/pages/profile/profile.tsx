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
  handleInputFocus,
  handleInputBlur,
  isFieldChanged,
  userPassword
}) => {
  const getPasswordDisplayValue = () => {
    if (editingFields.password) {
      return formValue.password;
    }
    return userPassword;
  };

  const getIcon = (field: 'name' | 'email' | 'password') => {
    if (editingFields[field] && isFieldChanged(field)) {
      return 'CloseIcon';
    }
    return 'EditIcon';
  };

  const handleWrapperMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    field: 'name' | 'email' | 'password'
  ) => {
    const target = e.target as HTMLElement;
    const wrapper = e.currentTarget;
    const input = wrapper.querySelector('input') as HTMLInputElement;

    if (!input) return;

    const isInputClick = target === input || input.contains(target);
    const isSvgClick = target.closest('svg') !== null;
    const isButtonClick = target.closest('button') !== null;
    const isIconAreaClick = !isInputClick && (isSvgClick || isButtonClick);

    const inputRect = input.getBoundingClientRect();
    const clickX = e.clientX;
    const isClickInRightArea = clickX > inputRect.right - 50;

    if (
      (isIconAreaClick || isClickInRightArea) &&
      editingFields[field] &&
      isFieldChanged(field)
    ) {
      e.preventDefault();
      e.stopPropagation();
      handleIconClick(field);
    }
  };

  const handleWrapperClick = (
    e: React.MouseEvent<HTMLDivElement>,
    field: 'name' | 'email' | 'password'
  ) => {
    const target = e.target as HTMLElement;
    const wrapper = e.currentTarget;
    const input = wrapper.querySelector('input') as HTMLInputElement;

    if (!input) return;

    const isInputClick = target === input || input.contains(target);
    const isSvgClick = target.closest('svg') !== null;
    const isButtonClick = target.closest('button') !== null;
    const isIconAreaClick = !isInputClick && (isSvgClick || isButtonClick);

    const inputRect = input.getBoundingClientRect();
    const clickX = e.clientX;
    const isClickInRightArea = clickX > inputRect.right - 50;

    if (!editingFields[field] && !isIconAreaClick && !isClickInRightArea) {
      handleInputFocus(field);
    }
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
          <div
            className={clsx('pb-6', styles.inputWrapper)}
            onClick={(e) => handleWrapperClick(e, 'name')}
            onMouseDown={(e) => handleWrapperMouseDown(e, 'name')}
          >
            <Input
              type={'text'}
              placeholder={'Имя'}
              onChange={handleInputChange}
              value={formValue.name}
              name={'name'}
              error={false}
              errorText={''}
              size={'default'}
              icon={getIcon('name')}
              readOnly={!editingFields.name}
              onFocus={() => handleInputFocus('name')}
              onBlur={() => handleInputBlur('name')}
            />
          </div>
          <div
            className={clsx('pb-6', styles.inputWrapper)}
            onClick={(e) => handleWrapperClick(e, 'email')}
            onMouseDown={(e) => handleWrapperMouseDown(e, 'email')}
          >
            <Input
              type={'email'}
              placeholder={'E-mail'}
              onChange={handleInputChange}
              value={formValue.email}
              name={'email'}
              error={false}
              errorText={''}
              size={'default'}
              icon={getIcon('email')}
              readOnly={!editingFields.email}
              onFocus={() => handleInputFocus('email')}
              onBlur={() => handleInputBlur('email')}
            />
          </div>
          <div
            className={clsx('pb-6', styles.inputWrapper)}
            onClick={(e) => handleWrapperClick(e, 'password')}
            onMouseDown={(e) => handleWrapperMouseDown(e, 'password')}
          >
            <Input
              type={editingFields.password ? 'password' : 'text'}
              placeholder={'Пароль'}
              onChange={handleInputChange}
              value={getPasswordDisplayValue()}
              name={'password'}
              error={false}
              errorText={''}
              size={'default'}
              icon={getIcon('password')}
              readOnly={!editingFields.password}
              onFocus={() => handleInputFocus('password')}
              onBlur={() => handleInputBlur('password')}
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
