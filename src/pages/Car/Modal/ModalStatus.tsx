import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  styled
} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { useAppSelector } from '../../../hooks';
import { CarupdateStaus, putCarupdatestatusAsyncApi } from '../../../redux/CarReducer/CarReducer';
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
export const ModalStatus = (props: any) => {
  const dispatch: DispatchType = useDispatch();
  const { openDad, error, parentCallback, carId,alertAction,userDad,id } = props;
  const {    message, CarResult, showPopup, loading, CarResultDetail } = useSelector((state: RootState) => state.CarResult);
  const { carStatus } = useAppSelector((state: RootState) => state.carStatus);
  const [alert, setAlert] = useState("");

  const initialValues = {
    id: id,
    carStatusId: 0
  
  };
  const formik = useFormik<CarupdateStaus>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({

    }),
    onSubmit: async (values, { setSubmitting }) => {


      const actionAsyncLogin = putCarupdatestatusAsyncApi(values);
      dispatch(actionAsyncLogin)
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
              Thay đổi 
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=" mx-2 gap-2 gap-x-5">
              <FormControl className="w-full mt-2">
                  <InputLabel size="small">Trạng thái</InputLabel>
                  <Select
                  defaultValue={userDad?.carStatusId}
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