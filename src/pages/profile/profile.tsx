import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { getUserApi, updateUserApi } from '@api';
import { TUser } from '@utils-types';

export const Profile: FC = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateUserError, setUpdateUserError] = useState<string>('');
  const [editingFields, setEditingFields] = useState<{
    name: boolean;
    email: boolean;
    password: boolean;
  }>({
    name: false,
    email: false,
    password: false
  });
  const [userPassword, setUserPassword] = useState<string>('');

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [originalValues, setOriginalValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    getUserApi()
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setFormValue({
            name: data.user.name,
            email: data.user.email,
            password: ''
          });
          setOriginalValues({
            name: data.user.name,
            email: data.user.email,
            password: ''
          });
          setUserPassword('******');
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!(formValue.password && formValue.password.trim() !== '');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateUserError('');

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password && formValue.password.trim() !== '') {
      updateData.password = formValue.password;
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    updateUserApi(updateData)
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setFormValue({
            name: data.user.name,
            email: data.user.email,
            password: ''
          });
          setOriginalValues({
            name: data.user.name,
            email: data.user.email,
            password: ''
          });
          setEditingFields({
            name: false,
            email: false,
            password: false
          });
        }
      })
      .catch((err) => {
        const errorMessage =
          err?.message ||
          err?.error ||
          err?.data?.message ||
          'Ошибка обновления данных';
        setUpdateUserError(errorMessage);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: originalValues.name,
      email: originalValues.email,
      password: ''
    });
    setEditingFields({
      name: false,
      email: false,
      password: false
    });
    setUpdateUserError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleIconClick = (field: 'name' | 'email' | 'password') => {
    if (editingFields[field]) {
      if (field === 'password') {
        setFormValue((prev) => ({ ...prev, password: '' }));
      } else {
        setFormValue((prev) => ({
          ...prev,
          [field]: originalValues[field]
        }));
      }
      setEditingFields((prev) => ({ ...prev, [field]: false }));
    } else {
      setEditingFields((prev) => ({ ...prev, [field]: true }));
      if (field === 'password') {
        setFormValue((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError}
      editingFields={editingFields}
      handleIconClick={handleIconClick}
      userPassword={userPassword}
    />
  );
};
