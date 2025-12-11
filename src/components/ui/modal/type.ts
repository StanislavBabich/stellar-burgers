import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
  hideCloseButton?: boolean;
  className?: string;
};
