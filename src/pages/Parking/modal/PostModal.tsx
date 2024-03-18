import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  styled
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";


import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import { useAppSelector } from "../../../hooks";
import { ParkingLotResult, postparkinglotAsyncApi } from "../../../redux/ParkingLotReducer/ParkingLotReducer";
import { DispatchType, RootState } from "../../../redux/store";
import { storage } from "../../../util/FirebaseConfig";

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
export const PostModal = (props: any) => {

  const { openDad, parentCallback, error,parentCallbackAlert,parentCallbackMessageAlert } = props;

  const { showPopup } = useAppSelector((state: RootState) => state.user);
  const today = dayjs();
  const moment = require("moment");
  const dispatch: DispatchType = useDispatch();

  const [selectedLeftOption, setSelectedLeftOption] = useState<string | null>(null);
  const [selectedleftImage, setSelectedLeftImage] = useState<File | null>(null);
  const [selectedImageleftUrl, setSelectedImageLeftUrl] = useState<string | null>(null);
  // const handleFileLeftInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedLeftOption("file");
  //     const file1 = event.target.files[0];
  //     setSelectedLeftImage(file1);
  //     const url1 = URL.createObjectURL(file1);
  //     setSelectedImageLeftUrl(url1)
  //     frmUser.setFieldValue("parkingLotImg", url1);
  //   }
  // };
  const handleFileLeftInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileType = file.type;
  
      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        parentCallbackAlert("error");
        parentCallbackMessageAlert("Chỉ nhận ảnh");
  
        return;
      }
  
      setSelectedLeftOption("file");
      setSelectedLeftImage(file);
      const url = URL.createObjectURL(file);
      setSelectedImageLeftUrl(url);
      frmUser.setFieldValue("parkingLotImg", url);
    }
  };

  const initialValues = {
    id: 0,
    name: "",
    phoneNumber: "",
    address: "",
    longitude: "",
    latitude: "",
    managerName: "",
    parkingLotImg: "",
    cars: [],
  };
  const frmUser = useFormik<ParkingLotResult>({
    initialValues: initialValues,
    validationSchema: yup.object().shape({

      address: yup.string().required("Địa chỉ không được để trống "),
      name: yup.string().required(" Tên không được để trống "),

      parkingLotImg: yup.mixed().required("Ảnh không được để trống!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const promises = [];
        if (selectedleftImage) {
          const leftImageRef = ref(storage, `images/${selectedleftImage.name + v4()}`);
          const leftSnapshot = await uploadBytes(leftImageRef, selectedleftImage);
          const leftImageUrlPromise = getDownloadURL(leftSnapshot.ref);
          promises.push(leftImageUrlPromise);
        }
        const urls = await Promise.all(promises);

        values.parkingLotImg = urls[0];

        const actionAsyncparking = postparkinglotAsyncApi(values);
        dispatch(actionAsyncparking);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    parentCallback(false);
    frmUser.setValues(initialValues);
    frmUser.setTouched({});
  };
  useEffect(() => {
    if (showPopup === false) {
      frmUser.setValues(initialValues);
      frmUser.setTouched({});
    }
  }, [openDad, showPopup]);


  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form onSubmit={frmUser.handleSubmit}>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Thêm Bãi đổ xe
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=" mx-10 gap-5 ">
                <div className="">
                  <div className="h-16">
                    <TextField
                      error={
                        frmUser.touched.name && frmUser.errors.name
                          ? true
                          : undefined
                      }
                      name="name"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="Bãi xe*"
                      size="small"
                    />
                    {frmUser.errors.name && frmUser.touched.name && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmUser.errors.name}
                      </div>
                    )}
                  </div>
                
                




                </div>
              
                <div className="h-16 ">
                    <TextField
                      error={
                        frmUser.touched.address && frmUser.errors.address
                          ? true
                          : undefined
                      }
                      name="address"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="Địa chỉ *"
                      size="small"
                    />
                    {frmUser.errors.address && frmUser.touched.address && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {frmUser.errors.address}
                      </div>
                    )}
                  </div>
                <div>
                <div >
                    <div className="h-16">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md"
                      >
                        <AddPhotoAlternateIcon />Ảnh của bãi đổ xe

                        <input type="file" hidden id="image3" onChange={handleFileLeftInputChange} />

                      </Button>
                      <Button
                        variant="contained"
                        className="bg-white text-[#1976d2] shadow-none rounded-md ml-2"
                        onClick={() => setSelectedLeftOption("camera")}
                      >

                      </Button>
                    </div>
                    {frmUser.touched.parkingLotImg && frmUser.errors.parkingLotImg && (
                      <div className="text-red-600">{frmUser.errors.parkingLotImg}</div>
                    )}
                    {selectedleftImage && (
                      <img
                        alt=""
                        className="mx-auto h-24 w-24 my-5"
                        src={
                          selectedImageleftUrl ? window.URL.createObjectURL(selectedleftImage) : ''
                        }
                      />
                    )}
                  </div>
                 
                </div>
                <div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit">Thêm mới</Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };

  return <>{renderPopupUI()}</>;
};
