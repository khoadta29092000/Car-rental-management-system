import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { http } from "../../util/config";
export interface CarTracking{}

export interface CarTrackingResultState {
 
    CarTrackingfoResult: CarTracking[]
    CarTrackingDetail: CarTracking | null
  

}
const initialState: CarTrackingResultState = {
    CarTrackingfoResult: [],
    CarTrackingDetail:null,
   
  
}   

const  CarTrackingReducer = createSlice({
    name: 'CarTrackingReducer',
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder.addCase(getcartrackingAsyncApi.fulfilled, (state:CarTrackingResultState,action:PayloadAction< CarTracking[]>) => {
        state.CarTrackingfoResult = action.payload
    });
      builder.addCase(getCarTrackingByIdAsyncApi.fulfilled, (state: CarTrackingResultState, action: PayloadAction<CarTracking>) => {
        state.CarTrackingDetail = action.payload
      });
      builder.addCase(getCarTrackingByIdAsyncApi.rejected, (state: CarTrackingResultState) => {
      
      });
  
  
  
    },
  });



export const carinfoAction = CarTrackingReducer.actions
export default CarTrackingReducer.reducer
export const getcartrackingAsyncApi = createAsyncThunk(
    'CarTrackingReducer/CarTrackingReducer',
    async (): Promise<CarTracking[]> => {
        try {
            const response = await http.get(`/api/v1/CarTracking`);
            return response.data;
           
        } catch (error: any) {
            
            throw error.response.data;
        }

    }
);


export const getCarTrackingByIdAsyncApi = createAsyncThunk(
    'CarTracReducer/CarTracReducer',
    async (id: string ): Promise<CarTracking> => {
        try {
            const response = await http.get(`/api/v1/CarTracking/${id}`);
            return response.data;
        } catch (error: any) {

            throw error.response.data;
        }

    }
);
