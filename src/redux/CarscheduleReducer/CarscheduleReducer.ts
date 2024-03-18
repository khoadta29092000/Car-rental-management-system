import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config'; 
import dayjs, { Dayjs } from "dayjs";
export interface CarscheduleResult {
    id:            number | null;
    carId:         number ;
    dateStart:     Date | Dayjs | null | undefined ;
    dateEnd:       Date | Dayjs | null | undefined;
    carStatusId:   number;
    carStatusName: string ;
    carLicensePlates: string ;
}
export interface CarscheduleState {
  Carschedule: CarscheduleResult[],
  CarscheduleDetail: CarscheduleResult | null,
  status: boolean;
  error: string | null;
  showPopup: boolean;
  loading: boolean;
  alertAction: string;
  message: string | null;
   }
   const initialState : CarscheduleState = {
    Carschedule : [],
    CarscheduleDetail:null,
    status: false,
    error: null,
    showPopup: true,
    loading: false,
    alertAction: "",
    message: null,
   }
   
   const CarscheduleReducer = createSlice({
       name: 'CarscheduleReducer',
       initialState,
       reducers: {
        showPopup: (state: CarscheduleState) => {
          state.showPopup = true;
        }
      },
       extraReducers(builder) {
         builder.addCase(getCarscheduleAsyncApi.fulfilled, (state:CarscheduleState,action:PayloadAction< CarscheduleResult[]>) => {
           state.Carschedule = action.payload
       });  
       builder.addCase(postCarscheduleAsyncApi.pending, (state: CarscheduleState) => {
        state.loading = true;
        state.alertAction = "";
        state.message = "";
      });
      builder.addCase(
        postCarscheduleAsyncApi.fulfilled,
        (state: CarscheduleState, action: PayloadAction<CarscheduleResult>) => {
            state.loading = false;
          state.CarscheduleDetail = action.payload;
          state.showPopup = false;
          state.alertAction = "success";
          state.message = "Tạo thành công";
          
        }
      );
      builder.addCase(
        postCarscheduleAsyncApi.rejected,
        (state: CarscheduleState, { error }) => {
          state.loading = false;
          if (error.message) state.error = error.message;
        }
      );
       builder.addCase(getcarscheduleByIdAsyncApi.pending, (state: CarscheduleState) => {
        state.loading = true;
        state.alertAction = "";
        state.message = "";
      });
      builder.addCase(
        getcarscheduleByIdAsyncApi.fulfilled,
        (state: CarscheduleState, action: PayloadAction<CarscheduleResult>) => {
            state.loading = false;
          state.CarscheduleDetail = action.payload;
          state.showPopup = false;
          state.alertAction = "success";
          state.message = "Cập nhật thành công";
          
        }
      );
      builder.addCase(
        getcarscheduleByIdAsyncApi.rejected,
        (state: CarscheduleState, { error }) => {
          state.loading = false;
          if (error.message) state.error = error.message;
        }
      );
       builder.addCase(putCarupdateschedulingstatusAsyncApi.pending, (state: CarscheduleState) => {
        state.loading = true;
        state.alertAction = "";
        state.message = "";
      });
      builder.addCase(
        putCarupdateschedulingstatusAsyncApi.fulfilled,
        (state: CarscheduleState, action: PayloadAction<CarscheduleResult>) => {
            state.loading = false;
          state.CarscheduleDetail = action.payload;
          state.showPopup = false;
          state.alertAction = "success";
          state.message = "Cập nhật thành công";
          
        }
      );
      builder.addCase(
        putCarupdateschedulingstatusAsyncApi.rejected,
        (state: CarscheduleState, { error }) => {
          state.loading = false;
          if (error.message) state.error = error.message;
        }
      );
     }
     });
     export const CarscheduleAction = CarscheduleReducer.actions
     export default CarscheduleReducer.reducer
     export const getCarscheduleAsyncApi = createAsyncThunk(
         'CarscheduleReducer/getCarscheduleAsyncApi',
         async ( ): Promise<CarscheduleResult[]> => {
             try {
                 const response = await http.get(`carschedule/all`);
                 return response.data;
                
             } catch (error: any) {
                 
                 throw error.response.data;
             }
     
         }
     );
     export const postCarscheduleAsyncApi = createAsyncThunk(
        "CarscheduleReducer/postCarscheduleAsyncApi",
        async (Carschedule: CarscheduleResult): Promise<CarscheduleResult> => {
          try {
            const response = await http.post(`carschedule/create`, Carschedule);
            return response.data;
          } catch (error: any) {
            const json = error.response.data;
            const errors = json[""].errors;
            throw errors[0].errorMessage;
          }
        }
      );
      export const getcarscheduleByIdAsyncApi = createAsyncThunk(
        "carReducer/getcarscheduleByIdAsyncApi",
        async (id: string): Promise<CarscheduleResult> => {
          try {
            const response = await http.get(`/carschedule/carId/${id}`);
            return response.data;
          } catch (error: any) {
            throw error.response.data;
          }
        }
      );
      export const putCarupdateschedulingstatusAsyncApi = createAsyncThunk(
        "carReducer/putCarupdateschedulingstatusAsyncApi",
        async (CarscheduleDetail: CarscheduleResult): Promise<CarscheduleResult> => {
          try {
            const response = await http.put(
              `/carschedule/update/${CarscheduleDetail.id}`,
              CarscheduleDetail
            );
            return response.data;
          } catch (error: any) {
            // const json = error.response.data;
            // const errors = json[""].errors;
            throw error.response.data;
          }
        }
      );