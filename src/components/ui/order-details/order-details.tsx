import React from 'react';
import clsx from 'clsx';
import styles from './order-details.module.css';
import doneImg from '../../../images/done.svg';
import { OrderDetailsUIProps } from './type';

export const OrderDetailsUI: React.FC<OrderDetailsUIProps> = ({
  orderNumber
}) => (
  <>
    <h2
      className={clsx(
        styles.title,
        'text',
        'text_type_digits-large',
        'mt-2',
        'mb-4'
      )}
    >
      {orderNumber}
    </h2>
    <p className='text text_type_main-medium'>order ID</p>
    <img className={styles.img} src={doneImg} alt='Order status image' />
    <p className='text text_type_main-default mb-1'>
      We started cooking your order
    </p>
    <p className={clsx(styles.text, 'text', 'text_type_main-default')}>
      Wait for it at the orbital station
    </p>
  </>
);
