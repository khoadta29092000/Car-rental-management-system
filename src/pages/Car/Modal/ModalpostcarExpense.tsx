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
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { CarExpense, postCarExpenseApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
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
export const ModalpostcarExpense = (props: any) => {
  const dispatch: DispatchType = useDispatch();
  const { openDad, error, parentCallback, carId,alertAction } = props;
  const {    message, CarResult, showPopup, loading, CarResultDetail } = useSelector((state: RootState) => state.CarResult);
  const [alert, setAlert] = useState("");

  const initialValues = {
      carId:carId,
      title:"",
      day: new Date(),
      amount: 0,
  };
  const formik = useFormik<CarExpense>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required(" nội dung Không được trống!"),
      amount: Yup.number()
        .typeError('Tiền  là số')
        .positive('Tiền  không để trống')
        // .integer('Tiền bảo trì không để trống')
        .required("Tiền  không để trống"),
    }),
    onSubmit: async (values, { setSubmitting }) => {


      const actionAsyncLogin = postCarExpenseApi(values);
      dispatch(actionAsyncLogin)
      setSubmitting(false);

    }
  });


  useEffect(() => {
    if (alertAction !== "") {
      setAlert(alertAction);
    }
    if (!showPopup) {
      formik.setValues(initialValues);
      formik.setTouched({});
    }
  
  }, [showPopup, openDad]);
  const today = dayjs();
  const [day, setday] = useState(today);
 
  const handleClose = () => {
    parentCallback(false);
    formik.setValues(initialValues);
    formik.setTouched({});

  };
  const [amount,setamout]=useState('')

  const handlamountChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setamout(formattedValue);
    formik.setFieldValue('amount', numericValue);

  };


  const handleChange = (newValue: any) => {
   setday(newValue);
   formik.setFieldValue('day', newValue);
 };



  const renderuUpdateModalUI = () => {



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
              Thêm mới chi phí xe
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=" mx-2 gap-2 gap-x-5">


              <div className="w-full mt-2 ">
                    <TextField
                     
                      value={formik.values.title || ""}
                      size="small"
                      id="outlined-basic1"
                      label="Nội dung"
                      name="title"
                    
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.title && formik.errors.title
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.title && formik.touched.title ? (
                      <div className="text-red-600">{formik.errors.title}</div>
                    ) : null}
                  </div>
              <div className="w-full mt-2 ">
                    <TextField
                    //  type='number'
                      value={amount || ""}
                      size="small"
                      id="outlined-basic1"
                      label="Tiền*"
                      name="amount"
                    
                      fullWidth
                      onChange={handlamountChange}
                      error={
                        formik.touched.amount && formik.errors.amount
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.amount && formik.touched.amount ? (
                      <div className="text-red-600">{formik.errors.amount}</div>
                    ) : null}
                  </div>
                  <div className="mt-2 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Ngày*"
                            value={formik.values.day}
                            inputFormat="DD/MM/YYYY "
                            onChange={(newValue) =>
                              handleChange(newValue == null ? today : newValue)
                            }
                            // minDate={today}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                error={formik.errors.day ? true : undefined}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                      
                      </LocalizationProvider>
                    </div>









              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit" >
                Thêm mới
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };

  return <>{renderuUpdateModalUI()}</>;
};