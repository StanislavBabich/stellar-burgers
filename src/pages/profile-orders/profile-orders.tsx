import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState, useRef, useCallback } from 'react';
import { getOrdersApi } from '@api';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '@slices';
import { selectIngredientsHasLoaded } from '@selectors';
import { getCookie } from '../../utils/cookie';

const URL = process.env.BURGER_API_URL || '';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const hasLoaded = useSelector(selectIngredientsHasLoaded);
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, hasLoaded]);

  const handleGetOrders = useCallback(() => {
    setIsLoading(true);
    getOrdersApi()
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
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

    handleGetOrders();

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return;
    }

    const wsUrl = URL.replace(/^http/, 'ws') + '/orders';
    const token = accessToken.replace('Bearer ', '');

    try {
      const ws = new WebSocket(`${wsUrl}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.success && data.orders) {
            setOrders(data.orders);
          }
        } catch (err) {}
      };

      ws.onerror = () => {};

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          setTimeout(() => {
            if (wsRef.current === null && getCookie('accessToken')) {
              const reconnectWs = new WebSocket(`${wsUrl}?token=${token}`);
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
  }, [handleGetOrders]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
