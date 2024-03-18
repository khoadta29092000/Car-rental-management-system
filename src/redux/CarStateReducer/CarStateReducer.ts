import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { http } from "../../util/config";
export interface CarStateModel{}

export interface CarStateResultState {
 
    CarStateResult: CarStateModel[]
    CarStateDetail: CarStateModel | null
  

}
const initialState: CarStateResultState = {
    CarStateResult: [],
    CarStateDetail:null,
   
  
}   

const   CarStateInfoReducer = createSlice({
    name: 'CarStateInfoReducer',
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder.addCase(getcarAsyncApi.fulfilled, (state:CarStateResultState,action:PayloadAction< CarStateModel[]>) => {
        state.CarStateResult = action.payload
    });
      builder.addCase(getCarstateByIdAsyncApi.fulfilled, (state: CarStateResultState, action: PayloadAction<CarStateModel>) => {
        state.CarStateDetail = action.payload
      });
      builder.addCase(getCarstateByIdAsyncApi.rejected, (state: CarStateResultState) => {
      
      });
    },
  });



export const carstateAction = CarStateInfoReducer.actions
export default CarStateInfoReducer.reducer
export const getcarAsyncApi = createAsyncThunk(
    'CarStateInfoReducer/CarStateInfoReducer',
    async (): Promise<CarStateModel[]> => {
        try {
            const response = await http.get(`/api/v1/CarState`);
            return response.data;
           
        } catch (error: any) {
            
            throw error.response.data;
        }

    }
);


export const getCarstateByIdAsyncApi = createAsyncThunk(
    'CarsteInfoReducer/CarsteInfoReducer',
    async (id: string ): Promise<CarStateModel> => {
        try {
            const response = await http.get(`/api/v1/CarState/${id}`);
            return response.data;
        } catch (error: any) {

            throw error.response.data;
        }

    }
);
