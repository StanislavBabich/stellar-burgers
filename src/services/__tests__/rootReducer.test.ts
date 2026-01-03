import { rootReducer } from '../rootReducer';
import { initialState as constructorInitialState } from '../slices/constructorSlice';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { selectConstructorItems } from '../selectors/constructorSelectors';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined состоянием', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state.ingredients).toEqual(ingredientsInitialState);

    const ownPropertyNames = Object.getOwnPropertyNames(state);
    expect(ownPropertyNames).toContain('constructor');

    const descriptor = Object.getOwnPropertyDescriptor(state, 'constructor');

    expect(descriptor).toBeDefined();
    expect(descriptor?.value).toBeDefined();

    if (
      descriptor?.value &&
      typeof descriptor.value === 'object' &&
      descriptor.value !== null &&
      !Array.isArray(descriptor.value)
    ) {
      const constructorState =
        descriptor.value as typeof constructorInitialState;
      expect(constructorState.bun).toBeNull();
      expect(Array.isArray(constructorState.ingredients)).toBe(true);
      expect(constructorState.ingredients).toHaveLength(0);
    } else {
      const constructorItems = selectConstructorItems(state as any);
      expect(constructorItems.bun).toBeNull();
      expect(Array.isArray(constructorItems.ingredients)).toBe(true);
      expect(constructorItems.ingredients).toHaveLength(0);
    }
  });

  it('должен возвращать корректное начальное состояние при вызове с неизвестным экшеном', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const initialState = {
      ingredients: ingredientsInitialState,
      constructor: constructorInitialState
    };

    const state = rootReducer(initialState, unknownAction);

    expect(state).toEqual(initialState);
  });
});
