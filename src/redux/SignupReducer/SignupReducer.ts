import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http1 } from '../../util/config';
import { history } from '../../util/config';

export interface SignupModel {
  email?: string;
  password?: string;
  name?: string;
  gender?: boolean;
  phone?: string;

}

export type SiginupState = {
  signup: SignupModel,
  error: string | null,

}


const initialSingupState: SiginupState = {
  signup: {},
  error: null,
}


const SignupReducer = createSlice({
  name: 'SignupReducer',
  initialState: initialSingupState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(postSignupApi.pending, (state: SiginupState) => {

    });
    builder.addCase(postSignupApi.fulfilled, (state: SiginupState, action: PayloadAction<SignupModel>) => {
      history.push("/")
    });
    builder.addCase(postSignupApi.rejected, (state: SiginupState, { error }) => {
      if (error.message !== undefined)
        state.error = error.message;

    });
  }
});

export const SignupAction = SignupReducer.actions

export default SignupReducer.reducer

export const postSignupApi = createAsyncThunk(
  'SignupReducer/signupAsyncApi',
  async (userSignup: SignupModel): Promise<SignupModel> => {
    try {
      const response = await http1.post(`/api/Users/signup`, userSignup);
      return response.data.content;
    } catch (error: any) {

      throw error.response.data;
    }

  }

);
