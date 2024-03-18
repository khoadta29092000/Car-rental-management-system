import { AppraisalRecordModel } from "../../models/AppraisalRecordModel";
import { http } from "../../util/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface AppraisalRecordResultState {
    AppraisalRecord: AppraisalRecordModel;
    statusAppraisalRecord: boolean;
    AppraisalRecordListHistory: AppraisalRecordModel[];
    message: string | null;
    alertAction: string;

}

const initialState: AppraisalRecordResultState = {
    AppraisalRecord: {
        id: 0,
        carId: 0,
        contractGroupId: 1,
        expertiserId: 1,
        expertiseDate: null,
        resultOfInfo: false,
        resultOfCar: false,
        resultDescription: "",
        depositInfoCarRental: 0,
        depositInfoDownPayment: 0,
        //filePath: null
    },
    statusAppraisalRecord: false,
    AppraisalRecordListHistory: [],
    message: null,
    alertAction: "",
};

const AppraisalRecordReducer = createSlice({
    name: "AppraisalRecordReducer",
    initialState,
    reducers: {
        deleteAppraiselAction: (state: AppraisalRecordResultState) => {
            state.AppraisalRecord = {
                id: 0,
                carId: 0,
                contractGroupId: 1,
                expertiserId: 1,
                expertiseDate: null,
                resultOfInfo: false,
                resultOfCar: false,
                resultDescription: "",
                depositInfoCarRental: 0,
                depositInfoDownPayment: 0,
                //filePath: null,
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(
            postAppraisalRecordReducerAsyncApi.pending,
            (state: AppraisalRecordResultState) => {
                state.alertAction = "";
                state.message = "";
            }
        );
        builder.addCase(
            postAppraisalRecordReducerAsyncApi.fulfilled,
            (
                state: AppraisalRecordResultState,
                action: PayloadAction<AppraisalRecordModel[]>
            ) => {
                state.statusAppraisalRecord = !state.statusAppraisalRecord
                state.alertAction = "success";
                state.message = "Yêu cầu bổ sung thành công";
            }
        );
        builder.addCase(
            postAppraisalRecordReducerAsyncApi.rejected,
            (state: AppraisalRecordResultState, { error }) => {
                state.alertAction = "error";
                state.message = "Cập nhật Yêu cầu bổ sung";
            });
        builder.addCase(
            getByIdAppraisalRecordReducerAsyncApi.pending,
            (state: AppraisalRecordResultState) => { }
        );
        builder.addCase(
            getByIdAppraisalRecordReducerAsyncApi.fulfilled,
            (
                state: AppraisalRecordResultState,
                action: PayloadAction<AppraisalRecordModel>
            ) => {
                state.AppraisalRecord = action.payload;

            }
        );
        builder.addCase(
            getListHistoryAppraisalRecordReducerAsyncApi.rejected,
            (state: AppraisalRecordResultState, { error }) => { }
        );
        builder.addCase(
            getListHistoryAppraisalRecordReducerAsyncApi.pending,
            (state: AppraisalRecordResultState) => { }
        );
        builder.addCase(
            getListHistoryAppraisalRecordReducerAsyncApi.fulfilled,
            (
                state: AppraisalRecordResultState,
                action: PayloadAction<AppraisalRecordModel[]>
            ) => {
                state.AppraisalRecordListHistory = action.payload;
            }
        );
        builder.addCase(
            getByIdAppraisalRecordReducerAsyncApi.rejected,
            (state: AppraisalRecordResultState, { error }) => { }
        );
        builder.addCase(putAppraisalRecordReducerAsyncApi.pending, (state: AppraisalRecordResultState) => {

        });
        builder.addCase(
            putAppraisalRecordReducerAsyncApi.fulfilled,
            (state: AppraisalRecordResultState, action: PayloadAction<AppraisalRecordModel>) => {
                state.statusAppraisalRecord = !state.statusAppraisalRecord
            }
        );
        builder.addCase(
            putAppraisalRecordReducerAsyncApi.rejected,
            (state: AppraisalRecordResultState, { error }) => {

            }
        );
        builder.addCase(putStatusAppraisalRecordReducerAsyncApi.pending, (state: AppraisalRecordResultState) => {

        });
        builder.addCase(
            putStatusAppraisalRecordReducerAsyncApi.fulfilled,
            (state: AppraisalRecordResultState, action: PayloadAction<AppraisalRecordModel>) => {
                state.statusAppraisalRecord = !state.statusAppraisalRecord
            }
        );
        builder.addCase(
            putStatusAppraisalRecordReducerAsyncApi.rejected,
            (state: AppraisalRecordResultState, { error }) => {

            }
        );
    },
});
export const AppraisalRecordAction = AppraisalRecordReducer.actions;
export default AppraisalRecordReducer.reducer;
export const postAppraisalRecordReducerAsyncApi = createAsyncThunk(
    "AppraisalRecordReducer/postAppraisalRecordReducerAsyncApi",
    async (AppraisalRecord: AppraisalRecordModel): Promise<AppraisalRecordModel[]> => {
        try {

            const response = await http.post(`appraisalrecord/create`, AppraisalRecord);
            return response.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
);
export const getListHistoryAppraisalRecordReducerAsyncApi = createAsyncThunk(
    "AppraisalRecordReducer/getListHistoryAppraisalRecordReducerAsyncApi",
    async (id: number): Promise<any> => {
        try {
            const response = await http.get(
                `/appraisalrecord/get-by-contractGroupId/${id}`
            );
            return response.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
);
export const getByIdAppraisalRecordReducerAsyncApi = createAsyncThunk(
    "AppraisalRecordReducer/getByIdAppraisalRecordReducerAsyncApi",
    async (id: number): Promise<any> => {
        try {
            const response = await http.get(
                `/appraisalrecord/last/contractGroupId/${id}`
            );
            return response.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
);
export const putAppraisalRecordReducerAsyncApi = createAsyncThunk(
    "AppraisalRecordReducer/putAppraisalRecordReducerAsyncApi",
    async (AppraisalRecord: AppraisalRecordModel): Promise<AppraisalRecordModel> => {
        try {
            const response = await http.put(`appraisalrecord/update/${AppraisalRecord?.id}`, AppraisalRecord);
            return response.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
);
export const putStatusAppraisalRecordReducerAsyncApi = createAsyncThunk(
    "AppraisalRecordReducer/putStatusAppraisalRecordReducerAsyncApi",
    async (AppraisalRecord: any) => {
        try {
            const response = await http.put(`appraisalrecord/update-status/${AppraisalRecord?.id}`, AppraisalRecord);
            return response.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
);