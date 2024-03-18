import { Car } from "../../models/Car";
import { http } from "../../util/config";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";

type carandtotal = {
  cars: Car[];
  total: number;
};
export interface CarIdregistry {
  id: number | null;
  carId: number;
  registrationDeadline: Date | Dayjs | null | undefined;
  registryAmount: number;
  registryInvoice: string;
  registryAddress: string;
  certificateRegistryDocument: string;
}
export interface CarupdateStaus {
  id: number | null;
  carStatusId:number;
}

export interface CarExpense {
  carId:  number;
  title:  string;
  day: Date | Dayjs | null | undefined;
  amount: number;
}

export interface CarIdMantance {
  id: number | null;
  carId: number;
  carKmlastMaintenance: number;
  kmTraveled: number | null;
  maintenanceDate: Date | Dayjs | null | undefined;
  maintenanceInvoice: string;
  maintenanceAmount: number;
}

export interface carResultState {

  CarResult: carandtotal,
  CarActiveResult: carandtotal,
  carmaitance: carandtotal,
  CarNeedRegistry: carandtotal,

  //  carmaitancedetail:Car,
  //  carIdmaitancedetail:CarIdMantance,
  CarIdMantance: CarIdMantance;
  CarIdregistry: CarIdregistry;
  CarupdateStaus:CarupdateStaus;
  CarResultDetail: Car;
  carSelect: Car | null;
  status: boolean;
  error: string | null;
  showPopup: boolean;
  loading: boolean;
  alertAction: string;
  message: string | null;
  CarExpense: CarExpense,
CarExpenseDetail:CarExpense | null,
}

