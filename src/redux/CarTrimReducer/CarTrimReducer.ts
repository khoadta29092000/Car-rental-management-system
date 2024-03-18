import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config'; 

export interface CarTrimResult {
    id:               number;
    carModelId:       number;
    carSeriesId:      number;
    name:             string;
    startProductYear: number;
    endProductYear:   number;
}
export interface CarTrimState {
    CarTrim: CarTrimResult[]
   }
   const initialState : CarTrimState = {
    CarTrim : []
   }
   
   const CarTrimReducer = createSlice({
       name: 'CarTrimReducer',
       initialState,
       reducers: {},
       extraReducers(builder) {
         builder.addCase(getCarTrimcarAsyncApi.fulfilled, (state:CarTrimState,action:PayloadAction< CarTrimResult[]>) => {
           state.CarTrim = action.payload
       });
     
     
     }
     
     
     });
     export const RetalcarAction = CarTrimReducer.actions
     export default CarTrimReducer.reducer
     export const getCarTrimcarAsyncApi = createAsyncThunk(
         'CarTrimReducer/getCarTrimcarAsyncApi',
         async (
            { carModelId, carSeriesId }: { carModelId: number, carSeriesId: number }
          ): Promise<CarTrimResult[]> => {
             try {
                 const response = await http.get(`cartrim/carModelId/${carModelId}/carSeriesId/${carSeriesId}`);
                 return response.data;
                
             } catch (error: any) {
                 
                 throw error.response.data;
             }
     
         }
     );
     