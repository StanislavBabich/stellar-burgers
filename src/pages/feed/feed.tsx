import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder, TOrdersData } from '@utils-types';
import { FC, useEffect, useState, useRef, useCallback } from 'react';
import { getFeedsApi } from '@api';

const URL = process.env.BURGER_API_URL || '';

export const Feed: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [feedData, setFeedData] = useState<TOrdersData>({
    orders: [],
    total: 0,
    totalToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  const handleGetFeeds = useCallback(() => {
    setIsLoading(true);
    getFeedsApi()
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
          setFeedData({
            orders: data.orders,
            total: data.total || 0,
            totalToday: data.totalToday || 0
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!URL) {
      return;
    }

    handleGetFeeds();

    const wsUrl = URL.replace(/^http/, 'ws') + '/orders/all';

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.success && data.orders) {
            setOrders(data.orders);
            setFeedData({
              orders: data.orders,
              total: data.total || 0,
              totalToday: data.totalToday || 0
            });
          }
        } catch (err) {}
      };

      ws.onerror = () => {};

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          setTimeout(() => {
            if (wsRef.current === null) {
              const reconnectWs = new WebSocket(wsUrl);
              wsRef.current = reconnectWs;
            }
          }, 3000);
        }
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close(1000, 'Component unmounting');
          wsRef.current = null;
        }
      };
    } catch (error) {}
  }, [handleGetFeeds]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      feedData={feedData}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
