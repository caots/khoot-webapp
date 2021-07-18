import { configureStore } from '@reduxjs/toolkit';
import authenSlice from 'src/features/authen/authenSlide';
import assessmentSlice from 'src/features/assessment/assessmentSlide';

export const store = configureStore({
  reducer: {
    authenSlice,
    assessmentSlice
  }
});
