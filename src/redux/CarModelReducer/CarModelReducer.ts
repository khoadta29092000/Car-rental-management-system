import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config'; 


// export interface CarModelResult  {
//     CarMakeId: string;
//     Name:      string;
//     id:        string;
// }
export interface CarModelResult {
    id: number;
    carMakeId: string;
    name: string;
    carGenerations: [];
    carMake: string;
    }
    
    export interface CarModelState {
    carModels: CarModelResult[];
    carModel:CarModelResult[];
    CarModeldetail: CarModelResult | null;
    }
    
    const initialState: CarModelState = {
    carModels: [ ],
    carModel:[],
    CarModeldetail: null,
    };
    
    const CarModelReducer = createSlice({
    name: 'CarModelReducer',
    initialState,
    reducers: {
    setSelectedCarModel(state, action: PayloadAction<CarModelResult>) {
    state.CarModeldetail = action.payload;
    },
    },
    extraReducers(builder) {
    builder.addCase(getCarModelcarAsyncApi.fulfilled, (state: CarModelState, action: PayloadAction<CarModelResult[]>) => {
    state.carModels = action.payload;
    });
    builder.addCase(getCarModelAsyncApi.fulfilled, (state: CarModelState, action: PayloadAction<CarModelResult[]>) => {
    state.carModel = action.payload;
    });
    },
    });
    
    export const CarModelActions = CarModelReducer.actions;
    export default CarModelReducer.reducer;
   
   
   
    export const getCarModelcarAsyncApi = createAsyncThunk(
    'CarModelReducer/getCarModelcarAsyncApi',
    async (carMakeId: number): Promise<CarModelResult[]> => {
    try {
    const response = await http.get(`/carmodel/get-by-carMakeId/${carMakeId}`);
    return response.data;
    } catch (error: any) {
    throw error.response.data;
    }
    }
    );
    
   
    export const getCarModelAsyncApi = createAsyncThunk(
    'CarModelReducer/getCarModelAsyncApi',
    async (): Promise<CarModelResult[]> => {
    try {
    const response = await http.get(`/carmodel`);
    return response.data;
    } catch (error: any) {
    throw error.response.data;
    }
    }
    );
    