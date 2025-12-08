import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан',
  cancelled: 'Отменён',
  canceled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const getTextStyle = (): string => {
    switch (status) {
      case 'pending':
        return '#E52B1A';
      case 'done':
        return '#00CCCC';
      case 'cancelled':
      case 'canceled':
        return '#F2F2F3';
      default:
        return '#F2F2F3';
    }
  };

  const textStyle = getTextStyle();
  const displayText =
    statusText[status] || statusText[status.toLowerCase()] || 'Создан';

  return <OrderStatusUI textStyle={textStyle} text={displayText} />;
};