const initialState: carResultState = {
  CarResult: {
    cars: [],
    total: 1,
  },
  CarActiveResult: {
    cars: [],
    total: 1,

  },
  carmaitance: {
    cars: [],
    total: 1,
  },
  CarNeedRegistry: {
    cars: [],
    total: 1,
  },
  status: false,
  error: null,
  showPopup: true,
  loading: false,
  alertAction: "",
  message: null,
  CarExpense : {
    carId:  0,
title:"",
day: null,
amount: 0,
  },
CarExpenseDetail:null,
  CarIdMantance: {
    id: 1,
    carId: 0,
    carKmlastMaintenance: 0,
    kmTraveled: 0,
    maintenanceDate: null,
    maintenanceInvoice: "",
    maintenanceAmount: 0,
  },
  CarIdregistry: {
    id: 0,
    carId: 0,
    registrationDeadline: null,
    registryAmount: 0,
    registryInvoice: "",
    registryAddress: "",
    certificateRegistryDocument: "",
  },
  CarupdateStaus:{
    id: 0,
    carStatusId:0,
  },
  CarResultDetail: {
    id: 0,
    parkingLotId: 1,
    carStatus: "",
    carId: 0,
    carStatusId: null,
    modelYear: 0,
    carLicensePlates: "",
    seatNumber: 1,
    carMakeId: "",
    carModelId: "",
    carGenerationId: "",
    carSeriesId: "",
    carTrimId: "",
    makeName: null,
    modelName: "",
    generationName: "",
    seriesName: "",
    trimName: "",
    generationYearBegin: null,
    generationYearEnd: null,
    trimStartProductYear: null,
    trimEndProductYear: null,
    carDescription: "",
    createdDate: null,
    isDeleted: true,
    carColor: "",
    carFuel: "",
    priceForNormalDay: 0,
    priceForWeekendDay: 0,
    priceForMonth: 0,
    limitedKmForMonth: 0,
    overLimitedMileage: 0,
    carStatusDescription: "",
    currentEtcAmount: 0,
    fuelPercent: 0,
    speedometerNumber: 0,
    carOwnerName: "",
    rentalMethod: "",

    speedometerNumberReceive: 0,
    priceForDayReceive: 0,
    //priceForDayReceive: "",
    priceForMonthReceive: 0,
    insurance: true,
    limitedKmForMonthReceive: 1,
    overLimitedMileageReceive: 1,
    frontImg: "",
    backImg: "",
    leftImg: "",
    rightImg: "",
    ortherImg: "",
    linkTracking: "http://dinhvi.vn/",
    trackingUsername: "",
    trackingPassword: "",
    etcusername: "",
    etcpassword: "",
    periodicMaintenanceLimit: 0,
    carFileCreatedDate: null,
    rentalDate: null,
    linkForControl: null,
    paymentMethod: null,
    forControlDay: null,
    dayOfPayment: null,
    carSchedules: null,
    parkingLotName: null,
    registrationDeadline: null,
    carKmLastMaintenance: 0,
    ownerSlitRatio: 0,
    kmTraveled: 0,
    maintenanceDate: null,
    maintenanceInvoice: "",
    maintenanceAmount: 0,
    carMakeName: null,
    carModelName: null,
    carGenerationName: null,
    carSeriesName: null,
    carTrimName: null,
    tankCapacity:0,
  },
  carSelect: null,
};
const carReducer = createSlice({
  name: "CarReducer",
  initialState,
  reducers: {
    showPopup: (state: carResultState) => {
      state.showPopup = true;
      state.error = null;
    },
    actionSelectCar: (state: carResultState, action) => {
      state.carSelect = action.payload;
    },
    resetCar: (state: carResultState) => {
      state.CarResultDetail = {
        id: 0,
        parkingLotId: 1,
        carStatus: "",
        carId: 0,
        carStatusId: null,
        modelYear: 0,
        carLicensePlates: "",
        seatNumber: 1,
        carMakeId: "",
        carModelId: "",
        carGenerationId: "",
        carSeriesId: "",
        carTrimId: "",
        makeName: null,
        modelName: "",
        generationName: "",
        seriesName: "",
        trimName: "",
        generationYearBegin: null,
        generationYearEnd: null,
        trimStartProductYear: null,
        trimEndProductYear: null,
        carDescription: "",
        createdDate: null,
        isDeleted: true,
        carColor: "",
        carFuel: "",
        priceForNormalDay: 0,
        priceForWeekendDay: 0,
        priceForMonth: 0,
        limitedKmForMonth: 0,
        overLimitedMileage: 0,
        carStatusDescription: "",
        currentEtcAmount: 0,
        fuelPercent: 0,
        speedometerNumber: 0,
        carOwnerName: "",
        rentalMethod: "",
        speedometerNumberReceive: 0,
        priceForDayReceive: 0,
        //priceForDayReceive: "",
        priceForMonthReceive: 0,
        insurance: true,
        limitedKmForMonthReceive: 1,
        overLimitedMileageReceive: 1,
        frontImg: "",
        backImg: "",
        leftImg: "",
        rightImg: "",
        ortherImg: "",
        linkTracking: "http://dinhvi.vn/",
        trackingUsername: "",
        trackingPassword: "",
        etcusername: "",
        etcpassword: "",
        periodicMaintenanceLimit: 0,
        carFileCreatedDate: null,
        rentalDate: null,
        linkForControl: null,
        paymentMethod: null,
        forControlDay: null,
        dayOfPayment: null,
        carSchedules: null,
        parkingLotName: null,
        registrationDeadline: null,
        carKmLastMaintenance: 0,
        ownerSlitRatio: 0,
        kmTraveled: null,
        maintenanceDate: null,
        maintenanceInvoice: "",
        maintenanceAmount: 0,
        carMakeName: null,
        carModelName: null,
        carGenerationName: null,
        carSeriesName: null,
        carTrimName: null,
        tankCapacity:0,
      };
      state.carSelect = null;
    },
  },

  extraReducers(builder) {
    builder.addCase(getcarAsyncApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
    });

    builder.addCase(
      getcarAsyncApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarResult = action.payload;
      }
    );
    builder.addCase(getcarAsyncApi.rejected, (state: carResultState) => { });

    builder.addCase(putCarAsyncApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
      state.message = "";
    });
    builder.addCase(
      putCarAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<Car>) => {
        state.loading = false;
        state.CarResultDetail = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Cập nhật thành công";
      }
    );
    builder.addCase(
      putCarAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        state.showPopup = false;
        state.alertAction = "error";
        if (error.message) state.error = error.message;
        state.message = "Cập nhật thất bại";
      }
    );

    builder.addCase(postCarAsyncApi.pending, (state: carResultState) => {
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      postCarAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<Car>) => {
        state.loading = false;
        state.CarResultDetail = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Tạo mới thành công";
      }
    );
    builder.addCase(
      postCarAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(postCarExcelAsyncApi.pending, (state: carResultState) => {

    });
    builder.addCase(
      postCarExcelAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<Car>) => {

      }
    );
    builder.addCase(
      postCarExcelAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );


    builder.addCase(deleteCarAsyncApi.pending, (state: carResultState) => {
      //state.loading = true;
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      deleteCarAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<Car>) => {
        state.loading = false;
        state.CarResultDetail = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Xóa thành công";
      }
    );
    builder.addCase(
      deleteCarAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        state.alertAction = "error";
        if (error.message) state.error = error.message;
        state.message = "Xóa thất bại";
      }
    );



    builder.addCase(getCarByIdAsyncApi.fulfilled, (state: carResultState, action: PayloadAction<Car>) => {
      state.CarResultDetail = action.payload
    });
    builder.addCase(getCarByIdAsyncApi.rejected, (state: carResultState) => {

    });
    builder.addCase(getneedmaintainceApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(
      getneedmaintainceApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.carmaitance = action.payload;
      }
    );
    builder.addCase(
      getneedmaintainceApi.rejected,
      (state: carResultState) => { }
    );
    builder.addCase(
      getcarmaintenanceinfoByIdAsyncApi.pending,
      (state: carResultState) => {
        state.loading = true;
        state.alertAction = "";
      }
    );
    builder.addCase(
      getcarmaintenanceinfoByIdAsyncApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarIdMantance = action.payload;
      }
    );
    builder.addCase(
      getcarmaintenanceinfoByIdAsyncApi.rejected,
      (state: carResultState) => { }
    );
    builder.addCase(
      postcarmaintenanceAsyncApi.pending,
      (state: carResultState) => {
        state.alertAction = "";
        state.message = "";
        state.error = null;
      }
    );
    builder.addCase(
      postcarmaintenanceAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<CarIdMantance>) => {
        state.loading = false;
        state.CarIdMantance = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Tạo mới thành công";
      }
    );
    builder.addCase(
      postcarmaintenanceAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(
      getcarIdmaintenanceinfoByIdAsyncApi.pending,
      (state: carResultState) => {
        state.loading = true;
        state.alertAction = "";
      }
    );

    builder.addCase(
      getcarIdmaintenanceinfoByIdAsyncApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarIdMantance = action.payload;
      }
    );
    builder.addCase(
      getcarIdmaintenanceinfoByIdAsyncApi.rejected,
      (state: carResultState) => { }
    );
    builder.addCase(putCarMantaiceAsyncApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
      state.message = "";
    });
    builder.addCase(
      putCarMantaiceAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<CarIdMantance>) => {
        state.loading = false;
        state.CarIdMantance = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Cập nhật thành công";
      }
    );
    builder.addCase(
      putCarMantaiceAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        state.showPopup = false;
        state.alertAction = "error";
        if (error.message) state.error = error.message;
        state.message = "Cập nhật thất bại";
      }
    );

    builder.addCase(getCarNeedRegistryApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(
      getCarNeedRegistryApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarNeedRegistry = action.payload;
      }
    );
    builder.addCase(
      getCarNeedRegistryApi.rejected,
      (state: carResultState) => { }
    );

    builder.addCase(getcCarNeedRegistryApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
    });

    builder.addCase(
      getcCarNeedRegistryApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarIdregistry = action.payload;
      }
    );
    builder.addCase(
      getcCarNeedRegistryApi.rejected,
      (state: carResultState) => { }
    );
    builder.addCase(postCarNeedRegistryApi.pending, (state: carResultState) => {
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      postCarNeedRegistryApi.fulfilled,
      (state: carResultState, action: PayloadAction<CarIdregistry>) => {
        state.loading = false;
        state.CarIdregistry = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Tạo mới thành công";
      }
    );
    builder.addCase(
      postCarNeedRegistryApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(
      putCarNeedRegistryApi.rejected,
      (state: carResultState) => { }
    );

    builder.addCase(putCarNeedRegistryApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
      state.message = "";
    });
    builder.addCase(
      putCarNeedRegistryApi.fulfilled,
      (state: carResultState, action: PayloadAction<CarIdregistry>) => {
        state.loading = false;
        state.CarIdregistry = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Cập nhật thành công";
      }
    );

    builder.addCase(getcaractiveAsyncApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
    });

    builder.addCase(
      getcaractiveAsyncApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarActiveResult = action.payload;
      }
    );
    builder.addCase(getcaractiveAsyncApi.rejected, (state: carResultState) => { });

    builder.addCase(putCarupdatestatusAsyncApi.pending, (state: carResultState) => {
      state.loading = true;
      state.alertAction = "";
      state.message = "";
    });
    builder.addCase(
      putCarupdatestatusAsyncApi.fulfilled,
      (state: carResultState, action: PayloadAction<CarupdateStaus>) => {
        state.loading = false;
        state.CarupdateStaus = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Cập nhật thành công";
      }
    );
    builder.addCase(
      putCarupdatestatusAsyncApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        state.showPopup = false;
        state.alertAction = "error";
        if (error.message) state.error = error.message;
        state.message = "Cập nhật thất bại";
      }
    );
    builder.addCase(
      getCarExpenseReducerByIdAsyncApi.pending,
      (state: carResultState) => {
        state.loading = true;
       
      }
    );

    builder.addCase(
      getCarExpenseReducerByIdAsyncApi.fulfilled,
      (state: carResultState, action: any) => {
        state.loading = false;
        state.CarExpenseDetail = action.payload;
      }
    );
    builder.addCase(
      getCarExpenseReducerByIdAsyncApi.rejected,
      (state: carResultState) => { }
    );

    builder.addCase(postCarExpenseApi.pending, (state: carResultState) => {
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      postCarExpenseApi.fulfilled,
      (state: carResultState, action: PayloadAction<CarExpense>) => {
        state.loading = false;
        state.CarExpense = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Tạo mới thành công";
      }
    );
    builder.addCase(
      postCarExpenseApi.rejected,
      (state: carResultState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
  },
});

