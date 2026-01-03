import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../index';
import { initialState } from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructorSlice reducer', () => {
  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeDefined();
      expect(state.bun?._id).toBe(mockBun._id);
      expect(state.bun?.name).toBe(mockBun.name);
      expect(state.bun?.type).toBe('bun');
      expect(state.bun?.id).toBeDefined();
      expect(state.ingredients).toEqual([]);
    });

    it('должен заменить булку при добавлении новой булки', () => {
      const firstBunAction = addIngredient(mockBun);
      const stateWithFirstBun = constructorReducer(initialState, firstBunAction);

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const secondBunAction = addIngredient(newBun);
      const stateWithSecondBun = constructorReducer(
        stateWithFirstBun,
        secondBunAction
      );

      expect(stateWithSecondBun.bun?._id).toBe(newBun._id);
      expect(stateWithSecondBun.bun?.name).toBe('Новая булка');
    });

    it('должен добавить начинку в массив ингредиентов', () => {
      const action = addIngredient(mockMain);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[0].name).toBe(mockMain.name);
      expect(state.ingredients[0].type).toBe('main');
      expect(state.ingredients[0].id).toBeDefined();
    });

    it('должен добавить соус в массив ингредиентов', () => {
      const action = addIngredient(mockSauce);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.ingredients[0].name).toBe(mockSauce.name);
      expect(state.ingredients[0].type).toBe('sauce');
      expect(state.ingredients[0].id).toBeDefined();
    });

    it('должен добавить несколько начинок в конструктор', () => {
      const firstMainAction = addIngredient(mockMain);
      const stateWithFirstMain = constructorReducer(initialState, firstMainAction);

      const secondMainAction = addIngredient(mockSauce);
      const stateWithBothMains = constructorReducer(
        stateWithFirstMain,
        secondMainAction
      );

      expect(stateWithBothMains.ingredients).toHaveLength(2);
      expect(stateWithBothMains.ingredients[0]._id).toBe(mockMain._id);
      expect(stateWithBothMains.ingredients[1]._id).toBe(mockSauce._id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      // Добавляем несколько ингредиентов
      const addMainAction = addIngredient(mockMain);
      const stateWithMain = constructorReducer(initialState, addMainAction);

      const addSauceAction = addIngredient(mockSauce);
      const stateWithBoth = constructorReducer(stateWithMain, addSauceAction);

      expect(stateWithBoth.ingredients).toHaveLength(2);

      // Удаляем первый ингредиент
      const ingredientIdToRemove = stateWithBoth.ingredients[0].id;
      const removeAction = removeIngredient(ingredientIdToRemove);
      const stateAfterRemove = constructorReducer(stateWithBoth, removeAction);

      expect(stateAfterRemove.ingredients).toHaveLength(1);
      expect(stateAfterRemove.ingredients[0]._id).toBe(mockSauce._id);
    });

    it('не должен удалить ингредиент, если id не найден', () => {
      const addMainAction = addIngredient(mockMain);
      const stateWithMain = constructorReducer(initialState, addMainAction);

      const removeAction = removeIngredient('non-existent-id');
      const stateAfterRemove = constructorReducer(stateWithMain, removeAction);

      expect(stateAfterRemove.ingredients).toHaveLength(1);
      expect(stateAfterRemove.ingredients[0]._id).toBe(mockMain._id);
    });

    it('не должен изменить состояние, если массив ингредиентов пуст', () => {
      const removeAction = removeIngredient('some-id');
      const stateAfterRemove = constructorReducer(initialState, removeAction);

      expect(stateAfterRemove).toEqual(initialState);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент с одного индекса на другой', () => {
      // Добавляем три ингредиента
      const addMain1Action = addIngredient(mockMain);
      const state1 = constructorReducer(initialState, addMain1Action);

      const addSauceAction = addIngredient(mockSauce);
      const state2 = constructorReducer(state1, addSauceAction);

      const addMain2Action = addIngredient({
        ...mockMain,
        _id: 'another-main-id'
      });
      const state3 = constructorReducer(state2, addMain2Action);

      expect(state3.ingredients).toHaveLength(3);
      const firstIngredientId = state3.ingredients[0].id;
      const secondIngredientId = state3.ingredients[1].id;

      // Перемещаем первый ингредиент на позицию 2
      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const stateAfterMove = constructorReducer(state3, moveAction);

      expect(stateAfterMove.ingredients).toHaveLength(3);
      expect(stateAfterMove.ingredients[2].id).toBe(firstIngredientId);
      expect(stateAfterMove.ingredients[0].id).toBe(secondIngredientId);
    });

    it('должен переместить ингредиент вверх (уменьшить индекс)', () => {
      // Добавляем два ингредиента
      const addMainAction = addIngredient(mockMain);
      const state1 = constructorReducer(initialState, addMainAction);

      const addSauceAction = addIngredient(mockSauce);
      const state2 = constructorReducer(state1, addSauceAction);

      const secondIngredientId = state2.ingredients[1].id;

      // Перемещаем второй ингредиент на первую позицию
      const moveAction = moveIngredient({ fromIndex: 1, toIndex: 0 });
      const stateAfterMove = constructorReducer(state2, moveAction);

      expect(stateAfterMove.ingredients[0].id).toBe(secondIngredientId);
    });

    it('должен переместить ингредиент вниз (увеличить индекс)', () => {
      // Добавляем два ингредиента
      const addMainAction = addIngredient(mockMain);
      const state1 = constructorReducer(initialState, addMainAction);

      const addSauceAction = addIngredient(mockSauce);
      const state2 = constructorReducer(state1, addSauceAction);

      const firstIngredientId = state2.ingredients[0].id;

      // Перемещаем первый ингредиент на вторую позицию
      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
      const stateAfterMove = constructorReducer(state2, moveAction);

      expect(stateAfterMove.ingredients[1].id).toBe(firstIngredientId);
    });

    it('не должен изменить порядок, если fromIndex равен toIndex', () => {
      const addMainAction = addIngredient(mockMain);
      const state1 = constructorReducer(initialState, addMainAction);

      const addSauceAction = addIngredient(mockSauce);
      const state2 = constructorReducer(state1, addSauceAction);

      const originalOrder = state2.ingredients.map((ing: TConstructorIngredient) => ing.id);

      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 0 });
      const stateAfterMove = constructorReducer(state2, moveAction);

      expect(stateAfterMove.ingredients.map((ing: TConstructorIngredient) => ing.id)).toEqual(
        originalOrder
      );
    });

    it('не должен изменить порядок, если индексы выходят за границы массива', () => {
      const addMainAction = addIngredient(mockMain);
      const state1 = constructorReducer(initialState, addMainAction);

      const moveAction1 = moveIngredient({ fromIndex: -1, toIndex: 0 });
      const stateAfterMove1 = constructorReducer(state1, moveAction1);
      expect(stateAfterMove1.ingredients).toEqual(state1.ingredients);

      const moveAction2 = moveIngredient({ fromIndex: 0, toIndex: 10 });
      const stateAfterMove2 = constructorReducer(state1, moveAction2);
      expect(stateAfterMove2.ingredients).toEqual(state1.ingredients);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор (установить bun в null и очистить массив ingredients)', () => {
      // Добавляем булку и начинки
      const addBunAction = addIngredient(mockBun);
      const stateWithBun = constructorReducer(initialState, addBunAction);

      const addMainAction = addIngredient(mockMain);
      const stateWithIngredients = constructorReducer(stateWithBun, addMainAction);

      const addSauceAction = addIngredient(mockSauce);
      const stateWithAll = constructorReducer(stateWithIngredients, addSauceAction);

      expect(stateWithAll.bun).not.toBeNull();
      expect(stateWithAll.ingredients).toHaveLength(2);

      // Очищаем конструктор
      const clearAction = clearConstructor();
      const stateAfterClear = constructorReducer(stateWithAll, clearAction);

      expect(stateAfterClear.bun).toBeNull();
      expect(stateAfterClear.ingredients).toHaveLength(0);
    });

    it('должен очистить конструктор даже если он уже пуст', () => {
      const clearAction = clearConstructor();
      const stateAfterClear = constructorReducer(initialState, clearAction);

      expect(stateAfterClear.bun).toBeNull();
      expect(stateAfterClear.ingredients).toHaveLength(0);
      expect(stateAfterClear).toEqual(initialState);
    });
  });
});
