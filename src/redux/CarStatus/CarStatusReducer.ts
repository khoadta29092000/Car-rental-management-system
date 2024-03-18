import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../../util/config";

export interface CarStatusResult {
    id:         number;
    name:       string;
    carSchedules: [];
    cars: [];
}

export interface CarStatusState {
 carStatus: CarStatusResult[]
}
const initialState : CarStatusState = {
    carStatus : [],
   
}

const CarStatusReducer = createSlice({
    name: 'CarStatus',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getcarStatusAsyncApi.pending, (state:CarStatusState) => {
          
        });
      builder.addCase(getcarStatusAsyncApi.fulfilled, (state:CarStatusState,action:PayloadAction< CarStatusResult[]>) => {
        state.carStatus = action.payload
      
    });
    builder.addCase(getcarStatusAsyncApi.rejected, (state:CarStatusState) => {
       
    });
  }
  
  
  });
  export const RetalcarAction = CarStatusReducer.actions
  export default CarStatusReducer.reducer
  export const getcarStatusAsyncApi = createAsyncThunk(
      'CarStatusReducer/getCarStatusAsyncApi',
      async (): Promise<CarStatusResult[]> => {
          try {
              const response = await http.get(`/carstatus`);
              return response.data;
             
          } catch (error: any) {
              
              throw error.response.data;
          }
  
      }
  );
  