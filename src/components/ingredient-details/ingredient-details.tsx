import { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients } from '@selectors';
import styles from '../ui/ingredient-details/ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);

  const isModal = Boolean(location.state?.background);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  const content = <IngredientDetailsUI ingredientData={ingredientData} />;

  if (isModal) {
    return content;
  }

  return (
    <section className={styles.page}>
      <h1 className={clsx(styles.pageTitle, 'text', 'text_type_main-large')}>
        Детали ингредиента
      </h1>
      {content}
    </section>
  );
};
