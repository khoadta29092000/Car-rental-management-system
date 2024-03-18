import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../../util/config";
import { TransferContractModel } from "../../models/TransferContractModel";
import dayjs, { Dayjs } from "dayjs";
export interface transferContractFileCreateModels {
  title: string;
  documentImg: string;
  documentDescription: string;
}
export interface postTransferContractModel {
  transfererId: number;
  contractGroupId: number;
  //carId: number;
  dateTransfer: Date | Dayjs | null;
  deliveryAddress: string;
  currentCarStateSpeedometerNumber: number;
  currentCarStateFuelPercent: number;
  currentCarStateCurrentEtcAmount: number;
  currentCarStateCarStatusDescription: string;
  depositItemDownPayment: number;
  depositItemAsset: string;
  depositItemDescription: string;
  createdDate: Date | null;
  transferContractFileCreateModels: transferContractFileCreateModels[];
}

export interface TransferContractState {
  TransferContract: TransferContractModel[];
  TransferContractDetail: TransferContractModel | null;
  TransferContractDetailByContractId: TransferContractModel | null;
  statusTransferContract: boolean;
}

const initialState: TransferContractState = {
  TransferContract: [],
  TransferContractDetail: null,
  TransferContractDetailByContractId: null,
  statusTransferContract: false,
};

const TransferContractReducer = createSlice({
  name: "TransferContractReducer",
  initialState,
  reducers: {
    deleteTransferContract: (state: TransferContractState) => {
      state.TransferContractDetailByContractId = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getTransferContractByContractIdAsyncApi.pending,
      (state: TransferContractState) => {}
    );
    builder.addCase(
      getTransferContractByContractIdAsyncApi.fulfilled,
      (
        state: TransferContractState,
        action: PayloadAction<TransferContractModel>
      ) => {
        state.TransferContractDetailByContractId = action.payload;
      }
    );
    builder.addCase(
      getTransferContractByContractIdAsyncApi.rejected,
      (state: TransferContractState) => {}
    );
    builder.addCase(
      getTransferContractByIdAsyncApi.pending,
      (state: TransferContractState) => {}
    );
    builder.addCase(
      getTransferContractByIdAsyncApi.fulfilled,
      (
        state: TransferContractState,
        action: PayloadAction<TransferContractModel>
      ) => {
        state.TransferContractDetail = action.payload;
      }
    );
    builder.addCase(
      getTransferContractByIdAsyncApi.rejected,
      (state: TransferContractState) => {}
    );
    builder.addCase(
      postTransferContractReducerAsyncApi.pending,
      (state: TransferContractState) => {}
    );
    builder.addCase(
      postTransferContractReducerAsyncApi.fulfilled,
      (
        state: TransferContractState,
        action: PayloadAction<postTransferContractModel[]>
      ) => {
        state.statusTransferContract = !state.statusTransferContract;
      }
    );
    builder.addCase(
      postTransferContractReducerAsyncApi.rejected,
      (state: TransferContractState, { error }) => {}
    );
    builder.addCase(
      putTransferContractReducerAsyncApi.pending,
      (state: TransferContractState) => {}
    );
    builder.addCase(
      putTransferContractReducerAsyncApi.fulfilled,
      (
        state: TransferContractState,
        action: PayloadAction<TransferContractModel[]>
      ) => {
        state.statusTransferContract = !state.statusTransferContract;
      }
    );
    builder.addCase(
      putTransferContractReducerAsyncApi.rejected,
      (state: TransferContractState, { error }) => {}
    );
  },
});
export const TransferContractAction = TransferContractReducer.actions;
export default TransferContractReducer.reducer;
export const getTransferContractByContractIdAsyncApi = createAsyncThunk(
  "TransferContractReducer/getTransferContractByContractIdAsyncApi",
  async (id: number): Promise<TransferContractModel> => {
    try {
      const response = await http.get(
        `TransferContract/get-by-contractGroupId/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getTransferContractByIdAsyncApi = createAsyncThunk(
  "TransferContractReducer/getTransferContractByIdAsyncApi",
  async (id: number): Promise<TransferContractModel> => {
    try {
      const response = await http.get(`/TransferContract/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putTransferContractReducerAsyncApi = createAsyncThunk(
  "TransferContractReducer/putTransferContractReducerAsyncApi",
  async (
    TransferContract: TransferContractModel
  ): Promise<TransferContractModel[]> => {
    try {
      const response = await http.put(
        `Transfercontract/update/${TransferContract.id}`,
        TransferContract
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postTransferContractReducerAsyncApi = createAsyncThunk(
  "TransferContractReducer/postTransferContractReducerAsyncApi",
  async (
    TransferContract: postTransferContractModel
  ): Promise<postTransferContractModel[]> => {
    try {
      const response = await http.post(
        `TransferContract/create`,
        TransferContract
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
