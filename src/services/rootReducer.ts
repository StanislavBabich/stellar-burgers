import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer, constructorReducer } from './slices';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer
});
