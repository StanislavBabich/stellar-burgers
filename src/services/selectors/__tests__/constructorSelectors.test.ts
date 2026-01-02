import { selectConstructorItems, selectConstructorBun, selectConstructorIngredients } from '../constructorSelectors';
import { RootState } from '../../store';
import { initialState as constructorInitialState } from '../../slices/constructorSlice';
import { initialState as ingredientsInitialState } from '../../slices/ingredientsSlice';

describe('constructorSelectors', () => {
  describe('selectConstructorItems', () => {
    it('должен вернуть начальное состояние, если constructor не определен', () => {
      const state: RootState = {
        ingredients: ingredientsInitialState,
        constructor: null as any
      };

      const result = selectConstructorItems(state);

      expect(result).toEqual({ bun: null, ingredients: [] });
    });

    it('должен вернуть элементы конструктора, если constructor определен', () => {
      const state: RootState = {
        ingredients: ingredientsInitialState,
        constructor: constructorInitialState
      };

      const result = selectConstructorItems(state);

      expect(result).toEqual({
        bun: null,
        ingredients: []
      });
    });

    it('должен вернуть элементы конструктора с булкой и начинками', () => {
      const constructorState = {
        bun: {
          _id: 'bun-id',
          name: 'Булка',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 100,
          price: 100,
          image: 'image.png',
          image_mobile: 'image-mobile.png',
          image_large: 'image-large.png',
          id: 'bun-unique-id'
        },
        ingredients: [
          {
            _id: 'main-id',
            name: 'Начинка',
            type: 'main',
            proteins: 20,
            fat: 10,
            carbohydrates: 30,
            calories: 200,
            price: 200,
            image: 'image.png',
            image_mobile: 'image-mobile.png',
            image_large: 'image-large.png',
            id: 'main-unique-id'
          }
        ]
      };

      const state: RootState = {
        ingredients: ingredientsInitialState,
        constructor: constructorState
      };

      const result = selectConstructorItems(state);

      expect(result.bun).toEqual(constructorState.bun);
      expect(result.ingredients).toEqual(constructorState.ingredients);
    });

    it('должен вернуть пустой массив ingredients, если constructor.ingredients undefined', () => {
      const constructorState = {
        bun: null,
        ingredients: undefined as any
      };

      const state: RootState = {
        ingredients: ingredientsInitialState,
        constructor: constructorState
      };

      const result = selectConstructorItems(state);

      expect(result.ingredients).toEqual([]);
    });
  });

  describe('selectConstructorBun', () => {
    it('должен вернуть булку из состояния конструктора', () => {
      const bun = {
        _id: 'bun-id',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 100,
        price: 100,
        image: 'image.png',
        image_mobile: 'image-mobile.png',
        image_large: 'image-large.png',
        id: 'bun-unique-id'
      };

      const state: RootState = {
        ingredients: ingredientsInitialState,
        constructor: {
          bun,
          ingredients: []
        }
      };

      const result = selectConstructorBun(state);

      expect(result).toEqual(bun);
    });
  });

  describe('selectConstructorIngredients', () => {
    it('должен вернуть массив ингредиентов из состояния конструктора', () => {
      const ingredients = [
        {
          _id: 'main-id',
          name: 'Начинка',
          type: 'main',
          proteins: 20,
          fat: 10,
          carbohydrates: 30,
          calories: 200,
          price: 200,
          image: 'image.png',
          image_mobile: 'image-mobile.png',
          image_large: 'image-large.png',
          id: 'main-unique-id'
        }
      ];

      const state: RootState = {
        ingredients: ingredientsInitialState,
        constructor: {
          bun: null,
          ingredients
        }
      };

      const result = selectConstructorIngredients(state);

      expect(result).toEqual(ingredients);
    });
  });
});
