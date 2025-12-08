import { FC, memo } from 'react';
import clsx from 'clsx';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, hideCloseButton = false }) => (
    <>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3
            className={clsx(
              styles.title,
              'text',
              'text_type_main-large',
              hideCloseButton && styles.title_centered
            )}
          >
            {title}
          </h3>
          {!hideCloseButton && (
            <button className={styles.button} type='button'>
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlayUI onClick={onClose} />
    </>
  )
);
