import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { http } from "../../util/config";
export interface CarLoanInfo{}

export interface CarLoanInfoResultState {
 
    CarLoanInfoResult: CarLoanInfo[]
    CarLoanInfoDetail: CarLoanInfo | null
  

}
const initialState: CarLoanInfoResultState = {
    CarLoanInfoResult: [],
    CarLoanInfoDetail:null,
   
  
}   

const  CarLoanInfoReducer = createSlice({
    name: 'CarLoanInfoReducer',
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder.addCase(getcarAsyncApi.fulfilled, (state:CarLoanInfoResultState,action:PayloadAction< CarLoanInfo[]>) => {
        state.CarLoanInfoResult = action.payload
    });
      builder.addCase(getCarLoanByIdAsyncApi.fulfilled, (state: CarLoanInfoResultState, action: PayloadAction<CarLoanInfo>) => {
        state.CarLoanInfoDetail = action.payload
      });
      builder.addCase(getCarLoanByIdAsyncApi.rejected, (state: CarLoanInfoResultState) => {
      
      });
  
  
  
    },
  });



export const carinfoAction = CarLoanInfoReducer.actions
export default CarLoanInfoReducer.reducer
export const getcarAsyncApi = createAsyncThunk(
    'CarLoanInfoReducer/CarLoanInfoReducer',
    async (): Promise<CarLoanInfo[]> => {
        try {
            const response = await http.get(`/api/v1/CarLoanInfo `);
            return response.data;
           
        } catch (error: any) {
            
            throw error.response.data;
        }

    }
);


export const getCarLoanByIdAsyncApi = createAsyncThunk(
    'CarLoanInfoReducer/getcaridReducer',
    async (id: string ): Promise<CarLoanInfo> => {
        try {
            const response = await http.get(`/api/v1/CarLoanInfo/${id}`);
            return response.data;
        } catch (error: any) {

            throw error.response.data;
        }

    }
);
