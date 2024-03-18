import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../../util/config";
import { ReceiveContractModel } from "../../models/ReceiveContractModel";
import dayjs, { Dayjs } from "dayjs";
export interface ReceiveContractFileCreateModels {
  title: string;
  documentImg: string;
  documentDescription: string;
}
export interface postReceiveContractModel {
  receiverId: number;
  contractGroupId: number;
  transferContractId: number;
  dateReceive: Dayjs | Date | null;
  receiveAddress: string;
  originalCondition: boolean;
  currentCarStateSpeedometerNumber: number;
  currentCarStateFuelPercent: number;
  currentCarStateCurrentEtcAmount: number;
  currentCarStateCarStatusDescription: string;
  depositItemAsset: string;
  depositItemDescription: string;
  depositItemDownPayment: number;
  returnDepostiItem: boolean;
  createdDate: Date | null;
  totalKilometersTraveled: number;
  currentCarStateCarDamageDescription: string;
  insuranceMoney: number;
  extraTime: number;
  detectedViolations: boolean;
  speedingViolationDescription: string;
  forbiddenRoadViolationDescription: string;
  trafficLightViolationDescription: string;
  ortherViolation: string;
  violationMoney: number;
  receiveContractFileCreateModels: ReceiveContractFileCreateModels[];
}

export interface ReceiveContractState {
  ReceiveContract: ReceiveContractModel[];
  ReceiveContractDetail: ReceiveContractModel | null;
  ReceiveContractDetailByContractId: ReceiveContractModel | null;
  statusReceiveContract: boolean;
}

const initialState: ReceiveContractState = {
  ReceiveContract: [],
  ReceiveContractDetail: null,
  ReceiveContractDetailByContractId: null,
  statusReceiveContract: false,
};

const ReceiveContractReducer = createSlice({
  name: "ReceiveContractReducer",
  initialState,
  reducers: {
    deleteReceiveContract: (state: ReceiveContractState) => {
      state.ReceiveContractDetailByContractId = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getReceiveContractByContractIdAsyncApi.pending,
      (state: ReceiveContractState) => {}
    );
    builder.addCase(
      getReceiveContractByContractIdAsyncApi.fulfilled,
      (
        state: ReceiveContractState,
        action: PayloadAction<ReceiveContractModel>
      ) => {
        state.ReceiveContractDetailByContractId = action.payload;
      }
    );
    builder.addCase(
      getReceiveContractByContractIdAsyncApi.rejected,
      (state: ReceiveContractState) => {}
    );
    builder.addCase(
      getReceiveContractByIdAsyncApi.pending,
      (state: ReceiveContractState) => {}
    );
    builder.addCase(
      getReceiveContractByIdAsyncApi.fulfilled,
      (
        state: ReceiveContractState,
        action: PayloadAction<ReceiveContractModel>
      ) => {
        state.ReceiveContractDetail = action.payload;
      }
    );
    builder.addCase(
      getReceiveContractByIdAsyncApi.rejected,
      (state: ReceiveContractState) => {}
    );
    builder.addCase(
      postReceiveContractReducerAsyncApi.pending,
      (state: ReceiveContractState) => {}
    );
    builder.addCase(
      postReceiveContractReducerAsyncApi.fulfilled,
      (
        state: ReceiveContractState,
        action: PayloadAction<postReceiveContractModel[]>
      ) => {
        state.statusReceiveContract = !state.statusReceiveContract;
      }
    );
    builder.addCase(
      postReceiveContractReducerAsyncApi.rejected,
      (state: ReceiveContractState, { error }) => {}
    );
    builder.addCase(
      putReceiveContractReducerAsyncApi.pending,
      (state: ReceiveContractState) => {}
    );
    builder.addCase(
      putReceiveContractReducerAsyncApi.fulfilled,
      (
        state: ReceiveContractState,
        action: PayloadAction<ReceiveContractModel[]>
      ) => {
        state.statusReceiveContract = !state.statusReceiveContract;
      }
    );
    builder.addCase(
      putReceiveContractReducerAsyncApi.rejected,
      (state: ReceiveContractState, { error }) => {}
    );
  },
});
export const ReceiveContractAction = ReceiveContractReducer.actions;
export default ReceiveContractReducer.reducer;
export const getReceiveContractByContractIdAsyncApi = createAsyncThunk(
  "ReceiveContractReducer/getReceiveContractByContractIdAsyncApi",
  async (id: number): Promise<ReceiveContractModel> => {
    try {
      const response = await http.get(
        `ReceiveContract/get-by-contractGroupId/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getReceiveContractByIdAsyncApi = createAsyncThunk(
  "ReceiveContractReducer/getReceiveContractByIdAsyncApi",
  async (id: number): Promise<ReceiveContractModel> => {
    try {
      const response = await http.get(`/ReceiveContract/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putReceiveContractReducerAsyncApi = createAsyncThunk(
  "ReceiveContractReducer/putReceiveContractReducerAsyncApi",
  async (
    ReceiveContract: ReceiveContractModel
  ): Promise<ReceiveContractModel[]> => {
    try {
      const response = await http.put(
        `ReceiveContract/update/${ReceiveContract.id}`,
        ReceiveContract
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postReceiveContractReducerAsyncApi = createAsyncThunk(
  "ReceiveContractReducer/postReceiveContractReducerAsyncApi",
  async (
    ReceiveContract: postReceiveContractModel
  ): Promise<postReceiveContractModel[]> => {
    try {
      const response = await http.post(
        `ReceiveContract/create`,
        ReceiveContract
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
