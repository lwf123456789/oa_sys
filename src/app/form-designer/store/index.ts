import { configureStore } from '@reduxjs/toolkit';
import formDesignerReducer from './formDesignerSlice';
import { FormDesignerState } from './types';

export const store = configureStore({
  reducer: {
    formDesigner: formDesignerReducer,
  },
});

export type RootState = {
  formDesigner: FormDesignerState;
};

export type AppDispatch = typeof store.dispatch;