export const carAction = carReducer.actions;
export default carReducer.reducer;

export const getcarAsyncApi = createAsyncThunk(
  "carReducer/carReducer",
  async (pagination: {
    page: number;
    pageSize: number;
    carStatusId?: number;
    carLicensePlates?: string;
    seatNumber?: number | null;
    carMakeName?: string | null;
    carColor?: string | null;
    CarModelId?: number;
    parkingLotId?: number | null;
  }): Promise<Car[]> => {
    try {
      let url = `car/all?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      // const response = await http.get(`car/all?page=${pagination.page}&pageSize=${pagination.pageSize}`);
      if (pagination.carStatusId) {
        url += `&carStatusId=${pagination.carStatusId}`;
      }
      if (pagination.carLicensePlates) {
        url += `&carLicensePlates=${pagination.carLicensePlates}`;
      }
      if (pagination.seatNumber) {
        url += `&seatNumber=${pagination.seatNumber}`;
      }
      if (pagination.carMakeName) {
        url += `&carMakeName=${pagination.carMakeName}`;
      }

      if (pagination.carColor) {
        url += `&carColor=${pagination.carColor}`;
      }
      if (pagination.CarModelId) {
        url += `&CarModelId=${pagination.CarModelId}`;
      }
      if (pagination.parkingLotId) {
        url += `&parkingLotId=${pagination.parkingLotId}`;
      }
      const response = await http.get(url);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putCarAsyncApi = createAsyncThunk(
  "carReducer/putCarAsyncApi",
  async (CarResultDetail: Car): Promise<Car> => {
    try {
      const response = await http.put(
        `/car/update/${CarResultDetail.id}`,
        CarResultDetail
      );
      return response.data;
    } catch (error: any) {
      // const json = error.response.data;
      // const errors = json[""].errors;
      throw error.response.data;
    }
  }
);

export const getCarByIdAsyncApi = createAsyncThunk(
  "carReducer/getCarByIdAsyncApi",
  async (id: string): Promise<Car> => {
    try {
      const response = await http.get(`/car/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const postCarAsyncApi = createAsyncThunk(
  "carReducer/postCarAsyncApi",
  async (CarResultDetail: Car): Promise<Car> => {
    try {
      const response = await http.post(`car/create`, CarResultDetail);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;
      throw errors[0].errorMessage;
    }
  }
);
export const postCarExcelAsyncApi = createAsyncThunk(
  "carReducer/createbyexcel",
  async (CarResultDetail: Car): Promise<Car> => {
    try {
      const response = await http.post(`car/createbyexcel`, CarResultDetail);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;
      throw errors[0].errorMessage;
    }
  }
);


export const deleteCarAsyncApi = createAsyncThunk(
  "carReducer/deleteCarAsyncApi",
  async (id: number): Promise<Car> => {
    try {
      const response = await http.put(`/car/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const getneedmaintainceApi = createAsyncThunk(
  "carReducer/getneedmaintainceApi",
  async (pagination: { page: number; pageSize: number;parkingLotId?: number | null; }): Promise<Car[]> => {
    try {
      let url = `/car/need-maintenance?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      // const response = await http.get(`car/all?page=${pagination.page}&pageSize=${pagination.pageSize}`);
     
      if (pagination.parkingLotId) {
        url += `&parkingLotId=${pagination.parkingLotId}`;
      }

      const response = await http.get(url);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const getcarmaintenanceinfoByIdAsyncApi = createAsyncThunk(
  "carReducer/getcarmaintenanceinfoByIdAsyncApi",
  async (id: string): Promise<Car> => {
    try {
      const response = await http.get(`/carmaintenanceinfo/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getcarIdmaintenanceinfoByIdAsyncApi = createAsyncThunk(
  "carReducer/getcarIdmaintenanceinfoByIdAsyncApi",
  async (carId: string): Promise<Car> => {
    try {
      const response = await http.get(
        `/carmaintenanceinfo/get-by-carId/${carId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const postcarmaintenanceAsyncApi = createAsyncThunk(
  "carReducer/postcarmaintenanceAsyncApi",
  async (CarIdMantance: CarIdMantance): Promise<CarIdMantance> => {
    try {
      const response = await http.post(
        `carmaintenanceinfo/create`,
        CarIdMantance
      );
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;

      throw errors[0].errorMessage;
    }
  }
);
export const putCarMantaiceAsyncApi = createAsyncThunk(
  "carReducer/putCarMantaiceAsyncApi",
  async (CarIdMantance: CarIdMantance): Promise<CarIdMantance> => {
    try {

      const response = await http.put(`/carmaintenanceinfo/update/${CarIdMantance.id}`, CarIdMantance);
      return response.data;
    } catch (error: any) {
      // const json = error.response.data;
      // const errors = json[""].errors;
      throw error.response.data;
    }
  }
);

export const getCarNeedRegistryApi = createAsyncThunk(
  "carReducer/getCarNeedRegistryApi",
  async (pagination: {
    page: number;
    pageSize: number;
    parkingLotId?: number | null;
  }): Promise<Car[]> => {
    try {
      let url = `/car/need-registry?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      // const response = await http.get(`car/all?page=${pagination.page}&pageSize=${pagination.pageSize}`);
     
      if (pagination.parkingLotId) {
        url += `&parkingLotId=${pagination.parkingLotId}`;
      }

      const response = await http.get(url);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
//     try {
//       const response = await http.get(`/car/need-registry`);

//       return response.data;
//     } catch (error: any) {
//       throw error.response.data;
//     }
//   }
// );
export const getcCarNeedRegistryApi = createAsyncThunk(
  "carReducer/getcCarNeedRegistryApi",
  async (carId: string): Promise<CarIdregistry> => {
    try {
      const response = await http.get(`/carregistryinfo/get-by-carId/${carId}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postCarNeedRegistryApi = createAsyncThunk(
  "carReducer/postCarNeedRegistryApi",
  async (CarIdregistry: CarIdregistry): Promise<CarIdregistry> => {
    try {
      const response = await http.post(`carregistryinfo/create`, CarIdregistry);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;

      throw errors[0].errorMessage;
    }
  }
);
export const putCarNeedRegistryApi = createAsyncThunk(
  "carReducer/putCarNeedRegistryApi",
  async (CarIdregistry: CarIdregistry): Promise<CarIdregistry> => {
    try {
      const response = await http.put(
        `/carregistryinfo/update/${CarIdregistry.id}`,
        CarIdregistry
      );
      return response.data;
    } catch (error: any) {
      // const json = error.response.data;
      // const errors = json[""].errors;
      throw error.response.data;
    }
  }
);


export const getcaractiveAsyncApi = createAsyncThunk(
  "carReducer/getcaractiveAsyncApi",
  async (pagination: {
    page: number;
    pageSize: number;
    carStatusId?: number;
    carLicensePlates?: string;
    seatNumber?: number | null;
    carMakeName?: string | null;
    carColor?: string | null;
    CarModelId?: number;
    parkingLotId?: number | null;
    DateStart?: Date;
    DateEnd? : Date;
  }): Promise<Car[]> => {
    try {
      let url = `car/active?page=${pagination.page}&pageSize=${pagination.pageSize}`;
      // const response = await http.get(`car/all?page=${pagination.page}&pageSize=${pagination.pageSize}`);
      if (pagination.parkingLotId) {
        url += `&parkingLotId=${pagination.parkingLotId}`;
      }
      if (pagination.carStatusId) {
        url += `&carStatusId=${pagination.carStatusId}`;
      }
      if (pagination.carLicensePlates) {
        url += `&carLicensePlates=${pagination.carLicensePlates}`;
      }
      if (pagination.seatNumber) {
        url += `&seatNumber=${pagination.seatNumber}`;
      }
      if (pagination.carMakeName) {
        url += `&carMakeName=${pagination.carMakeName}`;
      }

      if (pagination.carColor) {
        url += `&carColor=${pagination.carColor}`;
      }
      if (pagination.CarModelId) {
        url += `&CarModelId=${pagination.CarModelId}`;
      }  
      if (pagination.DateStart) {
        url += `&DateStart=${pagination.DateStart}`;
      }
      if (pagination.DateEnd) {
        url += `&DateEnd=${pagination.DateStart}`;
      }

      const response = await http.get(url);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putCarupdatestatusAsyncApi = createAsyncThunk(
  "carReducer/putCarupdatestatusAsyncApi",
  async (CarupdateStaus: CarupdateStaus): Promise<CarupdateStaus> => {
    try {
      const response = await http.put(
        `/car/update-status/${CarupdateStaus.id}`,
        CarupdateStaus
      );
      return response.data;
    } catch (error: any) {
      // const json = error.response.data;
      // const errors = json[""].errors;
      throw error.response.data;
    }
  }
);
export const getCarExpenseReducerByIdAsyncApi = createAsyncThunk(
  "CarExpenseAction/getCarExpenseReducerByIdAsyncApi",
  async (carId: string): Promise<CarExpense> => {
    try {
      const response = await http.get(
        `/carExpense/carId/${carId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const postCarExpenseApi = createAsyncThunk(
  "CarExpenseAction/postCarExpenseApi",
  async (CarExpense: CarExpense): Promise<CarExpense> => {
    try {
      const response = await http.post(`carExpense/create`, CarExpense);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;

      throw errors[0].errorMessage;
    }
  }
);