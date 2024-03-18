import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config'; 


export interface CarGenerationResult {
    id:         number;
    carModelId: number;
    name:       string;
    yearBegin:  number;
    yearEnd:    string;
    carModel:   string;
}
export interface CarGenerationState {
    CarGeneration: CarGenerationResult []
   }
   const initialState : CarGenerationState = {
    CarGeneration : []
   }
   
   const CarGenerationReducer = createSlice({
       name: 'CarGenerationReducer',
       initialState,
       reducers: {},
       extraReducers(builder) {
         builder.addCase(getCarGenerationAsyncApi.fulfilled, (state:CarGenerationState,action:PayloadAction< CarGenerationResult[]>) => {
           state.CarGeneration = action.payload
       });
     
     
     }
     
     
     });
     export const CarGeneAction = CarGenerationReducer.actions
     export default CarGenerationReducer.reducer
     export const getCarGenerationAsyncApi = createAsyncThunk(
         'CarGenerationReducer/getCarGenerationAsyncApi',
         async (carModelId:number): Promise<CarGenerationResult[]> => {
             try {
                 const response = await http.get(`cargeneration/get-by-carModelId/${carModelId}`);
                 return response.data;
                
             } catch (error: any) {
                 
                 throw error.response.data;
             }
     
         }
     );
     
