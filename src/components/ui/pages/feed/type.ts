import { TOrder, TOrdersData } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[];
  feedData: TOrdersData;
  handleGetFeeds: () => void;
};
