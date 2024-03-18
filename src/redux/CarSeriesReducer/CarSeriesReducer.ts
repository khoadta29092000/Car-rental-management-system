import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config'; 
export interface CarSeriesResult {
    id:              number;
    carModelId:      number;
    carGenerationId: number;
    name:            string;
}
export interface CarSerieState {
    CarSeries: CarSeriesResult[]
   }
   const initialState : CarSerieState = {
     CarSeries : []
   }
   
   const CarSerieReducer = createSlice({
       name: 'CarSerieReducer',
       initialState,
       reducers: {},
       extraReducers(builder) {
         builder.addCase(getcarSeriAsyncApi.fulfilled, (state:CarSerieState,action:PayloadAction< CarSeriesResult[]>) => {
           state.CarSeries = action.payload
       });  
     }
     });
     export const carSeriAction = CarSerieReducer.actions
     export default CarSerieReducer.reducer
     export const getcarSeriAsyncApi = createAsyncThunk(
         'CarSerieReducer/getcarSeriAsyncApi',
         async (
          { carModelId, carGenerationId }: { carModelId: number, carGenerationId: number }
        ): Promise<CarSeriesResult[]> => {
             try {
                 const response = await http.get(`carseries/carModelId/${carModelId}/carGenerationId/${carGenerationId}`);
                 return response.data;
                
             } catch (error: any) {
                 
                 throw error.response.data;
             }
     
         }
     );
     
     