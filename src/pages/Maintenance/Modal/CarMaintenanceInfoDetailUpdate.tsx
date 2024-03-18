

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
import FormControl from '@mui/material/FormControl';
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
import { useDispatch } from 'react-redux';
import { v4 } from "uuid";
import * as Yup from "yup";
import { useAppSelector } from '../../../hooks';
import { CarIdMantance, putCarMantaiceAsyncApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
import { storage } from '../../../util/FirebaseConfig';
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
export const CarMaintenanceInfoDetailUpdate = (props: any) => {
  const dispatch: DispatchType = useDispatch();
  const { openDad, error, parentCallback, userDad, carId, id,parentCallbackAlert,parentCallbackMessageAlert } = props;
  const { showPopup } = useAppSelector((state: RootState) => state.CarResult);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageRightUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedOption("file");
  //     const file3 = event.target.files[0];
  //     setSelectedImage(file3);
  //     const url3 = URL.createObjectURL(file3)
  //     setSelectedImageUrl(url3)
  //     formik.setFieldValue("maintenanceInvoice", url3);

  //   }
  // };
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
  
      // check if file is a valid image type
      const fileType = file.type;
      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        parentCallbackAlert('error');
        parentCallbackMessageAlert('Chỉ nhận ảnh');
        return;
      }
  
      setSelectedOption('file');
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setSelectedImageUrl(url);
      formik.setFieldValue('maintenanceInvoice', url);
    }
  };
  const initialValues = {
    id: id,
    carId: carId,
    carKmlastMaintenance: 0,
    kmTraveled: null,
    maintenanceDate: new Date(),
    maintenanceInvoice: "string",
    maintenanceAmount: 0,
  };
  const formik = useFormik<CarIdMantance>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      carKmlastMaintenance: Yup.number()
        .typeError(' Số km bảo dưỡng lần cuối cùng là số')
        .positive(' Số km bảo dưỡng lần cuối cùng không  để trống')
        .integer(' Số km bảo dưỡng lần cuối cùng để trống')
        .required(" Số km bảo dưỡng lần cuối cùng để trống"),
      maintenanceAmount: Yup.number()
        .typeError('Tiền bảo trì  là số')
        .positive('Tiền bảo trì không để trống')
        .integer('Tiền bảo trì không để trống')
        .required("Tiền bảo trì không để trống"),
    }),



    onSubmit: async (values, { setSubmitting }) => {
      try {
        const promises = [];


        if (selectedImage) {
          const rightImageRef = ref(storage, `images/${selectedImage.name + v4()}`);
          const rightSnapshot = uploadBytes(rightImageRef, selectedImage);
          promises.push(rightSnapshot);
        }else {
          values.maintenanceInvoice = userDad?.maintenanceInvoice; // Set current URL if no new image selected
        }

        const snapshots = await Promise.all(promises);

        const urls = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        );
        if (urls[0]) values.maintenanceInvoice = urls[0];
    
        const actionAsyncLogin = putCarMantaiceAsyncApi(values);
        dispatch(actionAsyncLogin)
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });
  const today = dayjs();
  const [maintenanceDate, setmaintenanceDate] = useState(today);
  const handleChange = (newValue: any) => {
    setmaintenanceDate(newValue);
    formik.setFieldValue('maintenanceDate', newValue);
  };
  useEffect(() => {
    if (userDad != null) {
      if (userDad.id !== undefined) {
        formik.setValues(userDad);
      }
    }
    if (userDad === "{}") {
      formik.setValues(initialValues);
    }

    if (showPopup == false) {
      formik.setValues(initialValues);
      formik.setTouched({});
    }
  }, [showPopup, openDad]);
  const handleClose = () => {
    parentCallback(false);
    formik.setValues(initialValues);
    formik.setTouched({});

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
              Cập nhật tin bảo trì
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=" mx-2 gap-2 gap-x-5">
                <div className="w-full mt-2 ">
                  <TextField
                    defaultValue={userDad?.carKmlastMaintenance || ""}
                    size="small"
                    id="outlined-basic1"
                    label="Định mức bảo trì(Km)"
                    name="carKmlastMaintenance"

                    fullWidth
                    onChange={formik.handleChange}
                    error={
                      formik.touched.carKmlastMaintenance && formik.errors.carKmlastMaintenance
                        ? true
                        : undefined
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.carKmlastMaintenance && formik.touched.carKmlastMaintenance ? (
                    <div className="text-red-600">{formik.errors.carKmlastMaintenance}</div>
                  ) : null}
                </div>


                <div className="w-full mt-2 ">
                  <TextField
                    type="number"
                    defaultValue={userDad?.maintenanceAmount}

                    size="small"
                    id="outlined-basic16"
                    label="Tiền bảo trì  "
                    name="maintenanceAmount"

                    fullWidth
                    onChange={formik.handleChange}
                    error={
                      formik.touched.maintenanceAmount && formik.errors.maintenanceAmount
                        ? true
                        : undefined
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.maintenanceAmount && formik.touched.maintenanceAmount ? (
                    <div className="text-red-600">{formik.errors.maintenanceAmount}</div>
                  ) : null}
                </div>
                <div className="mt-2 ">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        label="Ngày bảo trì*"
                        value={userDad?.maintenanceDate}
                        inputFormat="DD/MM/YYYY "
                        onChange={(newValue) =>
                          handleChange(newValue == null ? today : newValue)
                        }
                        disabled
                        minDate={today}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            error={formik.errors.maintenanceDate ? true : undefined}
                            {...params}
                          />
                        )}
                      />
                    </Stack>

                  </LocalizationProvider>
                </div>

                <FormControl className="mb-2">
                  <div className="item_box_image ">
                    <div className="image-option1">

                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon />Hóa đơn bảo trì *
                        <input
                          type="file"
                          hidden
                          id="image1"
                          onChange={handleFileInputChange}
                        />
                      </Button>
                    </div>

                    {formik.touched.maintenanceInvoice &&
                      formik.errors.maintenanceInvoice && (
                        <div className="text-red-600">
                          {formik.errors.maintenanceInvoice}
                        </div>
                      )}
                    {selectedImage == undefined ? (
                      <img
                        alt=""
                        className=" h-24 w-24 my-5"
                        src={userDad?.maintenanceInvoice}
                      />
                    ) : (
                      selectedImage && (
                        <img
                          alt=""
                          className=" h-24 w-24 my-5"
                          src={
                            selectedImageRightUrl ? window.URL.createObjectURL(selectedImage) : ''
                          }
                        />
                      )
                    )}
                  </div>
                </FormControl>







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
