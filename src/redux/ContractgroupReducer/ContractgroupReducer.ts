import { contractgroupModel } from "../../models/contractgroupModel";
import { http } from "../../util/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { contractgroupDetailsModel } from "../../models/contractgroupDetailsModel";


type contractgroupList = {
  contracts: contractgroupModel[];
  total: number;
};
export interface contractgroupStatusModel {
  id: number,
  name: string,
}
export interface contractgroupByCustomerModel {
  id: number;
  rentFrom: Date | null;
  rentTo: Date | null;
  contractGroupStatusId: number;
  contractGroupStatusName: string;
}
export interface contractgroupResultState {
  contractgroup: contractgroupList;
  error: string;
  contractgroupDetails: contractgroupDetailsModel;
  status: boolean;
  contractgroupstatus: contractgroupStatusModel[];
  loading: boolean;
  contractGroupByCustomer: contractgroupByCustomerModel[];
}



const initialState: contractgroupResultState = {
  contractGroupByCustomer: [],
  contractgroup: { contracts: [], total: 0 },
  contractgroupDetails: {
    id: 0,
    userId: 0,
    staffEmail: "",
    carId: 0,
    rentPurpose: "",
    rentFrom: null,
    rentTo: null,
    requireDescriptionInfoPriceForDay: 0,
    requireDescriptionInfoGearBox: "",
    requireDescriptionInfoCarClass: "",
    requireDescriptionInfoCarBrand: "",
    requireDescriptionInfoSeatNumber: 0,
    requireDescriptionInfoYearCreate: 0,
    requireDescriptionInfoCarColor: "",
    deliveryAddress: "",
    contractGroupStatusId: 0,
    contractGroupStatusName: "",
    customerInfoId: 0,
    phoneNumber: "",
    customerSocialInfoZalo: "",
    customerSocialInfoFacebook: "",
    customerSocialInfoLinkedin: "",
    customerSocialInfoOther: "",
    addtionalInfo: "",
    relativeTel: "",
    expertiseInfoIsFirstTimeRent: false,
    expertiseInfoTrustLevel: "",
    companyInfo: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    path: "",
    citizenIdentifyImage1: "",
    citizenIdentifyImage2: "",
    drivingLisenceImage1: "",
    drivingLisenceImage2: "",
    housePaperImages: "",
    passportImages: "",
    otherImages: "",
    rentContracts: "",
    transferContracts: "",
    expertiseContractId: "",
    expertiseContractStatusId: "",
    expertiseContractStatusName: "",
    rentContractId: "",
    rentContractStatusId: "",
    rentContractStatusName: "",
    transferContractId: "",
    transferContractStatusId: "",
    transferContractStatusName: "",
    receiveContractId: "",
    receiveContractStatusId: "",
    receiveContractStatusName: "",
    citizenIdentificationInfoNumber: "",
    citizenIdentificationInfoAddress: "",
    citizenIdentificationInfoDateReceive: null,
    customerFiles: [{
      id: 0,
      customerInfoId: 0,
      typeOfDocument: "",
      title: "",
      documentImg: "",
      documentDescription: "",
    }],
  },
  error: "",
  status: false,
  contractgroupstatus: [],
  loading: false,
};

