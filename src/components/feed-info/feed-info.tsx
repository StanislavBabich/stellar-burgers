import { FC } from 'react';
import { TOrder, TOrdersData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

type FeedInfoProps = {
  orders: TOrder[];
  feedData: TOrdersData;
};

export const FeedInfo: FC<FeedInfoProps> = ({ orders, feedData }) => {
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedData}
    />
  );
};
