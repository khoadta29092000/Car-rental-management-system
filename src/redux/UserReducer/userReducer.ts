import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../../models/userModel";
import { ACCESS_TOKEN, history, http, settings, USER, USER_LOGIN } from "../../util/config";

type userList = {
  users: UserModel[];
  total: number;
};

export interface Changepass {
  userName: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserState {
  Profile: UserModel | null;
  userList: userList;
  userListdetail: userList;
  user: UserModel | null;
  status: boolean;
  error: string | null;
  showPopup: boolean;
  loading: boolean;
  alertAction: string;
  message: string | null;
  changepass: Changepass | null;
}

const initialState: UserState = {
  Profile: null,
  userList: { users: [], total: 0 },
  userListdetail: { users: [], total: 0 },
  user: {
    id: 0,
    name: "",
    phoneNumber: "",
    job: "",
    currentAddress: "",
    email: "",
    //GPLX: "",
    password: "",
    role: "",
    citizenIdentificationInfoNumber: "",
    citizenIdentificationInfoAddress: "",
    citizenIdentificationInfoDateReceive: null,
    passportInfoNumber: null,
    passportInfoAddress: null,
    passportInfoDateReceive: null,
    createdDate: null,
    isDeleted: false,
    // passwordHash: null,
    // passwordSalt: null,
    cardImage: "",
    parkingLot: null,
    parkingLotId: null,
    //Avatar: "",
  },
  status: false,
  error: null,
  showPopup: true,
  loading: false,
  alertAction: "",
  message: null,
  changepass: null,
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userLogin: (state: UserState) => {
      state.status = true;
      history.push("/");
    },
    showPopup: (state: UserState) => {
      state.showPopup = true;
      state.error = null;
    },
    resetUser: (state: UserState) => {
      state.user = state.user = {
        id: 0,
        name: "",
        phoneNumber: "",
        job: "",
        currentAddress: "",
        email: "",
        //GPLX: "",
        password: "",
        role: "",
        citizenIdentificationInfoNumber: "",
        citizenIdentificationInfoAddress: "",
        citizenIdentificationInfoDateReceive: null,
        passportInfoNumber: null,
        passportInfoAddress: null,
        passportInfoDateReceive: null,
        createdDate: null,
        isDeleted: false,
        // passwordHash: null,
        // passwordSalt: null,
        cardImage: "",
        parkingLot: null,
        parkingLotId: null,
        //Avatar: "",
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(getUsertAsyncApi.pending, (state: UserState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(
      getUsertAsyncApi.fulfilled,
      (state: UserState, action: any) => {
        state.loading = false;
        state.userList = action.payload;
      }
    );
    builder.addCase(
      getUsertAsyncApi.rejected,
      (state: UserState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(getUserdetailtAsyncApi.pending, (state: UserState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(
      getUserdetailtAsyncApi.fulfilled,
      (state: UserState, action: any) => {
        state.loading = false;
        state.userListdetail = action.payload;
      }
    );
    builder.addCase(
      getUserdetailtAsyncApi.rejected,
      (state: UserState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );


    builder.addCase(getProfileAsyncApi.pending, (state: UserState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(
      getProfileAsyncApi.fulfilled,
      (state: UserState, action: PayloadAction<UserModel>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(
      getProfileAsyncApi.rejected,
      (state: UserState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(getProfileByEmailAsyncApi.pending, (state: UserState) => {
      state.loading = true;
      state.alertAction = "";
    });
    builder.addCase(
      getProfileByEmailAsyncApi.fulfilled,
      (state: UserState, action: PayloadAction<UserModel>) => {
        state.loading = false;
        state.Profile = action.payload;
        settings.setStorageJson(USER, action.payload);
        settings.setCookieJson(USER, action.payload, 30);
      }
    );
    builder.addCase(
      getProfileByEmailAsyncApi.rejected,
      (state: UserState, { error }) => {
        state.loading = false;
        if (error.message) state.error = error.message;
      }
    );
    builder.addCase(putProfileAsyncApi.pending, (state: UserState) => {
      state.alertAction = "";
      state.message = "";
    });
    builder.addCase(
      putProfileAsyncApi.fulfilled,
      (state: UserState, action: PayloadAction<UserModel>) => {
        state.user = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Cập nhật thành công";
        state.error = null;
      }
    );
    builder.addCase(
      putProfileAsyncApi.rejected,
      (state: UserState, { error }) => {
        // state.loading = false;
        // state.showPopup = false;
        // state.alertAction = "error";
        if (error.message) state.error = error.message;
        // state.message = "Cập nhật thất bại";
      }
    );
    builder.addCase(postProfileAsyncApi.pending, (state: UserState) => {
      state.alertAction = "";
      state.message = "";
      state.error = null;
    });
    builder.addCase(
      postProfileAsyncApi.fulfilled,
      (state: UserState, action: PayloadAction<UserModel>) => {
        state.error = null;
        state.user = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Tạo mới thành công";
      }
    );
    builder.addCase(
      postProfileAsyncApi.rejected,
      (state: UserState, { error }) => {
        //state.showPopup = false;
        //state.alertAction = "error";
        if (error.message) state.error = error.message;

        //state.message = "Tạo mới thất bại";
      }
    );
    builder.addCase(deleteProfileAsyncApi.pending, (state: UserState) => {
      state.loading = true;
      state.alertAction = "";
      state.message = "";
    });
    builder.addCase(
      deleteProfileAsyncApi.fulfilled,
      (state: UserState, action: PayloadAction<UserModel>) => {
        state.loading = false;
        state.user = action.payload;
        state.showPopup = false;
        state.alertAction = "success";
        state.message = "Xóa thành công";
      }
    );
    builder.addCase(
      deleteProfileAsyncApi.rejected,
      (state: UserState, { error }) => {
        state.loading = false;
        state.alertAction = "error";
        if (error.message) state.error = error.message;
        state.message = "Xóa thất bại";
      }
    );
    builder.addCase(putchangepassAsyncApi.pending, (state: UserState) => {
      state.loading = true;
      state.alertAction = "";
      state.message = "";
    });



    builder.addCase(putchangepassAsyncApi.fulfilled, (state: UserState, action: PayloadAction<Changepass>) => {
      state.loading = false;
      state.changepass = action.payload
      state.showPopup = false;
      state.alertAction = "success";
      state.message = "Đổi mật khẩu  thành công";
      settings.eraseCookie(ACCESS_TOKEN);
      settings.eraseCookie(USER_LOGIN);
      settings.clearStorage(ACCESS_TOKEN);
      settings.clearStorage(USER_LOGIN);
      sessionStorage.clear();
      history.push("/");
      window.location.reload();
    });
    builder.addCase(
      putchangepassAsyncApi.rejected,
      (state: UserState, { error }) => {
        if (error.message !== undefined)
          state.error = error.message;

        window.location.reload();
      }
    );
  },
});

export const userAction = userReducer.actions;
export default userReducer.reducer;
export const getUsertAsyncApi = createAsyncThunk(
  "userReducer/getUserAsyncApi",
  async (filter: {
    pagination: {
      page: number;
      pageSize: number;
    };
    searchName: string;
    searchEmail: string;
    searchPhoneNumber: string;
    parkingLotId?: number | null;
  }): Promise<any> => {
    try {
      const response = await http.get(
        `/User?Name=${filter.searchName}&Email=${filter.searchEmail}&PhoneNumber=${filter.searchPhoneNumber}&parkingLot=${filter.parkingLotId}&page=${filter.pagination.page}&pageSize=${filter.pagination.pageSize}`
      );

      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getUserdetailtAsyncApi = createAsyncThunk(
  "userReducer/getUserdetailtAsyncApi",
  async (filter: {
    pagination: {
      page: number;
      pageSize: number;
    };
    searchName: string;
    searchEmail: string;
    searchPhoneNumber: string;
    parkingLotId?: number | null;
  }): Promise<any> => {
    try {
      const response = await http.get(
        `/User?Name=${filter.searchName}&Email=${filter.searchEmail}&PhoneNumber=${filter.searchPhoneNumber}&parkingLotId=${filter.parkingLotId}&page=${filter.pagination.page}&pageSize=${filter.pagination.pageSize}`
      );

      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);



export const getProfileAsyncApi = createAsyncThunk(
  "userReducer/getProfileAsyncApi",
  async (user: number): Promise<UserModel> => {
    try {
      const response = await http.get(`/User/${user}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const getProfileByEmailAsyncApi = createAsyncThunk(
  "userReducer/getProfileByEmailAsyncApi",
  async (user: string): Promise<UserModel> => {
    try {
      const response = await http.get(`user/email/${user}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putProfileAsyncApi = createAsyncThunk(
  "userReducer/putProfileAsyncApi",
  async (user: UserModel): Promise<UserModel> => {
    try {
      const response = await http.put(`/User/update-info/${user?.id}`, user);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;

      throw errors[0].errorMessage;
    }
  }
);
export const postProfileAsyncApi = createAsyncThunk(
  "userReducer/postProfileAsyncApi",
  async (user: UserModel): Promise<UserModel> => {
    try {
      const response = await http.post(`/User/create`, user);
      return response.data;
    } catch (error: any) {
      const json = error.response.data;
      const errors = json[""].errors;

      throw errors[0].errorMessage;
    }
  }
);
export const deleteProfileAsyncApi = createAsyncThunk(
  "userReducer/deleteProfileAsyncApi",
  async (id: number): Promise<UserModel> => {
    try {
      const response = await http.put(`/user/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
export const putchangepassAsyncApi = createAsyncThunk(
  "userReducer/changepassAsyncApi",
  async (values: Changepass): Promise<Changepass> => {
    try {
      const response = await http.put("/password-change", values);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);
