import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../../util/config";
export interface customerFiles {
  id: number;
  customerInfoId: number;
  typeOfDocument: string;
  title: string;
  documentImg: string;
  documentDescription: string;
}

export interface CustomerinfoResult {
  id: number;
  customerName: string;
  phoneNumber: string;
  customerAddress: string;
  citizenIdentificationInfoNumber: string;
  citizenIdentificationInfoAddress: string;
  citizenIdentificationInfoDateReceive: string;
  customerSocialInfoZalo: string;
  customerSocialInfoFacebook: string;
  relativeTel: string;
  companyInfo: string;
  customerEmail: string;
  contractGroups: [];
  customerFiles: customerFiles[];
}

export interface CustomerinfoState {
  customerinfo: CustomerinfoResult[];
  customerInfoDetail: CustomerinfoResult | null;
  loading: boolean;
}
const initialState: CustomerinfoState = {
  customerinfo: [],
  loading: false,
  customerInfoDetail: null,
};

const CustomerinfoReducer = createSlice({
  name: "Customerinfo",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getCustomerinfoReducerAsyncApi.pending,
      (state: CustomerinfoState) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getCustomerinfoReducerAsyncApi.fulfilled,
      (
        state: CustomerinfoState,
        action: PayloadAction<CustomerinfoResult[]>
      ) => {
        state.customerinfo = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      getCustomerinfoReducerAsyncApi.rejected,
      (state: CustomerinfoState) => {
        state.loading = false;
      }
    );
    builder.addCase(
      getCustomerinfoByCMNDReducerAsyncApi.pending,
      (state: CustomerinfoState) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getCustomerinfoByCMNDReducerAsyncApi.fulfilled,
      (state: CustomerinfoState, action: PayloadAction<CustomerinfoResult>) => {
        state.loading = false;
        state.customerInfoDetail = action.payload;
      }
    );
    builder.addCase(
      getCustomerinfoByCMNDReducerAsyncApi.rejected,
      (state: CustomerinfoState) => {
        state.loading = false;
      }
    );
    builder.addCase(
      deleteCustomerInfoBycustomerFileId.pending,
      (state: CustomerinfoState) => {
        state.loading = true;
      }
    );
    builder.addCase(
      deleteCustomerInfoBycustomerFileId.fulfilled,
      (state: CustomerinfoState, action: PayloadAction<CustomerinfoResult>) => {
        state.loading = false;
      }
    );
    builder.addCase(
      deleteCustomerInfoBycustomerFileId.rejected,
      (state: CustomerinfoState) => {
        state.loading = false;
      }
    );
  },
});
export const CustomerinfoAction = CustomerinfoReducer.actions;
export default CustomerinfoReducer.reducer;
export const getCustomerinfoReducerAsyncApi = createAsyncThunk(
  "CustomerinfoReducer/getCustomerinfoReducerAsyncApi",
  async (): Promise<CustomerinfoResult[]> => {
    try {
      const response = await http.get(`/customerinfo`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getCustomerinfoByCMNDReducerAsyncApi = createAsyncThunk(
  "CustomerinfoReducer/getCustomerinfoByCMNDReducerAsyncApi",
  async (CMND: string): Promise<CustomerinfoResult> => {
    try {
      const response = await http.get( `/customerinfo/citizenIdentificationInfoNumber/${CMND}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const deleteCustomerInfoBycustomerFileId = createAsyncThunk(
  "CustomerinfoReducer/deleteCustomerInfoBycustomerFileId",
  async (id: number): Promise<CustomerinfoResult> => {
    try {
      const response = await http.delete(
        `/customerinfo/delete/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);