jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

import { ingredientsReducer, fetchIngredients } from '../index';
import { initialState } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

// Моковые данные ингредиентов
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice reducer', () => {
  describe('fetchIngredients.pending', () => {
    it('должен установить isLoading в true при начале загрузки', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
      expect(state.hasLoaded).toBe(false);
    });

    it('должен сбросить error при начале новой загрузки', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка',
        isLoading: false
      };
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен сохранить ингредиенты и установить isLoading в false при успешной загрузке', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.hasLoaded).toBe(true);
    });

    it('должен заменить существующие ингредиенты при повторной загрузке', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredients[0]],
        hasLoaded: true
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен установить hasLoaded в true после успешной загрузки', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.hasLoaded).toBe(true);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен установить error и isLoading в false при ошибке загрузки', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
      expect(state.hasLoaded).toBe(true);
    });

    it('должен установить дефолтное сообщение об ошибке, если message отсутствует', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.error).toBe('Ошибка загрузки ингредиентов');
      expect(state.isLoading).toBe(false);
      expect(state.hasLoaded).toBe(true);
    });

    it('должен установить hasLoaded в true даже при ошибке', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка' }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.hasLoaded).toBe(true);
    });
  });

  describe('fetchIngredients thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('должен вызвать getIngredientsApi и вернуть данные', async () => {
      const mockGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
        typeof getIngredientsApi
      >;
      mockGetIngredientsApi.mockResolvedValue(mockIngredients);

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        ingredients: initialState,
        constructor: { bun: null, ingredients: [] }
      }));

      const thunk = fetchIngredients();
      const result = await thunk(dispatch, getState, undefined);

      expect(mockGetIngredientsApi).toHaveBeenCalledTimes(1);
      expect(result.type).toBe(fetchIngredients.fulfilled.type);
      expect(result.payload).toEqual(mockIngredients);
    });
  });
});
