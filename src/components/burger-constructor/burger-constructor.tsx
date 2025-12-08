import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { selectConstructorItems } from '@selectors';
import { clearConstructor } from '@slices';
import { orderBurgerApi } from '@api';
import { getCookie } from '../../utils/cookie';
import { TOrder } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectConstructorItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const ingredientsIds: string[] = [];
    if (constructorItems.bun) {
      ingredientsIds.push(constructorItems.bun._id);
    }
    if (
      constructorItems.ingredients &&
      Array.isArray(constructorItems.ingredients)
    ) {
      constructorItems.ingredients.forEach((ingredient) => {
        ingredientsIds.push(ingredient._id);
      });
    }
    if (constructorItems.bun) {
      ingredientsIds.push(constructorItems.bun._id);
    }

    setOrderRequest(true);
    orderBurgerApi(ingredientsIds)
      .then((data) => {
        if (data.success && data.order) {
          setOrderModalData(data.order);
          dispatch(clearConstructor());
        }
      })
      .catch(() => {})
      .finally(() => {
        setOrderRequest(false);
      });
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients &&
      Array.isArray(constructorItems.ingredients)
        ? constructorItems.ingredients.reduce((s: number, v) => s + v.price, 0)
        : 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
