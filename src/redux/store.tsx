import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import LoginReducer from './LoginReducer/LoginReducer';
import RentContractReducer from './RentContractReducer/RentContractReducer';
import SignupReducer from './SignupReducer/SignupReducer';
import userReducer from './UserReducer/userReducer';
import CarMakeReducer from './CarMakeReducer/CarMakeReducer'
import CarGenerationReducer from './CarGenerationReducer/CarGenerationReducer'
import CarTrimReducer from './CarTrimReducer/CarTrimReducer'
import CarSerieReducer from './CarSeriesReducer/CarSeriesReducer'
import CarModelReducer from './CarModelReducer/CarModelReducer'
import ParkingLotReducer from './ParkingLotReducer/ParkingLotReducer'
import CarReducer from './CarReducer/CarReducer'
import carFileReducer from './CarFileReducer/CarFileReducer'
import CarLoanInfoReducer from './CarLoanInfoReducer/CarLoanInfoReducer'
import CarStateInfoReducer from './CarStateReducer/CarStateReducer'
import CarTrackingReducer from './CarTrackingReducer/CarTrackingReducer'
import ContractgroupReducer from './ContractgroupReducer/ContractgroupReducer';
import CarStatusReducer from './CarStatus/CarStatusReducer';
import CarscheduleReducer from './CarscheduleReducer/CarscheduleReducer';
import AppraisalRecordReducer from './AppraisalRecordReducer/AppraisalRecordReducer';
import TransferContractReducer from './TransferContractReducer/TransferContractReducer';
import ReceiveContractReducer from './ReceiveContractReducer/ReceiveContractReducer';
import CustomerinfoReducer from './CustomerinfoReducer/CustomerinfoReducer';
import StatisticReducer from './StatisticReducer/StatisticReducer'

export const store = configureStore({
  reducer: {
    login: LoginReducer,
    signup: SignupReducer,
    user: userReducer,
    rentContract: RentContractReducer,
    carMake: CarMakeReducer,
    CarGeneration: CarGenerationReducer,
    CarTrim: CarTrimReducer,
    CarSeries: CarSerieReducer,
    CarModel: CarModelReducer,
    ParkingLot: ParkingLotReducer,
    CarResult: CarReducer,
    carStatus: CarStatusReducer,
    CarFile: carFileReducer,
    CarLoanInfoResult: CarLoanInfoReducer,
    CarStateResult: CarStateInfoReducer,
    CarTrackingfoResult: CarTrackingReducer,
    ContractGroup: ContractgroupReducer,
    Carschedule: CarscheduleReducer,
    AppraisalRecord: AppraisalRecordReducer,
    TransferContract: TransferContractReducer,
    ReceiveContract: ReceiveContractReducer,
    customerinfo:CustomerinfoReducer,
    Statistic: StatisticReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>

export type DispatchType = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

