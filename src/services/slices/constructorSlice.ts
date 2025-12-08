import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = {
          ...ingredient,
          id: uuidv4()
        };
      } else {
        if (!state.ingredients || !Array.isArray(state.ingredients)) {
          state.ingredients = [];
        }
        state.ingredients.push({
          ...ingredient,
          id: uuidv4()
        });
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      } else {
        state.ingredients = state.ingredients.filter(
          (item) => item.id !== action.payload
        );
      }
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      } else {
        const { fromIndex, toIndex } = action.payload;
        if (
          fromIndex >= 0 &&
          fromIndex < state.ingredients.length &&
          toIndex >= 0 &&
          toIndex < state.ingredients.length &&
          fromIndex !== toIndex
        ) {
          const item = state.ingredients[fromIndex];
          state.ingredients.splice(fromIndex, 1);
          state.ingredients.splice(toIndex, 0, item);
        }
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
