import { configureStore } from '@reduxjs/toolkit';
import authenSlice from 'src/features/authen/authenSlice';
import assessmentSlice from 'src/features/assessment/assessmentSlice';

export const store = configureStore({
  reducer: {
    authenSlice,
    assessmentSlice
  }
});
