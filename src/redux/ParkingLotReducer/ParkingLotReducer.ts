import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config';

export interface ParkingLotResult {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  longitude: string;
  latitude: string;
  managerName: string;
  parkingLotImg: string;
  cars: any[];
}
export interface ParkingLotState {
  ParkingLot: ParkingLotResult[],
  status: boolean;
  error: string | null;
  showPopup: boolean;
  loading: boolean;
  alertAction: string;
  message: string | null;
  parkinglotdetail: ParkingLotResult | null

}
const initialState: ParkingLotState = {
  ParkingLot: [],
  parkinglotdetail: null,
  status: false,
  error: null,
  showPopup: true,
  loading: false,
  alertAction: "",
  message: null,
}

const ParkingLotReducer = createSlice({
  name: 'ParkingLotReducer',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getParkingLotcarAsyncApi.pending, (state: ParkingLotState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(getParkingLotcarAsyncApi.fulfilled, (state: ParkingLotState, action: PayloadAction<ParkingLotResult[]>) => {
      state.loading = false;
      state.ParkingLot = action.payload
    });
    builder.addCase(getParkingLotcarAsyncApi.rejected, (state: ParkingLotState) => {

    });

    builder.addCase(getParkingLotcarByIdAsyncApi.pending, (state: ParkingLotState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(getParkingLotcarByIdAsyncApi.fulfilled, (state: ParkingLotState, action: PayloadAction<ParkingLotResult>) => {
      state.loading = false;
      state.parkinglotdetail = action.payload
    });
    builder.addCase(getParkingLotcarByIdAsyncApi.rejected, (state: ParkingLotState) => {

    });







    builder.addCase(postparkinglotAsyncApi.pending, (state: ParkingLotState) => {
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      postparkinglotAsyncApi.fulfilled,
      (state: ParkingLotState, action: PayloadAction<ParkingLotResult>) => {
        state.loading = false;
        state.parkinglotdetail = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Tạo mới thành công";
      }
    );
    builder.addCase(
      postparkinglotAsyncApi.rejected,
      (state: ParkingLotState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(putParkingLotCar.pending, (state: ParkingLotState) => {
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      putParkingLotCar.fulfilled,
      (state: ParkingLotState, action: PayloadAction<ParkingLotResult>) => {
        state.loading = false;
        state.parkinglotdetail = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "cập nhập thành công";
      }
    );
    builder.addCase(
      putParkingLotCar.rejected,
      (state: ParkingLotState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );

  }


});
export const parkingcarAction = ParkingLotReducer.actions
export default ParkingLotReducer.reducer
export const getParkingLotcarAsyncApi = createAsyncThunk(
  'ParkingLotReducer/getParkingLotcarAsyncApi',
  async (): Promise<ParkingLotResult[]> => {
    try {
      const response = await http.get(`/parkinglot`);
      return response.data;

    } catch (error: any) {

      throw error.response.data;
    }

  }
);


export const postparkinglotAsyncApi = createAsyncThunk(
  "parkinglotReducer/postparkinglotAsyncApi",
  async (parkinglotdetail: ParkingLotResult): Promise<ParkingLotResult> => {
    try {
      const response = await http.post(`parkinglot/create`, parkinglotdetail);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;

      throw errors[0].errorMessage;
    }
  }
);


export const getParkingLotcarByIdAsyncApi = createAsyncThunk(
  'ParkingLotReducer/getParkingLotcarByIdAsyncApi',
  async (id: string): Promise<ParkingLotResult> => {
    try {
      const response = await http.get(`/parkinglot/${id}`);
      return response.data;
    } catch (error: any) {

      throw error.response.data;
    }

  }
);

export const putParkingLotCar = createAsyncThunk(
  'ParkingLotReducer/putParkingLotCar',
  async (parkinglotdetail: ParkingLotResult): Promise<ParkingLotResult> => {
    try {
      const response = await http.put(`/parkinglot/update/${parkinglotdetail.id}`, parkinglotdetail);
      return response.data;
    } catch (error: any) {

      throw error.response.data;
    }

  }
);