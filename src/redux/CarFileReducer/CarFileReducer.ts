
import { http } from "../../util/config";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface CarFileModel{}

export interface carFileState {
 
    CarFile: CarFileModel[]
    CarFileDetail:CarFileModel | null
   
   
}
const initialState: carFileState = {
    CarFile: [],
    CarFileDetail:null,
   
}   
const carFileReducer = createSlice({
  name: 'CarReducer',
  initialState,
  reducers: {},
  extraReducers(builder) {
//     builder.addCase(getcarFileAsyncApi.fulfilled, (state:carFileState,action:PayloadAction< CarFileModel[]>) => {
//       state.CarFile = action.payload
//   });
// builder.addCase(deleteCarFileAsyncApi.pending, (state: carFileState) => {
// });
// builder.addCase(  deleteCarFileAsyncApi.fulfilled,(state: carFileState, action: PayloadAction<CarFileModel>) => {
//   state.CarFileDetail = action.payload;
//   }
// );
// builder.addCase( deleteCarFileAsyncApi.rejected, (state: carFileState, { error }) => {
//   }
// );
builder.addCase(getCarfileByIdAsyncApi.fulfilled, (state: carFileState, action: PayloadAction<CarFileModel>) => {
  state.CarFileDetail = action.payload
});
builder.addCase(getCarfileByIdAsyncApi.rejected, (state: carFileState) => {

});



},
});

export const carFileAction = carFileReducer.actions
export default carFileReducer.reducer
// export const getcarFileAsyncApi = createAsyncThunk(
//     'carFileReducer/getcarAsyncApi',
//     async (): Promise<CarFileModel[]> => {
//         try {
//             const response = await http.get(`/api/v1/CarFile`);
//             return response.data;
           
//         } catch (error: any) {
            
//             throw error.response.data;
//         }

//     }
// );
//   export const deleteCarFileAsyncApi = createAsyncThunk(
//     "carFileReducer/deleteCarFileAsyncApi",
//     async (carFile: string): Promise<CarFileModel> => {
//       try {
//         const response = await http.delete(`/api/v1/carFile/${carFile}`);
//         return response.data;
//       } catch (error: any) {
//         throw error.response.data;
//       }
//     }
//   );


  export const getCarfileByIdAsyncApi = createAsyncThunk(
    'carFileReducer/getCarfileByIdAsyncApi',
    async (id: string ): Promise<CarFileModel> => {
        try {
            const response = await http.get(`/carfile/${id}`);
            return response.data;
        } catch (error: any) {

            throw error.response.data;
        }

    }
);
