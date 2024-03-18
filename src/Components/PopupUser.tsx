import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useAppSelector } from "../hooks";
import { UserModel } from "../models/userModel";
import { getParkingLotcarAsyncApi } from "../redux/ParkingLotReducer/ParkingLotReducer";
import {
  getProfileAsyncApi,
  getUsertAsyncApi,
  postProfileAsyncApi,
  putProfileAsyncApi,
} from "../redux/UserReducer/userReducer";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { DispatchType, RootState } from "../redux/store";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../util/FirebaseConfig";

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
export const PopupUser = (props: any) => {
  //isAdd == true => Call APi Add
  //isAdd == false => call Api Update
  const {
    openDad,
    parentCallbackAlert,
    parentCallbackMessageAlert,
    parentCallback,
    error,
    userDad,
    isAdd,
    isProfile,
  } = props;
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12 });
  let filter = {
    pagination: pagination,
    searchName: "",
    searchEmail: "",
    searchPhoneNumber: "",
  };
  const getUserAPi = () => {
    const actionAsync = getUsertAsyncApi(filter);
    dispatch(actionAsync);
  };
  const { showPopup, Profile } = useAppSelector(
    (state: RootState) => state.user
  );
  const { ParkingLot } = useAppSelector((state: RootState) => state.ParkingLot);
  const today = dayjs();
  const moment = require("moment");
  const dispatch: DispatchType = useDispatch();
  const getProfileAPi = () => {
    if (Profile?.id != null) {
      const actionAsync = getProfileAsyncApi(Profile.id);
      dispatch(actionAsync);
    }
  };
  const getParkingAPI = () => {
    const actionAsync = getParkingLotcarAsyncApi();
    dispatch(actionAsync);
  };
  const phoneNumberValidation = yup
    .string()
    .matches(/^((\+84)|0)\d{9,10}$/, "Số điện thoại không hợp lệ");
  const [selectedFrontImage, setSelectedFrontImage] = useState<File | null>(null);
  const [selectedImageFrontUrl, setSelectedImageFrontUrl] = useState<string | null>(null);
  const [selectedFrontOption, setSelectedFrontOption] = useState<string | null>(null);

  const handleFileFrontInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFrontOption("file")
      const file2 = event.target.files[0];
      setSelectedFrontImage(file2);
      const url2 = URL.createObjectURL(file2);
      setSelectedImageFrontUrl(url2)
      frmUser.setFieldValue("cardImage", url2);
    }
  };

  const initialValues = {
    id: 0,
    name: "",
    phoneNumber: "",
    job: "",
    currentAddress: "",
    email: "",
    //GPLX: "",
    password: "1",
    role: "",
    citizenIdentificationInfoNumber: "",
    citizenIdentificationInfoAddress: "",
    citizenIdentificationInfoDateReceive: new Date(),
    passportInfoNumber: null,
    passportInfoAddress: null,
    passportInfoDateReceive: null,
    createdDate: new Date(),
    isDeleted: false,
    // passwordHash: null,
    // passwordSalt: null,
    cardImage: "",
    parkingLot: "",
    parkingLotId: 0,
    //Avatar: "",
  };
  const frmUser = useFormik<UserModel>({
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .nullable()
        .required("Tên không được trống!")
        .min(4, "Tên không ít hơn 4 ký tự")
        .max(20, "Tên không dài hơn 20 ký tự"),
      phoneNumber: phoneNumberValidation.required(
        "Điện thoại không được trống!"
      ),

      job: yup.string().required("Nghề nghiệp không được trống!"),
      currentAddress: yup
        .string()
        .nullable()
        .required("Địa chỉ hiện tại không được trống!"),
      email: yup
        .string()
        .nullable()
        .email("email không hợp lệ!")
        .required("email không được để trống!"),
      // GPLX: yup
      //   .string().nullable()
      //   .matches(/^[0-9]{12}$/, "Giấy phép lái xe không hợp lệ!"),
      // password: yup.string().nullable().required("Mật khẩu không được để trống!"),
      role: yup.string().nullable().required("Vị trí không được để trống!"),
      parkingLotId: yup
        .number()
        .when("role", {
          is: "OperatorStaff",
          then: yup.number().required("Điều hành Phải có nơi làm việc").moreThan(0, 'Chọn chi nhánh cho điều hành'),
          otherwise: yup.number().nullable(),
        }),
      citizenIdentificationInfoNumber: yup
        .string()
        .nullable()
        .matches(/^[0-9]{9}$|^[0-9]{12}$/, "CCCD/CMND không hợp lệ!")
        .required("CMND/CCCD không được trống!"),

      citizenIdentificationInfoAddress: yup
        .string()
        .nullable()
        .required("Nơi cấp của CMND/CCCD Không được trống!"),
      citizenIdentificationInfoDateReceive: yup
        .date()
        .nullable()
        .required("Ngày cấp của CMND/CCCD Không được trống!")
        .nullable()
        .typeError("Ngày cấp của CMND/CCCD Không hợp lệ!")
        .max(new Date(), "Ngày cấp của CMND/CCCD không hợp lệ!"),
      passportInfoNumber: yup.string().when("citizenIdentificationInfoNumber", {
        is: (val: any) => val != null,
        then: yup.string().nullable(),
        otherwise: yup
          .string()
          .nullable()
          .required("Hộ chiếu không được trống!")
          .matches(/^[A-Z]{2}\d{7}$/, "Hộ chiếu không hợp lệ!"),
      }),
      passportInfoAddress: yup.string().when("passportInfoNumber", {
        is: (val: any) => val === null,
        then: yup.string().nullable(),
        otherwise: yup
          .string()
          .nullable()
          .required("Nơi cấp của Hộ chiếu Không được trống!"),
      }),

      passportInfoDateReceive: yup.date().when("passportInfoNumber", {
        is: (val: any) => val === null,
        then: yup.date().nullable(),
        otherwise: yup
          .date()
          .nullable()
          .required("Ngày cấp của Hộ chiếu Không được trống!")
          .nullable()
          .typeError("Ngày cấp của Hộ chiếu Không hợp lệ!")
          .max(new Date(), "Ngày cấp của Hộ chiếu Không hợp lệ!"),
      }),
    }),


    onSubmit: async (values: UserModel, { setSubmitting }) => {
      if (isAdd === true) {
        const promises = [];
        if (selectedFrontImage) {
          const frontImageRef = ref(storage, `car/${selectedFrontImage.name + v4()}`);
          const frontSnapshot = uploadBytes(frontImageRef, selectedFrontImage);
          promises.push(frontSnapshot);
          
        }  else {
          values.cardImage = userDad?.cardImage; // Set current URL if no new image selected
        }


        const snapshots = await Promise.all(promises);

        const urls = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        );
        values.cardImage = urls[0];
        const actionAsyncLogin = postProfileAsyncApi({ ...values, parkingLotId: values.role == "OperatorStaff" ? values.parkingLotId : null });
        dispatch(actionAsyncLogin)
          .then((response) => {
            if (response.payload != undefined) {
              frmUser.setValues(initialValues);
              frmUser.setTouched({});
              parentCallback(false);
              getProfileAPi();
              parentCallbackAlert("success");
              getUserAPi()
              parentCallbackMessageAlert("Cập nhật thành công");
            }
          })
          .catch((error) => {
            // Handle failure case
          });
      }
      if (isAdd === false) {
        const promises = [];
        if (selectedFrontImage) {
          const frontImageRef = ref(storage, `car/${selectedFrontImage.name + v4()}`);
          const frontSnapshot = uploadBytes(frontImageRef, selectedFrontImage);
          promises.push(frontSnapshot);
        }  else {
          values.cardImage = userDad?.cardImage; // Set current URL if no new image selected
        }


        const snapshots = await Promise.all(promises);

        const urls = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        );
      
        if (urls[0]) values.cardImage = urls[0];
        const actionAsyncLogin = putProfileAsyncApi({ ...values, parkingLotId: values.role == "OperatorStaff" ? values.parkingLotId : null });
        dispatch(actionAsyncLogin)
          .then((response) => {
            if (response.payload != undefined) {
              frmUser.setValues(initialValues);
              frmUser.setTouched({});
              parentCallback(false);
              getProfileAPi();
              parentCallbackAlert("success");
              getUserAPi()
              parentCallbackMessageAlert("Cập nhật thành công");
            }
          })
          .catch((error) => {
            // Handle failure case
          });
      }
    },
  });

  function handleChangeTime(newTimestart: any) {
    if (newTimestart === null) {
      frmUser.setFieldValue(
        "passportInfoDateReceive",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmUser.setFieldValue(
        "passportInfoDateReceive",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }
  function handleChangeTimeCCCD(newTimestart: any) {
    if (newTimestart === null) {
      frmUser.setFieldValue(
        "citizenIdentificationInfoDateReceive",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmUser.setFieldValue(
        "citizenIdentificationInfoDateReceive",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }
  const handleClose = () => {
    parentCallback(false);
    frmUser.setValues(initialValues);
    frmUser.setTouched({});
  };
  useEffect(() => {
    if (userDad != null) {
      if (userDad.id !== undefined) {
        const {
          passwordHash,
          passwordSalt,
          password,
          receiveContracts,
          rentContracts,
          transferContracts,
          contractGroups,
          appraisalRecords,
          createdDate,
          ...userDadWithoutPassword
        } = userDad;
        frmUser.setValues(userDadWithoutPassword);
      }
    }
    if (userDad === "{}") {
      frmUser.setValues(initialValues);
    }

  }, [openDad]);

  useEffect(() => {
    if (ParkingLot.length == 0) {
      getParkingAPI();
    }
  }, []);
  function handleChangeRole(e: string) {
    frmUser.setFieldValue("role", e);

  }
 

  let viewPass: any;
  if (Profile?.id != frmUser.values.id) {
    viewPass = (
      <div className="h-16 ">
        <TextField
          type="password"
          error={
            frmUser.touched.password && frmUser.errors.password
              ? true
              : undefined
          }
          name="password"
          onChange={frmUser.handleChange}
          onBlur={frmUser.handleBlur}
          fullWidth
          label="Mật khẩu*"
          defaultValue={userDad?.password}
          size="small"
        />
        {frmUser.errors.password && frmUser.touched.password && (
          <div className="text mt-1 text-xs text-red-600 font-semibold">
            {frmUser.errors.password}
          </div>
        )}
      </div>
    );
  }

  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form onSubmit={frmUser.handleSubmit}>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Cập nhật hồ sơ người dùng
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && (
                <div className="text-center text-xl text-red-500 font-semibold mb-2">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 mx-10 gap-5 ">
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
                      value={frmUser.values.name}
                      label="Họ và Tên*"
                      size="small"
                    />
                    {frmUser.errors.name && frmUser.touched.name && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmUser.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="h-16 ">
                    <TextField
                      error={
                        frmUser.touched.phoneNumber &&
                          frmUser.errors.phoneNumber
                          ? true
                          : undefined
                      }
                      name="phoneNumber"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="Số điện thoại*"
                      value={frmUser.values.phoneNumber}
                      size="small"
                    />
                    {frmUser.errors.phoneNumber &&
                      frmUser.touched.phoneNumber && (
                        <div className="text mt-1 text-xs text-red-600 font-semibold">
                          {frmUser.errors.phoneNumber}
                        </div>
                      )}
                  </div>
                  <div className="h-16 ">
                    <TextField
                      error={
                        frmUser.touched.email && frmUser.errors.email
                          ? true
                          : undefined
                      }
                      name="email"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="email*"
                      value={frmUser.values.email}
                      size="small"
                    />
                    {frmUser.errors.email && frmUser.touched.email && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {frmUser.errors.email}
                      </div>
                    )}
                  </div>
                  {viewPass}

                  <div className="h-16 ">
                    <TextField
                      error={
                        frmUser.touched.job && frmUser.errors.job
                          ? true
                          : undefined
                      }
                      name="job"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="Nghề nghiệp*"
                      value={frmUser.values.job}
                      size="small"
                    />
                    {frmUser.errors.job && frmUser.touched.job && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {frmUser.errors.job}
                      </div>
                    )}
                  </div>

                  <div className="h-16 ">
                    <TextField
                      error={
                        frmUser.touched.currentAddress &&
                          frmUser.errors.currentAddress
                          ? true
                          : undefined
                      }
                      name="currentAddress"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="Địa chỉ hiện tại*"
                      value={frmUser.values.currentAddress}
                      size="small"
                    />
                    {frmUser.errors.currentAddress &&
                      frmUser.touched.currentAddress && (
                        <div className="text mt-1 text-xs text-red-600 font-semibold">
                          {frmUser.errors.currentAddress}
                        </div>
                      )}
                  </div>

                </div>
                <div>
                  <div className="h-16 ">
                    <TextField
                      error={
                        frmUser.touched.citizenIdentificationInfoNumber &&
                          frmUser.errors.citizenIdentificationInfoNumber
                          ? true
                          : undefined
                      }
                      name="citizenIdentificationInfoNumber"
                      onChange={frmUser.handleChange}
                      onBlur={frmUser.handleBlur}
                      fullWidth
                      label="CMND/CCCD*"
                      value={frmUser.values.citizenIdentificationInfoNumber}
                      size="small"
                    />
                    {frmUser.errors.citizenIdentificationInfoNumber &&
                      frmUser.touched.citizenIdentificationInfoNumber && (
                        <div className="text mt-1 text-xs text-red-600 font-semibold">
                          {frmUser.errors.citizenIdentificationInfoNumber}
                        </div>
                      )}
                  </div>
                  <div className="h-16 ">
                    <Autocomplete
                      disablePortal
                      value={frmUser.values.citizenIdentificationInfoAddress}
                      onChange={(e, value) =>
                        frmUser.setFieldValue(
                          "citizenIdentificationInfoAddress",
                          value
                        )
                      }
                      onBlur={frmUser.handleBlur}
                      options={dataLocation.map((item) => item.Name)}
                      disableClearable
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          name="citizenIdentificationInfoAddress"
                          error={
                            frmUser.touched.citizenIdentificationInfoAddress &&
                              frmUser.errors.citizenIdentificationInfoAddress
                              ? true
                              : undefined
                          }
                          {...params}
                          label="Nơi cấp*"
                        />
                      )}
                    />
                    {frmUser.errors.citizenIdentificationInfoAddress &&
                      frmUser.touched.citizenIdentificationInfoAddress && (
                        <div className="text mt-1 text-xs text-red-600 font-semibold">
                          {frmUser.errors.citizenIdentificationInfoAddress}
                        </div>
                      )}
                  </div>
                  <div className="h-16 ">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          label="Ngày cấp*"
                          value={
                            frmUser.values.citizenIdentificationInfoDateReceive
                          }
                          inputFormat="DD/MM/YYYY "
                          onChange={(newValue) =>
                            handleChangeTimeCCCD(newValue)
                          }
                          maxDate={today != null ? today : undefined}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              error={
                                frmUser.errors
                                  .citizenIdentificationInfoDateReceive &&
                                  frmUser.touched
                                    .citizenIdentificationInfoDateReceive
                                  ? true
                                  : undefined
                              }
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                    </LocalizationProvider>
                    {frmUser.errors.citizenIdentificationInfoDateReceive && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {
                          frmUser.errors
                            .citizenIdentificationInfoDateReceive as string
                        }
                      </div>
                    )}
                  </div>

                  <div className="h-16 ">
                    <FormControl fullWidth>
                      <InputLabel size="small" id="demo-simple-select-label">Vị trí*</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={frmUser.values.role}
                        onChange={frmUser.handleChange}
                        size="small"
                        onBlur={frmUser.handleBlur}
                        name="role"
                        label="vị trí"
                      >
                        {dataRole.map((model, index) => (
                          <MenuItem key={index} value={model.id}>
                            {model.name}
                          </MenuItem>
                        ))}


                      </Select>
                    </FormControl>
                    {frmUser.errors.role && frmUser.touched.role && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {frmUser.errors.role}
                      </div>
                    )}
                  </div>
                  <div className="h-16 ">
                    <FormControl fullWidth>
                      <InputLabel size="small" id="demo-simple-select-label">Nơi làm việc</InputLabel>
                      <Select
                        size="small"
                        value={frmUser.values.parkingLotId != null ? frmUser.values.parkingLotId : ""}
                        onChange={frmUser.handleChange}
                        onBlur={frmUser.handleBlur}
                        disabled={frmUser.values.role != "OperatorStaff" ? true : false}
                        label="Nơi làm việc"
                        name="parkingLotId"
                      >
                        <MenuItem value={0}>
                          Atshare
                        </MenuItem>
                        {ParkingLot.map((model) => (
                          <MenuItem key={model.id} value={model.id}>
                            {model.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {frmUser.errors.parkingLotId &&
                      frmUser.touched.parkingLotId && (
                        <div className="text mt-1 text-xs text-red-600 font-semibold">
                          {frmUser.errors.parkingLotId}
                        </div>
                      )}
                  </div>
                  <div className="h-16">
                    <FormControl className="mb-2" >
                      <div className="item_box_image1 ">
                        <Button
                          variant="contained"
                          component="label"
                          className="bg-white text-[#1976d2] shadow-none rounded-md "
                        >
                          <AddPhotoAlternateIcon />Ảnh  đại diện *
                          <input
                            type="file"
                            hidden
                            id="image3"
                            onChange={handleFileFrontInputChange}
                          />
                        </Button>
                        {frmUser.touched.cardImage &&
                          frmUser.errors.cardImage && (
                            <div className="text-red-600">
                              {frmUser.errors.cardImage}
                            </div>
                          )}

                        {selectedFrontImage == undefined ? (
                          <img
                            alt=""
                            className="mx-auto h-24 w-24 my-5"
                            src={userDad?.cardImage}
                          />
                        ) : (
                          selectedFrontImage && (
                            <img
                              alt=""
                              className="mx-auto h-24 w-24 my-5"
                              src={
                                selectedFrontImage ? window.URL.createObjectURL(selectedFrontImage) : ''
                              }
                            />
                          )
                        )}
                      </div>
                    </FormControl>


                  </div>

                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit">{isAdd == true ? "Tạo mới" : "Thay đổi"}</Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };
  const dataLocation = [
    { Name: "An Giang" },
    { Name: "Bà Rịa - Vũng Tàu" },
    { Name: "Bắc Giang" },
    { Name: "Bắc Kạn" },
    { Name: "Bạc Liêu" },
    { Name: "Bắc Ninh" },
    { Name: "Bến Tre" },
    { Name: "Bình Định" },
    { Name: "Bình Dương" },
    { Name: "Bình Phước" },
    { Name: "Bình Thuận" },
    { Name: "Cà Mau" },
    { Name: "Cần Thơ" },
    { Name: "Cao Bằng" },
    { Name: "Đà Nẵng" },
    { Name: "Đắk Lắk" },
    { Name: "Đắk Nông" },
    { Name: "Điện Biên" },
    { Name: "Đồng Nai" },
    { Name: "Đồng Tháp" },
    { Name: "Gia Lai" },
    { Name: "Hà Giang" },
    { Name: "Hà Nam" },
    { Name: "Hà Nội" },
    { Name: "Hà Tĩnh" },
    { Name: "Hải Dương" },
    { Name: "Hải Phòng" },
    { Name: "Hậu Giang" },
    { Name: "Hòa Bình" },
    { Name: "Hưng Yên" },
    { Name: "Khánh Hòa" },
    { Name: "Kiên Giang" },
    { Name: "Kon Tum" },
    { Name: "Lai Châu" },
    { Name: "Lâm Đồng" },
    { Name: "Lạng Sơn" },
    { Name: "Lào Cai" },
    { Name: "Long An" },
    { Name: "Nam Định" },
    { Name: "Nghệ An" },
    { Name: "Ninh Bình" },
    { Name: "Ninh Thuận" },
    { Name: "Phú Thọ" },
    { Name: "Quảng Bình" },
    { Name: "Quảng Nam" },
    { Name: "Quảng Ngãi" },
    { Name: "Quảng Ninh" },
    { Name: "Quảng Trị" },
    { Name: "Sóc Trăng" },
    { Name: "Sơn La" },
    { Name: "Tây Ninh" },
    { Name: "Thái Bình" },
    { Name: "Thái Nguyên" },
    { Name: "Thanh Hóa" },
    { Name: "Thừa Thiên Huế" },
    { Name: "Tiền Giang" },
    { Name: "TP. Hồ Chí Minh" },
    { Name: "Trà Vinh" },
    { Name: "Tuyên Quang" },
    { Name: "Vĩnh Long" },
    { Name: "Vĩnh Phúc" },
    { Name: "Yên Bái" },
  ];
  const dataRole = [
    { name: "Sales", id: "SaleStaff" },
    { name: "Thẩm định", id: "ExpertiseStaff" },
    { name: "Điều hành", id: "OperatorStaff" },
    { name: "Admin", id: "Admin" },
  ];

  const CoupomOptionsParking = ParkingLot.length != 0 ? ParkingLot.map((item, index) => ({
    id: item.id,
    label: item.name,
  })) : [{ label: 'The Shawshank Redemption', id: 1 }];
 
  return <>{renderPopupUI()}</>;
};
