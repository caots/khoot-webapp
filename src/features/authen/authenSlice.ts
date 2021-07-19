import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authenApi from './authenApi';
import { MESSAGES } from 'src/config/message';
import { deleteToken, getToken, saveToken } from 'src/utils/authService';
import User from 'src/model/user';
import { STORAGE_KEY } from 'src/config';

const initialState = {
  isAuth: false,
  userData: null,

  // state for get user info
  isFetchingUserData: false,
  fetchUserDataMsg: null,

  // state for login reducer
  isFetchingLogin: false,
  fetchLoginMsg: null,

  // state for register reducer
  isFetchingRegister: false,
  fetchRegisterMsg: null,

  // state for changePassword reducer
  isFetchingChangePassword: false,
  fetchChangePasswordMsg: null,

  // state for update info reducer
  isFetchingUpdateInfo: false,
  fetchUpdateInfoMsg: null
};

export const fetchGetUserData = createAsyncThunk(
  'authen/fetchGetUserInfo',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenApi.getInformation({
        token: getToken(STORAGE_KEY.ACCESS_TOKEN)
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  'authen/fetchLogin',
  async ({ email, password, remember_me }: any, { rejectWithValue }) => {
    try {
      const response = await authenApi.login({ email, password, remember_me });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchRegister = createAsyncThunk(
  'authen/fetchRegister',
  async ({ full_name, email, password, phone, address }: User, { rejectWithValue }) => {
    try {
      const response = await authenApi.register({ full_name, email, password, phone, address });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchChangePassword = createAsyncThunk(
  'authen/fetchChangePassword',
  async ({ oldPassword, newPassword }: any, { rejectWithValue }) => {
    try {
      const response = await authenApi.changePassword({
        token: getToken(STORAGE_KEY.ACCESS_TOKEN),
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const authenSlice: any = createSlice({
  name: 'authen',
  initialState,
  reducers: {
    logout(state) {
      deleteToken(STORAGE_KEY.ACCESS_TOKEN);
      state.isAuth = false;
      state.userData = null;
    },

    clearMsg(state: any, action) {
      if (
        [
          `fetchUserDataMsg`,
          `fetchLoginMsg`,
          `fetchRegisterMsg`,
          `fetchChangePasswordMsg`,
          `fetchUpdateInfoMsg`
        ].includes(action.payload)
      ) {
        state[action.payload] = null;
      }
    }
  },

  extraReducers: (builder) => {
    builder
      // Handle fetch get user information
      .addCase(fetchGetUserData.rejected, (state: any, action) => {
        state.isAuth = false;
        state.isFetchingUserData = false;
        state.fetchUserDataMsg = action.payload || action.error.message;
        state.userData = null;
      })
      .addCase(fetchGetUserData.pending, (state) => {
        state.isFetchingUserData = true;
        state.fetchUserDataMsg = null;
      })
      .addCase(fetchGetUserData.fulfilled, (state, action) => {
        state.isFetchingUserData = false;
        state.fetchUserDataMsg = null;
        state.userData = action.payload;
      })

      // Handle fetch login
      .addCase(fetchLogin.rejected, (state: any, action) => {
        state.isAuth = false;
        state.userData = null;
        state.isFetchingLogin = false;
        state.fetchLoginMsg = action.payload || action.error.message;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.isFetchingLogin = true;
        state.fetchLoginMsg = null;
      })
      .addCase(fetchLogin.fulfilled, (state: any, action) => {
        saveToken(STORAGE_KEY.ACCESS_TOKEN, action.payload.auth_info.access_token);
        state.isAuth = true;
        state.isFetchingLogin = false;
        state.fetchLoginMsg = null;
        state.userData = action.payload.user_info;
      })

      // Handle fetch register
      .addCase(fetchRegister.rejected, (state: any, action) => {
        state.isAuth = false;
        state.userData = null;
        state.isFetchingRegister = false;
        state.fetchRegisterMsg = action.payload || action.error.message;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.isFetchingRegister = true;
        state.fetchRegisterMsg = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        saveToken(STORAGE_KEY.ACCESS_TOKEN, action.payload.auth_info.access_token);
        state.isAuth = true;
        state.isFetchingRegister = false;
        state.fetchRegisterMsg = null;
        state.userData = action.payload.user_info;
      })

      // Handle fetch change password
      .addCase(fetchChangePassword.rejected, (state: any, action) => {
        state.isFetchingChangePassword = false;
        state.fetchChangePasswordMsg = action.payload || action.error.message;
      })
      .addCase(fetchChangePassword.pending, (state) => {
        state.isFetchingChangePassword = true;
        state.fetchChangePasswordMsg = null;
      })
      .addCase(fetchChangePassword.fulfilled, (state: any, action) => {
        state.fetchChangePasswordMsg = MESSAGES.UPDATE_SUCCESS;
        state.isFetchingChangePassword = false;
      });
  }
});

export const { logout, clearMsg } = authenSlice.actions;

export const selectIsAuth = (state: any) => state.authenSlice.isAuth;
export const selectUserInfo = (state: any) => state.authenSlice.userData;

export default authenSlice.reducer;
