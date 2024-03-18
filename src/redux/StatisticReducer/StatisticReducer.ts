import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http } from "../../util/config";
import { Dayjs } from "dayjs";
export interface StatisticContractResult {
  id: number;
  contractGroupId: number;
  etcmoneyUsing: number;
  fuelMoneyUsing: number;
  extraTimeMoney: number;
  extraKmMoney: number;
  paymentAmount: number;
  insuranceMoney: number;
  violationMoney: number;
  total: number;
}
export interface carExpensesResult {
  id: number;
  carId: number;
  title: string;
  day: Day | Dayjs;
  amount: number;
}
export interface carRevenuesResult {
  id: number;
  contractGroupId: number;
  total: number;
}
export interface StatisticCarResult {
  carId: number;
  parkingLotId: number;
  carLicensePlates: string;
  carExpenses: carExpensesResult[] | [];
  carRevenues: carRevenuesResult[] | [];
}
export interface StatisticState {
  Statistic: StatisticContractResult[];
  StatisticCar: StatisticCarResult[];
  error: string | null;
  loading: boolean;
}
const initialState: StatisticState = {
  Statistic: [
    {
      id: 0,
      contractGroupId: 0,
      etcmoneyUsing: 0,
      fuelMoneyUsing: 0,
      extraTimeMoney: 0,
      extraKmMoney: 0,
      paymentAmount: 0,
      insuranceMoney: 0,
      violationMoney: 0,
      total: 0,
    },
  ],
  StatisticCar: [{
    carId: 1,
    parkingLotId: 1,
    carLicensePlates: "",
    carExpenses: [],
    carRevenues: [],
  }],
  error: null,
  loading: false,
};

const StatisticReducer = createSlice({
  name: "Reducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getStatisticContractGr.pending, (state: StatisticState) => {
      state.loading = true;
    });
    builder.addCase(
      getStatisticContractGr.fulfilled,
      (state: StatisticState, action: PayloadAction<StatisticContractResult[]>) => {
        state.Statistic = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(
      getStatisticContractGr.rejected,
      (state: StatisticState, { error }) => {
        if (error.message !== undefined) state.error = error.message;
        state.loading = false;
      }
    );
    builder.addCase(getStatisticCar.pending, (state: StatisticState) => {
      state.loading = true;
    });
    builder.addCase(
      getStatisticCar.fulfilled,
      (state: StatisticState, action: PayloadAction<StatisticCarResult[]>) => {
        state.StatisticCar = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(
      getStatisticCar.rejected,
      (state: StatisticState, { error }) => {
        if (error.message !== undefined) state.error = error.message;
        state.loading = false;
      }
    );
  },
});

export const Actions = StatisticReducer.actions;
export default StatisticReducer.reducer;
export const getStatisticContractGr = createAsyncThunk(
  "StatisticReducer/getStatisticContractGr",
  async (filter: {
    from: Date | Dayjs;
    to: Date | Dayjs;
  }): Promise<StatisticContractResult[]> => {
    try {
      // const to = new Date((filter.to as Date).toLocaleDateString());
     
      const response = await http.get(
        `/statistic/contractGroup?from=${filter.from}&to=${filter.to}`
      );
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;
      throw errors[0].errorMessage;
    }
  }
);
export const getStatisticCar = createAsyncThunk(
  "StatisticReducer/getStatisticCar",
  async (filter: {
    from: Date | Dayjs;
    to: Date | Dayjs;
  }): Promise<StatisticCarResult[]> => {
    try {
      // const to = new Date((filter.to as Date).toLocaleDateString());

      const response = await http.get(
        `/statistic/car?from=${filter.from}&to=${filter.to}`
      );
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;
      throw errors[0].errorMessage;
    }
  }
);