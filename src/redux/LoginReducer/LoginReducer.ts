import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { access } from 'fs';
import { UserLoginModel } from '../../pages/Login/Login';
import { ACCESS_TOKEN, history, http, settings, USER_LOGIN, USER } from '../../util/config';
import { useNavigate } from "react-router-dom";
export interface UserLoginResult {
    email: string,
    password: string,
    accessToken: string,
    name: string,
    cardImage: string | null,
    role: string,
}
export interface UserState {
    userLogin: UserLoginResult | null,
    error: string | null,
}
const User = settings.getStorageJson(USER);
const initialState: UserState = {
  userLogin: settings.getStorageJson(USER_LOGIN) && User && 'role' in User
    ? { 
        email: User.email || '', 
        accessToken: settings.getStorageJson(settings.getStorageJson(USER)) || '', 
        name: User.name || '', 
        cardImage: User.cardImage || '', 
        password: "", 
        role: User.role || '' 
      }
    : null,
  error: null,
};

const userReducer = createSlice({
    name: 'loginReducer',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
      builder.addCase(loginAsyncApi.fulfilled, (state: UserState, action: PayloadAction<UserLoginResult>) => {
        state.userLogin = action.payload;
        settings.setStorageJson(USER_LOGIN, action.payload);
        settings.setCookieJson(USER_LOGIN, action.payload, 30);
        settings.setStorage(ACCESS_TOKEN, action.payload.accessToken);
        settings.setCookie(ACCESS_TOKEN, action.payload.accessToken, 30);
      });
      builder.addCase(loginAsyncApi.rejected, (state: UserState, { error }) => {
        if (error.message !== undefined) {
          state.error = error.message;
        }
      });
    },
  });

export const loginActions = userReducer.actions
export default userReducer.reducer
export const loginAsyncApi = createAsyncThunk(
    'loginReducer/loginAsyncApi',
    async (userLogin: UserLoginModel): Promise<UserLoginResult> => {
        try {
            const response = await http.post(`/login`, userLogin);
            return response.data;
        } catch (error: any) {
            const json = error.response.data;
            const errors = json[""].errors;
            throw errors[0].errorMessage;
        }
    }
);