const ContractgroupReducer = createSlice({
  name: "ContractgroupReducer",
  initialState,
  reducers: {
    deleteCarContractGr: (state: contractgroupResultState) => {
      state.contractgroupDetails = {
        id: 0,
        userId: 0,
        staffEmail: "",
        carId: 0,
        rentPurpose: "",
        rentFrom: null,
        rentTo: null,
        requireDescriptionInfoPriceForDay: 0,
        requireDescriptionInfoGearBox: "",
        requireDescriptionInfoCarClass: "",
        requireDescriptionInfoCarBrand: "",
        requireDescriptionInfoSeatNumber: 0,
        requireDescriptionInfoYearCreate: 0,
        requireDescriptionInfoCarColor: "",
        deliveryAddress: "",
        contractGroupStatusId: 0,
        contractGroupStatusName: "",
        customerInfoId: 0,
        phoneNumber: "",
        customerSocialInfoZalo: "",
        customerSocialInfoFacebook: "",
        customerSocialInfoLinkedin: "",
        customerSocialInfoOther: "",
        addtionalInfo: "",
        relativeTel: "",
        expertiseInfoIsFirstTimeRent: false,
        expertiseInfoTrustLevel: "",
        companyInfo: "",
        customerName: "",
        customerEmail: "",
        customerAddress: "",
        path: "",
        citizenIdentifyImage1: "",
        citizenIdentifyImage2: "",
        drivingLisenceImage1: "",
        drivingLisenceImage2: "",
        housePaperImages: "",
        passportImages: "",
        otherImages: "",
        rentContracts: "",
        transferContracts: "",
        expertiseContractId: "",
        expertiseContractStatusId: "",
        expertiseContractStatusName: "",
        rentContractId: "",
        rentContractStatusId: "",
        rentContractStatusName: "",
        transferContractId: "",
        transferContractStatusId: "",
        transferContractStatusName: "",
        receiveContractId: "",
        receiveContractStatusId: "",
        receiveContractStatusName: "",
        citizenIdentificationInfoNumber: "",
        citizenIdentificationInfoAddress: "",
        citizenIdentificationInfoDateReceive: null,
        customerFiles: [{
          id: 0,
          customerInfoId: 0,
          typeOfDocument: "",
          title: "",
          documentImg: "",
          documentDescription: "",
        }],
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getCarContractgroupReducercarAsyncApi.pending, (state: contractgroupResultState) => {
      state.loading = true;
    });
    builder.addCase(
      getCarContractgroupReducercarAsyncApi.fulfilled,
      (state: contractgroupResultState, action: any) => {
        state.loading = false;

        state.contractgroup = action.payload;
      }
    );
    builder.addCase(
      getCarContractgroupReducercarAsyncApi.rejected,
      (state: contractgroupResultState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(getCarContractgroupStatusReducercarAsyncApi.pending, (state: contractgroupResultState) => {

    });
    builder.addCase(
      getCarContractgroupStatusReducercarAsyncApi.fulfilled,
      (state: contractgroupResultState, action: PayloadAction<contractgroupStatusModel[]>) => {

        state.contractgroupstatus = action.payload;
      }
    );
    builder.addCase(
      getCarContractgroupStatusReducercarAsyncApi.rejected,
      (state: contractgroupResultState, { error }) => {

        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(
      postCarContractgroupReducercarAsyncApi.pending,
      (state: contractgroupResultState) => { }
    );
    builder.addCase(
      postCarContractgroupReducercarAsyncApi.fulfilled,
      (
        state: contractgroupResultState,
        action: PayloadAction<contractgroupModel[]>
      ) => {

      }
    );
    builder.addCase(
      postCarContractgroupReducercarAsyncApi.rejected,

      (state: contractgroupResultState, { error }) => { }
    );
    builder.addCase(
      getByIdCarContractgroupReducercarAsyncApi.pending,
      (state: contractgroupResultState) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getByIdCarContractgroupReducercarAsyncApi.fulfilled,
      (
        state: contractgroupResultState,
        action: PayloadAction<contractgroupDetailsModel>
      ) => {
        state.contractgroupDetails = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      getByIdCarContractgroupReducercarAsyncApi.rejected,
      (state: contractgroupResultState, { error }) => { state.loading = false; }
    );
    builder.addCase(
      getByCustomerReducercarAsyncApi.pending,
      (state: contractgroupResultState) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getByCustomerReducercarAsyncApi.fulfilled,
      (
        state: contractgroupResultState,
        action: PayloadAction<contractgroupByCustomerModel[]>
      ) => {
        state.contractGroupByCustomer = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      getByCustomerReducercarAsyncApi.rejected,
      (state: contractgroupResultState, { error }) => { state.loading = false; }
    );
    builder.addCase(putCarContractgroupReducercarAsyncApi.pending, (state: contractgroupResultState) => {
    });
    builder.addCase(
      putCarContractgroupReducercarAsyncApi.fulfilled,
      (state: contractgroupResultState, action: PayloadAction<contractgroupDetailsModel>) => {
        state.status = !state.status
      }
    );
    builder.addCase(
      putCarContractgroupReducercarAsyncApi.rejected,
      (state: contractgroupResultState, { error }) => {

      }
    );
    builder.addCase(putStatusCarContractgroupReducercarAsyncApi.pending, (state: contractgroupResultState) => {

    });
    builder.addCase(
      putStatusCarContractgroupReducercarAsyncApi.fulfilled,
      (state: contractgroupResultState, action: PayloadAction<contractgroupDetailsModel>) => {
        state.status = !state.status
      }
    );
    builder.addCase(
      putStatusCarContractgroupReducercarAsyncApi.rejected,
      (state: contractgroupResultState, { error }) => {

      }
    );
  },
});
export const RetalcarAction = ContractgroupReducer.actions;
export default ContractgroupReducer.reducer;
export const postCarContractgroupReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/postCarContractgroupReducercarAsyncApi",
  async (contractgroup: contractgroupModel): Promise<contractgroupModel[]> => {
    try {
      const response = await http.post(`/contractgroup/create`, contractgroup);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const getCarContractgroupReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/getCarContractgroupReducercarAsyncApi",
  async (filter: {
    pagination: {
      page: number;
      pageSize: number;
    }, status: number | string
    , id: number | null,
    CitizenIdentificationInfoNumber: string | null
  }): Promise<any> => {
    try {

      let url = `/contractgroup?ContractGroupStatusId=${filter.status}&page=${filter.pagination.page}&pageSize=${filter.pagination.pageSize}`
      if (filter.id) {
        url += `&UserId=${filter.id}`;
      }
      if (filter.CitizenIdentificationInfoNumber) {
        url += `&CitizenIdentificationInfoNumber=${filter.CitizenIdentificationInfoNumber}`;
      }
      const response = await http.get(url);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getCarContractgroupStatusReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/getCarContractgroupStatusReducercarAsyncApi",
  async (): Promise<any> => {
    try {
      const response = await http.get(
        `/contractgroupstatus`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getByIdCarContractgroupFilesReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/getByIdCarContractgroupFilesReducercarAsyncApi",
  async (id: number): Promise<any> => {
    try {
      const response = await http.get(
        `/contractgroup/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getByIdCarContractgroupReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/getByIdCarContractgroupReducercarAsyncApi",
  async (id: number): Promise<any> => {
    try {
      const response = await http.get(
        `/contractgroup/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getByCustomerReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/getByCustomerReducercarAsyncApi",
  async (citizen: string): Promise<any> => {
    try {
      const response = await http.get(
        `/contractgroup/citizen-number/${citizen}`
      );
      return response.data.contracts;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putCarContractgroupReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/putCarContractgroupReducercarAsyncApi",
  async (contractgroup: contractgroupDetailsModel): Promise<contractgroupDetailsModel> => {
    try {
      const response = await http.put(`contractgroup/update/${contractgroup?.id}`, contractgroup);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putStatusCarContractgroupReducercarAsyncApi = createAsyncThunk(
  "ContractgroupReducer/putStatusCarContractgroupReducercarAsyncApi",
  async (contractgroup: any) => {
    try {
      const response = await http.put(`contractgroup/update-status/${contractgroup?.id}`, contractgroup);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);