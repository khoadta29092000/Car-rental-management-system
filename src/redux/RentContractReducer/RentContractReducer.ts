import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../../util/config";
import { RentContractModel } from "../../models/rentContractModel";
import queryString from 'query-string';
export interface postRentContractModel {
  contractGroupId: number;
  representativeId: number;
  deliveryAddress: string;
  carGeneralInfoAtRentPriceForNormalDay: number;
  carGeneralInfoAtRentPriceForWeekendDay: number;
  carGeneralInfoAtRentPricePerKmExceed: number;
  carGeneralInfoAtRentPricePerHourExceed: number;
  carGeneralInfoAtRentLimitedKmForMonth: number;
  carGeneralInfoAtRentPriceForMonth: number;
  deliveryFee: number | null;
  createdDate: Date | null;
  paymentAmount: number;
  depositItemDescription?: string;
}
export interface postRentContractFilesModel {
  rentContractId: number;
  title: string;
  documentImg: string;
}
export interface getRentContractFilesModel {
  id:number;
  rentContractId: number;
  title: string;
  documentImg: string;
}


export interface RentContractState {
  rentContractFiles: getRentContractFilesModel[];
  rentContract: RentContractModel[];
  rentContractHistory: RentContractModel[];
  rentContractDetail: RentContractModel | null;
  rentContractDetailByContractId: RentContractModel | null;
  statusRentContract: boolean;
}

const initialState: RentContractState = {
  rentContractFiles: [],
  rentContractHistory: [],
  rentContract: [],
  rentContractDetail: null,
  rentContractDetailByContractId: null,
  statusRentContract: false,
};

const rentContractReducer = createSlice({
  name: "rentContractReducer",
  initialState,
  reducers: {
    deleteRentContract: (state: RentContractState) => {
      state.rentContractDetailByContractId = null;
      state.rentContractDetail = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getRentContractByContractIdAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractByContractIdAsyncApi.fulfilled,
      (state: RentContractState, action: PayloadAction<RentContractModel>) => {
        state.rentContractDetailByContractId = action.payload;
      }
    );
    builder.addCase(
      getRentContractByContractIdAsyncApi.rejected,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractHistoryIdAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractHistoryIdAsyncApi.fulfilled,
      (
        state: RentContractState,
        action: PayloadAction<RentContractModel[]>
      ) => {
        state.rentContractHistory = action.payload;
      }
    );
    builder.addCase(
      getRentContractHistoryIdAsyncApi.rejected,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractByIdAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractByIdAsyncApi.fulfilled,
      (state: RentContractState, action: PayloadAction<RentContractModel>) => {
        state.rentContractDetail = action.payload;
      }
    );
    builder.addCase(
      getRentContractByIdAsyncApi.rejected,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractFilesByContractIdAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      getRentContractFilesByContractIdAsyncApi.fulfilled,
      (state: RentContractState, action: PayloadAction<getRentContractFilesModel[]>) => {
        state.rentContractFiles = action.payload;
      }
    );
    builder.addCase(
      getRentContractFilesByContractIdAsyncApi.rejected,
      (state: RentContractState) => { }
    );
    builder.addCase(
      postRentContractReducerAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      postRentContractReducerAsyncApi.fulfilled,
      (
        state: RentContractState,
        action: PayloadAction<postRentContractModel[]>
      ) => {
        state.statusRentContract = !state.statusRentContract;
      }
    );
    builder.addCase(
      postRentContractReducerAsyncApi.rejected,
      (state: RentContractState, { error }) => { }
    );
    builder.addCase(
      putRentContractReducerAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      putRentContractReducerAsyncApi.fulfilled,
      (state: RentContractState, action: PayloadAction<RentContractModel>) => {
        state.statusRentContract = !state.statusRentContract;
      }
    );
    builder.addCase(
      putRentContractReducerAsyncApi.rejected,
      (state: RentContractState, { error }) => { }
    );
    builder.addCase(
      postSendMailReducerAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      postSendMailReducerAsyncApi.fulfilled,
      (state: RentContractState) => { }
    );
    builder.addCase(
      postSendMailReducerAsyncApi.rejected,
      (state: RentContractState, { error }) => { }
    );
    builder.addCase(
      postRentContractFilesReducerAsyncApi.pending,
      (state: RentContractState) => { }
    );
    builder.addCase(
      postRentContractFilesReducerAsyncApi.fulfilled,
      (state: RentContractState) => { }
    );
    builder.addCase(
      postRentContractFilesReducerAsyncApi.rejected,
      (state: RentContractState, { error }) => { }
    );
  },
});
export const rentContractAction = rentContractReducer.actions;
export default rentContractReducer.reducer;
export const getRentContractByContractIdAsyncApi = createAsyncThunk(
  "rentContractReducer/getRentContractByContractIdAsyncApi",
  async (id: number): Promise<RentContractModel> => {
    try {
      const response = await http.get(
        `rentcontract/last/contractGroupId/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getRentContractFilesByContractIdAsyncApi = createAsyncThunk(
  "rentContractReducer/getRentContractFilesByContractIdAsyncApi",
  async (id: number): Promise<getRentContractFilesModel[]> => {
    try {
      const response = await http.get(
        `rentcontract/get-files-by-rentContracId/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getRentContractHistoryIdAsyncApi = createAsyncThunk(
  "rentContractReducer/getRentContractHistoryIdAsyncApi",
  async (id: number): Promise<RentContractModel[]> => {
    try {
      const response = await http.get(
        `/rentcontract/get-by-contractGroupId/${id}`
      );

      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getRentContractByIdAsyncApi = createAsyncThunk(
  "rentContractReducer/getRentContractByIdAsyncApi",
  async (id: number): Promise<RentContractModel> => {
    try {
      const response = await http.get(`/RentContract/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putRentContractReducerAsyncApi = createAsyncThunk(
  "rentContractReducer/putRentContractReducerAsyncApi",
  async (rentContract: RentContractModel): Promise<RentContractModel> => {
    try {
      const response = await http.put(
        `rentcontract/update/${rentContract.id}`,
        rentContract
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postRentContractReducerAsyncApi = createAsyncThunk(
  "rentContractReducer/postRentContractReducerAsyncApi",
  async (
    rentContract: postRentContractModel
  ): Promise<postRentContractModel[]> => {
    try {
      const response = await http.post(`rentContract/create`, rentContract);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postRentContractFilesReducerAsyncApi = createAsyncThunk(
  "ContractgroupReducer/postRentContractReducerAsyncApi",
  async (contractgroup: postRentContractFilesModel[]): Promise<postRentContractFilesModel[]> => {
    try {
      const response = await http.post(`/rentContract/create-rent-contract-file`, contractgroup);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postSendMailReducerAsyncApi = createAsyncThunk(
  "rentContractReducer/postSendMailReducerAsyncApi",
  async (payload: {
    ToEmail: string;
    Subject: string;
    Body: string;
   
  }) => {
    try {
      const params = queryString.stringify(payload);
      const response = await http.post(`/api/Mail/send`, payload);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
