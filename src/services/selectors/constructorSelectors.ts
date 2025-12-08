import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectConstructorState = (state: RootState) => state.constructor;

export const selectConstructorItems = createSelector(
  [selectConstructorState],
  (constructor) => {
    if (!constructor) {
      return { bun: null, ingredients: [] };
    }
    return {
      bun: constructor.bun || null,
      ingredients: constructor.ingredients || []
    };
  }
);

export const selectConstructorBun = (state: RootState) => state.constructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.constructor.ingredients;
