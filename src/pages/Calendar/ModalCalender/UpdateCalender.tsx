

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  styled
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from "uuid";
import * as Yup from "yup";
import { CarIdregistry, getcaractiveAsyncApi, postCarNeedRegistryApi, putCarupdatestatusAsyncApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
import { storage } from '../../../util/FirebaseConfig';
import { CarscheduleResult, postCarscheduleAsyncApi, putCarupdateschedulingstatusAsyncApi } from "../../../redux/CarscheduleReducer/CarscheduleReducer";
import { useAppSelector } from "../../../hooks";
import { getcarStatusAsyncApi } from "../../../redux/CarStatus/CarStatusReducer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Menu, MenuItem, Select, Tooltip } from "@mui/material";
type Props = {}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
export const UpdateCalender = (props: any) => {
  const dispatch: DispatchType = useDispatch();
  const { openDad, error, parentCallback, carId, userDad, event, carStatusId,id } = props;
  const { carStatus } = useAppSelector((state: RootState) => state.carStatus);
  const {  CarActiveResult } = useSelector((state: RootState) => state.CarResult);
  const { Carschedule,showPopup,alertAction,message } = useSelector((state: RootState) => state.Carschedule);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,

  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    carStatusId: 0,
    carMakeName: "",
    seatNumber: 0,
    carColor: "",
    CarModelId: 0,
   
    
  });
  const getAllcarActive = () => {
    const actionAsync = getcaractiveAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      carLicensePlates: searchTerm,
      ...filter,
       parkingLotId:null
    }
    )
    dispatch(actionAsync);
  }
  const getAllCarStatus = () => {
    const actionAsync = getcarStatusAsyncApi();
    dispatch(actionAsync);
  };
  
  const today = dayjs();
  const [maintenanceDate, setmaintenanceDate] = useState(today);
  const handleChange = (newValue: any) => {
    setmaintenanceDate(newValue);
    formik.setFieldValue('dateStart', newValue);
  };
  const [dateEnd, setdateEnd] = useState(today);
  const handleChange1 = (newValue: any) => {
    setdateEnd(newValue);
    formik.setFieldValue('dateEnd', newValue);
  };

  const initialValues = {
    id:id ,
    carId:  carId ,
    carLicensePlates: '',
    dateStart: event?.start ,
    dateEnd: event?.end ,
    carStatusId: carStatusId ,
    carStatusName: event?.title || '',
  };
  const formik = useFormik<CarscheduleResult>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
  
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const { carId:id, carStatusId } = values;
      const actionAsyncUpdateStatus = putCarupdateschedulingstatusAsyncApi(values);
      const actionAsyncUpdate = putCarupdatestatusAsyncApi({ id, carStatusId });
      await Promise.all([dispatch(actionAsyncUpdateStatus), dispatch(actionAsyncUpdate)]);
      setSubmitting(false);
    }
  });
  useEffect(() => {
    if (userDad != null) {
      if (userDad.id !== undefined) {
        formik.setValues(userDad);
      }
    }
    if (userDad === "{}") {
      formik.setValues(initialValues);
    }

    if (!showPopup) {
      formik.setValues(initialValues);
      formik.setTouched({});
    }
    if (id != null && carId !== 0 && carStatusId !== 0 &&  dateEnd != undefined ) {
      formik.setValues({
        ...initialValues,
        id: id,
        carId: carId,
        carStatusId: carStatusId,
      });
    }
    getAllCarStatus();
    getAllcarActive();
    },[showPopup,userDad]);
  
  const handleClose = () => {
    parentCallback(false);
    formik.setValues(initialValues);
    formik.setTouched({});

  };

  const renderuUpdateModalUI = () => {

    const handleCarChange = (event:any) => {
      const { value } = event.target;
      const car = CarActiveResult.cars.find((car) => car.id === value);
    
      formik.setValues((values) => ({
        ...values,
        carId: value,
        carLicensePlates: car ? car.carLicensePlates : "",
      }));
    };
  
  

    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form onSubmit={formik.handleSubmit}>

            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
             Cập nhật lịch
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=" mx-2 gap-2 gap-x-5">
                  <div className="mt-2 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Ngày bắt đầu*"
                            value={formik.values.dateStart}
                            inputFormat="DD/MM/YYYY "
                            disabled
                            onChange={(newValue) =>
                              handleChange(newValue == null ? today : newValue)
                            }
                            minDate={today}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                error={formik.errors.dateStart ? true : undefined}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                      
                      </LocalizationProvider>
                    </div>
                  <div className="mt-2 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Ngày kết thúc*"
                            value={formik.values.dateEnd}
                            inputFormat="DD/MM/YYYY "
                            onChange={(newValue) =>
                              handleChange1(newValue == null ? today : newValue)
                            }
                            minDate={today}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                error={formik.errors.dateStart ? true : undefined}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                      
                      </LocalizationProvider>
                    </div>
                    <div className="mt-2">
                    <FormControl className="w-full mt-2">
                  <InputLabel size="small">Trạng thái</InputLabel>
                  <Select
                  value={formik.values.carStatusId || ""}
                    size="small"
                    labelId="car-status-id-label"
                    id="car-1"
                    name="carStatusId"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.carStatusId &&
                        formik.errors.carStatusId
                        ? true
                        : undefined
                    }
                    label="Trạng thái"
              
                  >
          {carStatus.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                    </div>
                    <div className="mt-2">

                    </div>
                 
              
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit" >
                Cập nhật
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };

  return <>{renderuUpdateModalUI()}</>;
};
