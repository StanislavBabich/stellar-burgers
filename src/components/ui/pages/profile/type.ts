import { ChangeEvent, SyntheticEvent } from 'react';

export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
  handleCancel: (e: SyntheticEvent) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  updateUserError?: string;
  editingFields: {
    name: boolean;
    email: boolean;
    password: boolean;
  };
  handleIconClick: (field: 'name' | 'email' | 'password') => void;
  handleInputFocus: (field: 'name' | 'email' | 'password') => void;
  handleInputBlur: (field: 'name' | 'email' | 'password') => void;
  isFieldChanged: (field: 'name' | 'email' | 'password') => boolean;
  userPassword: string;
};
