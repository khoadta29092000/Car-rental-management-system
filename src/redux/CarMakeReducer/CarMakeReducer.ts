import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config'; 

export interface CarMakeResult {
    id:         number;
    name:       string;
    carMakeImg: string;
    carModels: [];
}

export interface CarState {
 carMake: CarMakeResult[]
 loading: boolean,
}
const initialState : CarState = {
    carMake : [],
    loading: false
}

const CarMakeReducer = createSlice({
    name: 'CarMake',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getcarMakeAsyncApi.pending, (state:CarState) => {
            state.loading = true
        });
      builder.addCase(getcarMakeAsyncApi.fulfilled, (state:CarState,action:PayloadAction< CarMakeResult[]>) => {
        state.carMake = action.payload
        state.loading = false
    });
    builder.addCase(getcarMakeAsyncApi.rejected, (state:CarState) => {
        state.loading = false
    });
  }
  
  
  });
  export const RetalcarAction = CarMakeReducer.actions
  export default CarMakeReducer.reducer
  export const getcarMakeAsyncApi = createAsyncThunk(
      'CarMakeReducer/getCarMakeAsyncApi',
      async (): Promise<CarMakeResult[]> => {
          try {
              const response = await http.get(`/carmake`);
              return response.data;
             
          } catch (error: any) {
              
              throw error.response.data;
          }
  
      }
  );
  
  