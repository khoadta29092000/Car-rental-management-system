import React, { useCallback, useEffect, useState } from "react";

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
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useFormik } from "formik";
import 'react-html5-camera-photo/build/css/index.css';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { Car } from "../../../models/Car";
import { getCarGenerationAsyncApi } from "../../../redux/CarGenerationReducer/CarGenerationReducer";
import { getCarModelcarAsyncApi } from "../../../redux/CarModelReducer/CarModelReducer";
import { postCarAsyncApi } from "../../../redux/CarReducer/CarReducer";
import { getcarSeriAsyncApi } from "../../../redux/CarSeriesReducer/CarSeriesReducer";
import { getCarTrimcarAsyncApi } from "../../../redux/CarTrimReducer/CarTrimReducer";
import { DispatchType, RootState } from "../../../redux/store";
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


export const Modal = (props: any) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const [showPassword1, setShowPassword1] = React.useState(false);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const { openDad, error, parentCallback } = props;
  const { alertAction, message, CarResult, showPopup, loading, CarResultDetail } = useSelector((state: RootState) => state.CarResult);
  const today = dayjs();
  
  const minDate = today.subtract(7, 'day'); 
  const { carMake } = useSelector((state: RootState) => state.carMake); //r
  const { CarGeneration } = useSelector((state: RootState) => state.CarGeneration
  ); // đời xe
  const { CarTrim } = useSelector((state: RootState) => state.CarTrim); //r
  const { CarSeries } = useSelector((state: RootState) => state.CarSeries); //r
  const { carModels } = useSelector((state: RootState) => state.CarModel); //tên xe
  const { ParkingLot } = useSelector((state: RootState) => state.ParkingLot)
  const [messageAlert, setMessageAlert] = useState("");
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  const [alert, setAlert] = useState("");
  const [rentalDate, setRentalDate] = useState(today);
  const [registrationDeadline, setregistrationDeadline] =useState(today.add(1, 'day'));
  const dispatch: DispatchType = useDispatch();
  const param = useParams()


  const getAllCarModel = useCallback((carMakeId: number) => {
    const actionAsync = getCarModelcarAsyncApi(carMakeId);
    dispatch(actionAsync);
  }, [dispatch]);
  
  const getAllCarGenration = useCallback((carModelId: number) => {
    const actionAsync = getCarGenerationAsyncApi(carModelId);
    dispatch(actionAsync);
  }, [dispatch]);
  
  const getAllCarSeri = useCallback((carModelId: number, carGenerationId: number) => {
    const actionAsync = getcarSeriAsyncApi({ carModelId, carGenerationId });
    dispatch(actionAsync);
  }, [dispatch]);
  
  const getAllCarTrim = useCallback((carModelId: number, carSeriesId: number) => {
    const actionAsync = getCarTrimcarAsyncApi({ carModelId, carSeriesId });
    dispatch(actionAsync);
  }, [dispatch]);

  // const { date } = useAppSelector((state: RootState) => state.rentContract);
  const [rend, setRend] = useState(false);
  const [insurance, setinsurance] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };



  const seatNumber = [
    4,
    5,
    7,
  ];
  const carcolor = [
    'Đỏ',
    'Xanh',
    'Tím',
    'Vàng',
    'trắng',
    'xám',
    'xanh lá'
  ];
  const CarFuel = [
    'Xăng ',
    'Dầu ',
    'Điện',
  ];

  const rentalMethod = [
    'Ủy Thác Ngày ',
    'Thuê Khô ',

  ];
 

  const modelYear = [
    2022,
    2021,
    2020,
    2019,
    2018,
    2017,
  ];
  const handleClickinsurance = () => {
    setinsurance(!insurance);
  }
  const handleClickRend = () => {
    setRend(!rend);
  };
  const moment = require("moment");

  const handleChange = (newValue: any) => {
    setRentalDate(newValue);
    formik.setFieldValue('rentalDate', newValue);
  };
  const handleChange1 = (newValue: any) => {
    setregistrationDeadline(newValue);
    formik.setFieldValue('registrationDeadline', newValue);
  };
  const FILE_SIZE_LIMIT = 1000000;
  // const [timeStart] = useState(new Date());

  const initialValues = {
    carStatus: null,
    carStatusId: null,
    id: 1,
    parkingLotId: 0,
    carId: 0,
    modelYear: 0,
    carLicensePlates: "",
    seatNumber: 0,
    carMakeId: "",
    carModelId: "",
    carGenerationId: "",
    carSeriesId: "",
    carTrimId: "",
    makeName: null,
    modelName: null,
    parkingLotName: null,
    generationName: null,
    seriesName: null,
    trimName: null,
    generationYearBegin: null,
    generationYearEnd: null,
    trimStartProductYear: null,
    trimEndProductYear: null,
    carDescription: "",
    createdDate: new Date(),
    isDeleted: false,
    carColor: "",
    carFuel: "",
    priceForNormalDay: 0,
    priceForWeekendDay: 0,
    priceForMonth: 0,
    limitedKmForMonth: 0,
    overLimitedMileage: 0,
    carStatusDescription: "string",
    currentEtcAmount: 0,
    fuelPercent: 0,
    speedometerNumber: 0,
    carOwnerName: "",
    rentalMethod: "",
    speedometerNumberReceive: 0,
    priceForDayReceive: 0,
    priceForMonthReceive: 0,
    insurance: true,
    limitedKmForMonthReceive: 0,
    overLimitedMileageReceive: 0,
   
    frontImg: "",
    backImg: "",
    leftImg: "",
    rightImg: "",
    ortherImg: "",
    linkTracking: "http://dinhvi.vn/",
    trackingUsername: "",
    trackingPassword: "",
    etcusername: "",
    etcpassword: "",
    carFileCreatedDate: new Date(),
    rentalDate: rentalDate,
    linkForControl: null,
    paymentMethod: null,
    forControlDay: null,
    dayOfPayment: null,
    carSchedules: null,
    periodicMaintenanceLimit: 0,
    registrationDeadline:registrationDeadline,
    carKmLastMaintenance:0,
    ownerSlitRatio:0,
    kmTraveled:null,
    maintenanceDate:null,
    maintenanceInvoice:"",
    maintenanceAmount:null,
    carMakeName: null,
    carModelName: null,
    carGenerationName: null,
    carSeriesName: null,
    carTrimName: null,
    tankCapacity:0
  };
  const formik = useFormik<Car>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      parkingLotId: Yup.number().required("Bãi xe Không được trống!").positive("Bãi xe Không được trống!"),
      modelYear: Yup.number().positive("Năm sản xuất không để trống!").required("Năm sản xuất Không được trống!"),
      carMakeId: Yup.string().required("Hãng xe Không được trống!"),
      carModelId: Yup.string().required("Tên xe Không được trống!"),
      carSeriesId: Yup.string().required("Kiểu dáng Không được trống!"),
      carGenerationId: Yup.string().required("Phiên bản Không được trống!"),
      carColor: Yup.string().required("Màu xe Không được trống!"),
      carFuel: Yup.string().required("Nhiên Liệu Không được trống!"),
      carTrimId: Yup.string().required("Truyền động Không được trống!"),

      seatNumber: Yup.number().required("Số ghế Không được trống!").positive("Số ghế không để trống!"),
      periodicMaintenanceLimit: Yup.number().positive("Định mức bảo trì không được để trống!").required("Định mức bảo trì không được để trống!"),
      rentalMethod: Yup.string().required("Hình thức thuê không được để trống!"),
      carOwnerName: Yup.string().required("Tên không được để trống!"),
      carKmLastMaintenance: Yup.number()
      .typeError('Số km bảo trì lần cuối phải là số')
      .positive('Số km bảo trì lần cuối không được để trống')
      .integer('Số km bảo trì lần cuối không được để trống')
      .required('Số km bảo trì lần cuối không được để trống').max(10000000000,"Số km bảo trì lần cuối không lớn hơn 10000000000"),
      
      // rentalDate: Yup.date()
      //   .required("ngày thuê không được trống!")
      //   .nullable()
      //   .typeError("Ngày thuê Không hợp lệ!")
      //   .min(new Date(), "Ngày thuê Không hợp lệ!"),
        registrationDeadline:Yup.date()
        .required("Hạn cuối đăng kiểm không được trống!")
        .nullable()
        .typeError("Ngày thuê Không hợp lệ!")
        .min(new Date(), "Hạn cuối đăng kiểm Không hợp lệ!"),
      speedometerNumberReceive: Yup.number()
        .typeError('Số km ngày nhận phải là số')
        .positive('Số km ngày nhận không được để trống')
        .integer('Số km ngày nhận không được để trống').max(1000000000,"Số km ngày nhận không lớn hơn 1000000000")
        .required('Số km ngày nhận không được để trống').test('speedometerMatch', 'Số km ngày nhận khác với số đồng hồ cập nhật lần cuối', function(value) {
          return value === this.parent.speedometerNumber;
        }),
        // .oneOf([Yup.ref('speedometerNumber')], 'Số km và Số km nhận không giống nhau'),
      limitedKmForMonthReceive: Yup.number()
        .typeError('Giới hạn số km trong tháng phải là số')
        .positive('Giới hạn số km trong tháng không được để trống')
        .integer('Giới hạn số km trong tháng không được để trống').max(1000000000,"Giới hạn số km trong tháng không lớn hơn 1000000000")
        .required("Giới hạn số km trong tháng không được để trống"),
      overLimitedMileageReceive: Yup.number()
      .typeError('Phí vượt km trong tháng phải là số')
      .positive('Phí vượt km trong tháng không để trống')
      .integer('Phí vượt km trong tháng không để trống').max(10000000,"Phí vượt km trong tháng không lớn hơn 10000000")
      .required("Phí vượt km trong tháng không để trống"),
      // .test('checkReceiveFee', 'Phí vượt km trong tháng nhận không được lớn hơn phí vượt km trong tháng', function (value) {
      //   const overLimitedMileage = this.parent.overLimitedMileage;
      //   return (value ?? 0) <= overLimitedMileage;
      // }
      // ),
        priceForDayReceive: Yup.number()
        .min(100000, "Giá cho ngày thuê phải lớn hơn 100000").max(100000000,"Giá cho ngày thuê không lớn hơn 100000000")
        .test(
          "price-for-day-receive-less-than-normal-day",
          "Giá cho ngày thuê phải nhỏ hơn giá cho ngày bình thường",
          function (value) {
            const { priceForNormalDay } = this.parent;
            return (value ?? 0) < priceForNormalDay;
          }
        )
        .required("Giá cho ngày thuê không được để trống"),
        ownerSlitRatio:Yup.number()
        .positive('Tỉ lệ ăn chia của chủ xe không được để trống').min(1, "Tỉ lệ ăn chia của chủ xe phải lớn hơn hoặc bằng 1%").max(80,"Tỉ lệ ăn chia của chủ xe  không lớn hơn 80 %")
        .required("Tỉ lệ ăn chia của chủ xe không được để trống"),
        priceForMonthReceive: Yup.number()
        .min(100000, "Giá cho tháng thuê phải lớn hơn 100000")
        .max(100000000,"Giá cho tháng thuê không lớn hơn 100000000")
        // .test(
        //   "price-for-month-receive-less-than-month",
        //   "Giá cho tháng thuê phải nhỏ hơn giá cho tháng thuê của chủ xe",
        //   function (value) {
        //     const { priceForMonth } = this.parent;
        //     return (value ?? 0) < priceForMonth;
        //   }
        // )
        .required("Giá cho tháng thuê không được để trống"),
        priceForMonth: Yup.number()
        .min(100000, "Giá cho tháng thuê phải lớn hơn 100000").max(100000000,"Giá cho tháng thuê không lớn hơn 100000000")
        .test(
          "price-for-month-greater-than-normal-day",
          "Giá cho tháng thuê phải lớn hơn giá cho ngày bình thường",
          function (value) {
            const { priceForNormalDay } = this.parent;
            return (value ?? 0) > priceForNormalDay;
          }
        )
        .test(
          "price-for-month-greater-than-weekend-day",
          "Giá cho tháng thuê phải lớn hơn giá cho ngày cuối tuần",
          function (value) {
            const { priceForWeekendDay } = this.parent;
            return (value ?? 0) > priceForWeekendDay;
          }
        )
        .required("Giá cho tháng thuê không được để trống").test(
          "price-for-month-receive-less-than-month",
          "Giá cho thuê tháng phải lớn hơn giá cho tháng thuê của chủ xe",
          function (value) {
            const { priceForMonthReceive } = this.parent;
            return (value ?? 0) > priceForMonthReceive;
          }
        )
        .required("Giá cho tháng thuê không được để trống"),
        priceForNormalDay: Yup.number()
        .min(100000, "Giá cho ngày bình thường phải lớn hơn hoặc bằng 100000")
        .max(100000000,"Giá cho ngày bình thường không lớn hơn 100000000"),
        // .test(
        //   "price-for-normal-day-less-than-weekend-day",
        //   "Giá cho ngày bình thường phải nhỏ hơn giá cho ngày cuối tuần",
        //   function (value) {
        //     const { priceForWeekendDay } = this.parent;
        //     return (value ?? 0) < priceForWeekendDay;
        //   }
        // ),
        // .test(
        //   "price-for-normal-day-less-than-month",
        //   "Giá cho ngày bình thường phải nhỏ hơn giá cho tháng thuê",
        //   function (value) {
        //     const { priceForMonth } = this.parent;
        //     return (value ?? 0) < priceForMonth;
        //   }
        // )
        // .required("Giá cho ngày bình thường không được để trống"),
        priceForWeekendDay: Yup.number()
        .min(100000, "Giá cho ngày cuối tuần phải lớn hơn 100000").max(100000000,"Giá cho ngày cuối tuần không lớn hơn 100000000")
        // .test(
        //   "price-for-weekend-day-less-than-month",
        //   "Giá cho ngày cuối tuần phải nhỏ hơn giá cho tháng thuê",
        //   function (value) {
        //     const { priceForMonth } = this.parent;
        //     return (value ?? 0) < priceForMonth;
        //   }
        // )
        .test(
          "price-for-weekend-day-greater-than-normal-day",
          "Giá cho ngày cuối tuần phải lớn hơn giá cho ngày bình thường",
          function (value) {
            const { priceForNormalDay } = this.parent;
            return (value ?? 0) > priceForNormalDay;
          }
        )
        .required("Giá cho ngày cuối tuần không được để trống"),
      limitedKmForMonth: Yup.number()
        .typeError('Giới hạn km trong Tháng phải là số')
        .positive('Giới hạn km trong Tháng không được để trống')
        .integer('Giới hạn km trong Tháng không được để trống')
        .required("Giới hạn km trong Tháng không được để trống").max(100000000,"Giới hạn km trong Tháng không lớn hơn 100000000")
        .test('checkReceiveLimit', 'Giới hạn số km trong tháng nhận  lớn hơn giới hạn số km trong tháng', function (value) {
          const limitedKmForMonthReceive = this.parent.limitedKmForMonthReceive;
          return (value ?? 0) <= limitedKmForMonthReceive;
        }),
      overLimitedMileage: Yup.number()
        .typeError('Phí vượt km trong tháng phải là số')
        .positive('Phí vượt km trong thángkhông được để trống')
        .integer('Phí vượt km trong tháng không được để trống').max(100000000,"Phí vượt km trong tháng không lớn hơn 100000000")
        .required("Phí vượt km trong tháng không được để trống").test('checkReceiveFee', 'Phí vượt km trong tháng nhận không được lớn hơn phí vượt km trong tháng', function (value) {
          const overLimitedMileageReceive = this.parent.overLimitedMileageReceive;
          return (value ?? 0) > overLimitedMileageReceive;
        }),
      currentEtcAmount: Yup.number()
        .typeError('số tiền còn trong tài khoản ETC là số!')
        .positive('số tiền còn trong tài khoản ETC không được để trống!')
        .integer('số tiền còn trong tài khoản ETC không được để trống!').max(100000000,"số tiền còn trong tài khoản ETC không lớn hơn 100000000")
        .required("số tiền còn trong tài khoản ETC không được để trống!"),
      fuelPercent: Yup.number()
        .typeError('Phần % nhiên liệu  phải là số')
        .positive('Số công tơ mét phải là số dương')
        .min(1, 'Phần % nhiên liệu phải lớn hơn hoặc bằng 1')
        .max(100, 'Phần % nhiên liệu phải nhỏ hơn hoặc bằng 100')
        .required('Phần % nhiên liệu không được để trống'),
      speedometerNumber: Yup.number()
        .typeError('Số đồng hồ cập nhật lần cuối phải là số !')
        .positive('Số đồng hồ cập nhật lần cuối không được để trống !')
        .integer('Số đồng hồ cập nhật lần cuốikhông được để trống !').max(100000000,"Số đồng hồ cập nhật lần không lớn hơn 100000000")
        .required("Số đồng hồ cập nhật lần cuốikhông được để trống !"),
        // .oneOf([Yup.ref('speedometerNumberReceive')], 'Số km và Số km nhận không giống nhau'),
        tankCapacity: Yup.number()
        .typeError('Dung tích bình xăng phải là số !')
        .positive('Dung tích bình xăng  phải là số dương !')
        .integer('Dung tích bình xăng không được để trống !')
        .required("Dung tích bình xăng không được để trống !"),
      carLicensePlates: Yup.string()
        .matches(/^[0-9]{2}[A-Z]{1}[0-9]{4,5}$/, "Biển số xe không hợp lệ!")
        .required("Biển số xe không được để trống!"),
      trackingUsername: Yup.string().required("Tài khoản tracking không để trống!"),
      trackingPassword: Yup.string().required("Mật khẩu tracking không để trống!"),
      etcusername: Yup.string().required("Tài khoản ETC không để trống!"),
      carDescription: Yup.string().min(6, 'Quá Ngắn!').max(10000, 'Quá dài!').required('Mô tả xe không được để trống'),
      etcpassword: Yup.string().required("Mật khẩu ETC không để trống!"),
      linkTracking: Yup.string().required("trang link không được để trống"),


    }),




    onSubmit: (values, { setSubmitting, setErrors }) => {
      if (values.speedometerNumber !== values.speedometerNumberReceive) {
        setErrors({ speedometerNumberReceive: "Số km và Số km nhận không giống nhau" });
        setSubmitting(false);
      } else {
        const actionAsyncLogin = postCarAsyncApi(values);
        dispatch(actionAsyncLogin);
      }
     
     

    },
  });


 
  const [carModelLoaded, setCarModelLoaded] = useState(false);
  const [carGenerationLoaded, setCarGenerationLoaded] = useState(false);
  const [carSeriesLoaded, setCarSeriesLoaded] = useState(false);
  const [carTrimLoaded, setCarTrimLoaded] = useState(false);

useEffect(() => {
  if (alertAction !== "") {
    setAlert(alertAction);
  }
  if (formik.values.carMakeId && !carModelLoaded) {
    getAllCarModel(parseInt(formik.values.carMakeId, 10));
    setCarModelLoaded(true);
  }
  if (formik.values.carModelId && !carGenerationLoaded) {
    getAllCarGenration(parseInt(formik.values.carModelId, 10));
    setCarGenerationLoaded(true);
  }
  if (formik.values.carGenerationId && !carSeriesLoaded) {
    const carModelId = parseInt(formik.values.carModelId, 10);
    const carGenerationId = parseInt(formik.values.carGenerationId, 10);
    getAllCarSeri(carModelId, carGenerationId);
    setCarSeriesLoaded(true);
  }
  if (formik.values.carSeriesId && !carTrimLoaded) {
    const carModelId = parseInt(formik.values.carModelId, 10);
    const carSeriesId = parseInt(formik.values.carSeriesId, 10);
    getAllCarTrim(carModelId, carSeriesId);
    setCarTrimLoaded(true);
  }
  if (!showPopup) {
    formik.setValues(initialValues);
    formik.setTouched({});
  }
}, [showPopup, openDad, alertAction, formik.values.carMakeId, formik.values.carModelId, formik.values.carGenerationId, formik.values.carSeriesId, carModelLoaded, carGenerationLoaded, carSeriesLoaded, carTrimLoaded]);
  const handleClose = () => {
    parentCallback(false);
    formik.setValues(initialValues);
    formik.setTouched({});

  };

  const [priceForMonthReceiveValue, setpriceForMonthReceive] = useState('');
  const [priceForNormalDayValue, setpriceForNormalDay] = useState('');
  const [priceForMonthValue, setpriceForMonth] = useState('');
  const [currentEtcAmountValue, setcurrentEtcAmount] = useState('');
  const [priceForWeekendDay, setpriceForWeekendDay] = useState('');
  const [speedometerNumberReceive,setspeedometerNumberReceive]=useState('')
  const [speedometerNumber,setspeedometerNumber]=useState('')
  const [carKmLastMaintenance,setcarKmLastMaintenance]=useState('')
  const [limitedKmForMonth,setlimitedKmForMonth]=useState('')
  const [overLimitedMileage,setoverLimitedMileage]=useState('')
  const [priceForDayReceive,setpriceForDayReceive]=useState('')
  const [limitedKmForMonthReceive,setlimitedKmForMonthReceive]=useState('')
  const [overLimitedMileageReceive,setoverLimitedMileageReceive]=useState('')
  const [periodicMaintenanceLimit,setperiodicMaintenanceLimit]=useState('')



  const handlperiodicMaintenanceLimitChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setperiodicMaintenanceLimit(formattedValue);
    formik.setFieldValue('periodicMaintenanceLimit', numericValue);

  };



  
  const handloverLimitedMileageReceiveChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setoverLimitedMileageReceive(formattedValue);
    formik.setFieldValue('overLimitedMileageReceive', numericValue);

  };
  const handlelimitedKmForMonthReceiveChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setlimitedKmForMonthReceive(formattedValue);
    formik.setFieldValue('limitedKmForMonthReceive', numericValue);

  };
  const handlepriceForDayReceiveChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setpriceForDayReceive(formattedValue);
    formik.setFieldValue('priceForDayReceive', numericValue);

  };
  const handleoverLimitedMileageChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setoverLimitedMileage(formattedValue);
    formik.setFieldValue('overLimitedMileage', numericValue);

  };
  const handlelimitedKmForMonthChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setlimitedKmForMonth(formattedValue);
    formik.setFieldValue('limitedKmForMonth', numericValue);

  };
  const handlecarKmLastMaintenanceChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setcarKmLastMaintenance(formattedValue);
    formik.setFieldValue('carKmLastMaintenance', numericValue);

  };
  const handlespeedometerNumberChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setspeedometerNumber(formattedValue);
    formik.setFieldValue('speedometerNumber', numericValue);

  };





  const handlespeedometerNumberReceiveChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setspeedometerNumberReceive(formattedValue);
    formik.setFieldValue('speedometerNumberReceive', numericValue);

  };





  const handlepriceForWeekendDayChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setpriceForWeekendDay(formattedValue);
    formik.setFieldValue('priceForWeekendDay', numericValue);

  };

  const handlecurrentEtcAmountValueChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setcurrentEtcAmount(formattedValue);
    formik.setFieldValue('currentEtcAmount', numericValue);

  };







  const handlepriceForNormalDayValueChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setpriceForNormalDay(formattedValue);
    formik.setFieldValue('priceForNormalDay', numericValue);

  };
  const handlepriceForMonthValueChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setpriceForMonth(formattedValue);
    formik.setFieldValue('priceForMonth', numericValue);

  };
  const handlepriceForMonthReceiveChange = (event: any) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^\d]/g, ''));
    const formattedValue = numericValue.toLocaleString();
    setpriceForMonthReceive(formattedValue);
    formik.setFieldValue('priceForMonthReceive', numericValue);

  };

  const renderuUpdateModalUI = () => {

    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form onSubmit={formik.handleSubmit}>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
             Thêm mới xe
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
             
                <div className="mb-5 mt-2">
                <h3 className="font-bold text-3xl"> Thông tin xe</h3>
                <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ các thông tin xe dưới đây (từ trái sang phải)</p>


                <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">
                  {/* 
                  <p className="text-xs mb-1 "> (*)thêm đủ các thông tin xe dưới đây</p> */}


                  <FormControl className="w-full mt-2" >
                    <InputLabel size="small">Hãng xe*</InputLabel>

                    <Select

                      value={formik.values.carMakeId || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carMakeId && formik.errors.carMakeId
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Hãng xe"}
                      size="small"
                      name="carMakeId"

                    >
                      {carMake.map((model) => (
                        <MenuItem key={model.name} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carMakeId && formik.touched.carMakeId ? (
                      <div className="text-red-600">{formik.errors.carMakeId}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2">
                    <InputLabel size="small" >Tên Xe*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.carModelId || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carModelId && formik.errors.carModelId
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Tên xe"}

                      name="carModelId"
                    >

                      {carModels?.map((model: any) => (
                        <MenuItem key={model.name} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carModelId && formik.touched.carModelId ? (
                      <div className="text-red-600">{formik.errors.carModelId}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2">
                    <InputLabel size="small">Phiên bản*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.carGenerationId || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carGenerationId && formik.errors.carGenerationId
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Phiên bản"}
                      name="carGenerationId"
                    >
                      {CarGeneration?.map((model) => (
                        <MenuItem key={model.name} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carGenerationId && formik.touched.carGenerationId ? (
                      <div className="text-red-600">{formik.errors.carGenerationId}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2">
                    <InputLabel size="small">Kiểu dáng*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.carSeriesId}
                      label={"Kiểu dáng"}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carSeriesId &&
                          formik.errors.carSeriesId
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      name="carSeriesId"
                    >
                      {/* <MenuItem  value="7"
                        aria-selected="true">
                        7 chỗ 
                      </MenuItem> */}
                      {CarSeries?.map((model: any) => (
                        <MenuItem key={model.name} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carSeriesId &&
                      formik.touched.carSeriesId ? (
                      <div className="text-red-600">
                        {formik.errors.carSeriesId}
                      </div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2 " >
                    <InputLabel size="small">Truyền động*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.carTrimId || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carTrimId && formik.errors.carTrimId
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"truyền động"}
                      name="carTrimId"
                    >
                      {CarTrim?.map((model) => (
                        <MenuItem key={model.name} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carTrimId && formik.touched.carTrimId ? (
                      <div className="text-red-600">{formik.errors.carTrimId}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2  ">
                    <InputLabel size="small">Năm sản xuất*</InputLabel>
                    <Select
                      value={formik.values.modelYear || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.modelYear && formik.errors.modelYear
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Năm sản xuất*"}
                      name="modelYear"
                      size="small"
                    >
                      {modelYear.map((model: any) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.modelYear && formik.touched.modelYear ? (
                      <div className="text-red-600 text-xs font-semibold p-1">{formik.errors.modelYear}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2">
                    <InputLabel size="small" >Màu xe*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.carColor || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carColor && formik.errors.carColor
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Màu xe"}
                      name="carColor"
                    >
                      {carcolor.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carColor && formik.touched.carColor ? (
                      <div className="text-red-600">{formik.errors.carColor}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2">
                    <InputLabel size="small" >Số ghế*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.seatNumber || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.seatNumber && formik.errors.seatNumber
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Số ghế"}
                      name="seatNumber"
                    >
                      {seatNumber.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.seatNumber && formik.touched.seatNumber ? (
                      <div className="text-red-600">{formik.errors.seatNumber}</div>
                    ) : null}
                  </FormControl>
                  <FormControl className="w-full mt-2">
                    <InputLabel size="small" >Nhiên Liệu*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.carFuel || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carFuel && formik.errors.carFuel
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"Nhiên Liệu"}
                      name="carFuel"
                    >
                      {CarFuel.map((model: any) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carFuel && formik.touched.carFuel ? (
                      <div className="text-red-600">{formik.errors.carFuel}</div>
                    ) : null}
                  </FormControl>

                  <FormControl className=" w-full  mt-2  ">
                    <InputLabel size="small"  >Bãi xe*</InputLabel>
                    <Select
                      size="small"
                      value={formik.values.parkingLotId || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.parkingLotId && formik.errors.parkingLotId
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      label={"bãi xe"}
                      name="parkingLotId"
                    >
                      {ParkingLot?.map((model) => (
                        <MenuItem key={model.name} value={model.id}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.parkingLotId && formik.touched.parkingLotId ? (
                      <div className="text-red-600">{formik.errors.parkingLotId}</div>
                    ) : null}
                  </FormControl>



                  <div className="w-full mt-2 " >
                    <TextField
                      size="small"
                      value={formik.values.carLicensePlates || ""}
                      fullWidth
                      id="outlined-basic1"
                      label="Biển số xe*"
                      variant="outlined"
                      name="carLicensePlates"

                      onChange={formik.handleChange}
                      error={
                        formik.touched.carLicensePlates && formik.errors.carLicensePlates
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.carLicensePlates && formik.touched.carLicensePlates ? (
                      <div className="text-red-600 inline-block">{formik.errors.carLicensePlates}</div>
                    ) : null}
                  </div>


                  <div className="w-full mt-2 ">
                    <TextField
                      value={currentEtcAmountValue || ""}
                      size="small"
                      id="outlined-basic12"
                      label="Số tiền còn trong tài khoản ETC*" //CurrentEtcAmount
                      name="currentEtcAmount"
                      fullWidth
                      onChange={handlecurrentEtcAmountValueChange}
                      error={
                        formik.touched.currentEtcAmount && formik.errors.currentEtcAmount
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.currentEtcAmount && formik.touched.currentEtcAmount ? (
                      <div className="text-red-600">{formik.errors.currentEtcAmount}</div>
                    ) : null}
                  </div>
                  <div className="w-full mt-2  ">
                    <TextField
                      value={formik.values.fuelPercent || ""}
                      size="small"
                      id="outlined-basic13"
                      label="Phầm trăm nhiên liệu*" //FuelPercent
                      name="fuelPercent"
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.fuelPercent && formik.errors.fuelPercent
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.fuelPercent && formik.touched.fuelPercent ? (
                      <div className="text-red-600">{formik.errors.fuelPercent}</div>
                    ) : null}
                  </div>
                  <div className="w-full mt-2 ">
                    <TextField
                      value={speedometerNumber|| ""}
                      size="small"
                      id="outlined-basic25"
                      label="Số đồng hồ cập nhật lần cuối*(km) " //SpeedometerNumber
                      name="speedometerNumber"
                      fullWidth
                      onChange={handlespeedometerNumberChange}
                      error={
                        formik.touched.speedometerNumber && formik.errors.speedometerNumber
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.submitCount > 0 && formik.touched.speedometerNumber && formik.errors.speedometerNumber
                          ? formik.errors.speedometerNumber
                          : ""
                      }
                    />
                    {formik.errors.speedometerNumber && formik.touched.speedometerNumber ? (
                      <div className="text-red-600">{formik.errors.speedometerNumber}</div>
                    ) : null}
                    
                  </div>
                  <div className="w-full mt-2 ">
                    <TextField
                      value={carKmLastMaintenance || ""}
                      size="small"
                      id="outlined-basic14"
                      label="Số km bảo trì lần cuối(km)* " //SpeedometerNumber
                      name="carKmLastMaintenance"
                      fullWidth
                      onChange={handlecarKmLastMaintenanceChange}
                      error={
                        formik.touched.carKmLastMaintenance && formik.errors.carKmLastMaintenance
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.carKmLastMaintenance && formik.touched.carKmLastMaintenance ? (
                      <div className="text-red-600">{formik.errors.carKmLastMaintenance}</div>
                    ) : null}
                  </div>
                  <div className="w-full mt-2 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Hạn cuối đăng kiểm*"
                            value={formik.values.registrationDeadline}
                            inputFormat="DD/MM/YYYY "
                            onChange={(newValue) =>
                              handleChange1(newValue == null ? today : newValue)
                            }
                            minDate={today.add(1, 'day')}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                // error={formik.errors.rentalDate ? true : undefined}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                        {/* {formik.errors.registrationDeadline && (
                          <div className="text mt-1 text-xs text-red-600 font-semibold">
                            {formik.errors.registrationDeadline as string}
                          </div>
                        )} */}
                      </LocalizationProvider>
                    </div>
                    <div className="w-full mt-2 " >
                    <TextField
                      size="small"
                      value={formik.values.tankCapacity|| ""}
                      fullWidth
                      id="outlined-basic1"
                      label="Dung tích bình xăng(Lít)*"
                      variant="outlined"
                      name="tankCapacity"

                      onChange={formik.handleChange}
                      error={
                        formik.touched.tankCapacity && formik.errors.tankCapacity
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.tankCapacity && formik.touched.tankCapacity ? (
                      <div className="text-red-600 inline-block">{formik.errors.tankCapacity}</div>
                    ) : null}
                  </div>
                  
                </div>
                <div className="w-full mt-4    ">
                    <TextField
                      size="small"
                      id="outlined-basic3"
                       
                      label="Mô tả xe" //CarStatusDescription
                      className="mx-2 w-[897px]"
                      variant="outlined"
                      rows={3}
                      multiline
                      name="carDescription"
                        
                      onChange={formik.handleChange}
                      error={
                        formik.touched.carDescription && formik.errors.carDescription
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.carDescription && formik.touched.carDescription ? (
                      <div className="text-red-600">{formik.errors.carDescription}</div>
                    ) : null}
                  </div>



              </div>
              <div className="mt-2 mb-5">
                <h3 className="font-bold text-3xl"> Thông tin chủ xe</h3>
                <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ thông tin chủ xe dưới đây</p>
                <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">
                <div className="w-full mt-2 ">
                      <TextField
                        size="small"
                        id="outlined-basic2"
                        label="Tên chủ xe*"
                        variant="outlined"
                        name="carOwnerName"
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.carOwnerName && formik.errors.carOwnerName
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.carOwnerName && formik.touched.carOwnerName ? (
                        <div className="text-red-600 inline-block">{formik.errors.carOwnerName}</div>
                      ) : null}
                    </div>
                    <FormControl className="w-full  mt-2">
                      <InputLabel size="small" >Hình thức thuê*</InputLabel>
                      <Select
                        value={formik.values.rentalMethod}
                        size="small"
                        // value={formik.values.Carfuel || ""}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.rentalMethod && formik.errors.rentalMethod
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                        label={"Hình thức thuê"}
                        name="rentalMethod"
                      >
                        {rentalMethod.map((model) => (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.rentalMethod && formik.touched.rentalMethod ? (
                        <div className="text-red-600">{formik.errors.rentalMethod}</div>
                      ) : null}
                    </FormControl>
                    <div className="mt-2 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Ngày thuê*"
                            value={formik.values.rentalDate}
                            inputFormat="DD/MM/YYYY "
                            onChange={(newValue) =>
                              handleChange(newValue == null ? today : newValue)
                            }
                            minDate={minDate}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                error={formik.errors.rentalDate ? true : undefined}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                        {formik.errors.rentalDate && (
                          <div className="text mt-1 text-xs text-red-600 font-semibold">
                            {formik.errors.rentalDate as string}
                          </div>
                        )}
                      </LocalizationProvider>
                    </div>
                    <div className="w-full mt-3 ">
                      <TextField
                        value={speedometerNumberReceive|| ""}
                        size="small"
                        id="outlined-basic5"
                        label="Số km ngày nhận(km)"  //SpeedometerNumberReceive đầu vào 
                        variant="outlined"
                        fullWidth
                        name="speedometerNumberReceive"
                        onChange={handlespeedometerNumberReceiveChange}
                        error={
                          formik.touched.speedometerNumberReceive && formik.errors.speedometerNumberReceive
                            ? true
                            : undefined
                        }
                        helperText={
                          formik.submitCount > 0 && formik.touched.speedometerNumberReceive && formik.errors.speedometerNumberReceive
                            ? formik.errors.speedometerNumberReceive
                            : ""
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.speedometerNumberReceive && formik.touched.speedometerNumberReceive ? (
                        <div className="text-red-600">{formik.errors.speedometerNumberReceive}</div>
                      ) : null}
                    </div>
                    <div className="w-full mt-2">
                      <TextField
                       type="number"
                        value={formik.values.ownerSlitRatio || ""}
                        size="small"
                        id="outlined-basic30"
                        label="Tỉ lệ ăn chia của chủ xe"
                        fullWidth
                        name="ownerSlitRatio"  // đầu vào
                        onChange={formik.handleChange}
                        error={
                          formik.touched.ownerSlitRatio && formik.errors.ownerSlitRatio ? true : undefined
                        }


                      />
                      {formik.errors.ownerSlitRatio && formik.touched.ownerSlitRatio ? (
                      <div className="text-red-600">{formik.errors.ownerSlitRatio}</div>
                    ) : null}
                    </div>
                    <div className="w-full mt-2">
                      <TextField
                        value={priceForDayReceive || ""}
                        size="small"
                        id="outlined-basic6"
                        label="Giá cho ngày thuê*(Vnd)"
                        fullWidth
                        name="priceForDayReceive"  // đầu vào
                        onChange={handlepriceForDayReceiveChange}
                        error={
                          formik.touched.priceForDayReceive && formik.errors.priceForDayReceive ? true : undefined
                        }


                      />
                      {formik.errors.priceForDayReceive && formik.touched.priceForDayReceive ? (
                      <div className="text-red-600">{formik.errors.priceForDayReceive}</div>
                    ) : null}
                    </div>
                    <div className="w-full mt-2 ">
                      <TextField
                        value={priceForMonthReceiveValue || ""}
                        size="small"
                        id="outlined-basic7"
                        label="Giá cho tháng thuê*(Vnd)"  //Price For Month Receive // đầu vào
                        variant="outlined"
                        fullWidth
                        name="priceForMonthReceive"
                        onChange={handlepriceForMonthReceiveChange}
                        error={
                          formik.touched.priceForMonthReceive && formik.errors.priceForMonthReceive
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.priceForMonthReceive && formik.touched.priceForMonthReceive ? (
                        <div className="text-red-600">{formik.errors.priceForMonthReceive}</div>
                      ) : null}
                    </div>


                    <div className="w-full mt-2  ">
                      <TextField
                        value={limitedKmForMonthReceive || ""}
                        size="small"
                        id="outlined-basic20"
                        label="Giới hạn số km trong  tháng(km)*  "
                        variant="outlined"
                        name="limitedKmForMonthReceive" // đầu vào
                        fullWidth
                        onChange={handlelimitedKmForMonthReceiveChange}
                        error={
                          formik.touched.limitedKmForMonthReceive && formik.errors.limitedKmForMonthReceive
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.limitedKmForMonthReceive && formik.touched.limitedKmForMonthReceive ? (
                        <div className="text-red-600">{formik.errors.limitedKmForMonthReceive}</div>
                      ) : null}

                    </div>
                    <div className="w-full mt-2  ">
                      <TextField
                        value={overLimitedMileageReceive   || ""}
                        size="small"
                        id="outlined-basic21"
                        label="Phí vượt km trong tháng(Vnd/km)* " // đầu vào
                        variant="outlined"
                        name="overLimitedMileageReceive"
                        fullWidth
                        onChange={handloverLimitedMileageReceiveChange}
                        error={
                          formik.touched.overLimitedMileageReceive && formik.errors.overLimitedMileageReceive
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.overLimitedMileageReceive && formik.touched.overLimitedMileageReceive ? (
                        <div className="text-red-600">{formik.errors.overLimitedMileageReceive}</div>
                      ) : null}

                    </div>


                    <div className="w-full mt-2  ">
                      <TextField
                        value={periodicMaintenanceLimit || ""}
                        size="small"
                        id="outlined-basic000"
                        label="Định mức bảo trì (km)*"
                        variant="outlined"
                        name="periodicMaintenanceLimit"
                        fullWidth
                        onChange={handlperiodicMaintenanceLimitChange}
                        error={
                          formik.touched.periodicMaintenanceLimit && formik.errors.periodicMaintenanceLimit
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.periodicMaintenanceLimit && formik.touched.periodicMaintenanceLimit ? (
                        <div className="text-red-600">{formik.errors.periodicMaintenanceLimit}</div>
                      ) : null}
                    </div>

                  </div>
                  
                </div>
              <div className="mb-5 mt-2  ">
              <h3 className="font-bold text-3xl"> Bảng giá cho thuê</h3>
              <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ  giá cho thuê dưới đây</p>
              <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">
               
                    {/* <h3 className="bg-white text-black w-36 -mt-8 mb-2">  Bảng giá cho thuê</h3> */}
                    <div className="w-full mt-2">
                      <TextField
                        value={priceForNormalDayValue || ""}
                        size="small"
                        id="outlined-basic8"
                        label="Giá cho ngày bình thường*"  //PriceForNormalDay
                        variant="outlined"
                        fullWidth
                        name="priceForNormalDay"
                        onChange={handlepriceForNormalDayValueChange}
                        error={
                          formik.touched.priceForNormalDay && formik.errors.priceForNormalDay
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.priceForNormalDay && formik.touched.priceForNormalDay ? (
                        <div className="text-red-600">{formik.errors.priceForNormalDay}</div>
                      ) : null}
                    </div>
                    <div className="w-full mt-2 ">
                      <TextField
                        value={priceForWeekendDay || ""}
                        size="small"
                        id="outlined-basic15"
                        label="Giá cho ngày cuối  tuần*" //PriceForWeekendDay
                        name="priceForWeekendDay"
                        fullWidth
                        onChange={handlepriceForWeekendDayChange}
                        error={
                          formik.touched.priceForWeekendDay && formik.errors.priceForWeekendDay
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.priceForWeekendDay && formik.touched.priceForWeekendDay ? (
                        <div className="text-red-600">{formik.errors.priceForWeekendDay}</div>
                      ) : null}
                    </div>
                    <div className="w-full mt-2 ">
                      <TextField
                        value={priceForMonthValue || ""}
                        size="small"
                        id="outlined-basic9"
                        label="Giá cho thuê tháng*"
                        name="priceForMonth"
                        fullWidth
                        onChange={handlepriceForMonthValueChange}
                        error={
                          formik.touched.priceForMonth && formik.errors.priceForMonth
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.priceForMonth && formik.touched.priceForMonth ? (
                        <div className="text-red-600">{formik.errors.priceForMonth}</div>
                      ) : null}
                    </div>


                    <div className="w-full mt-2 ">
                      <TextField
                        value={limitedKmForMonth || ""}
                        size="small"
                        id="outlined-basic10"
                        label="Giới hạn số km trong tháng(km/tháng)*"  //Limited Km ForMonth
                        name="limitedKmForMonth"
                        fullWidth
                        onChange={handlelimitedKmForMonthChange}
                        error={
                          formik.touched.limitedKmForMonth && formik.errors.limitedKmForMonth
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.limitedKmForMonth && formik.touched.limitedKmForMonth ? (
                        <div className="text-red-600">{formik.errors.limitedKmForMonth}</div>
                      ) : null}
                    </div>

                    <div className="w-full mt-2 ">
                      <TextField
                        value={overLimitedMileage|| ""}
                        size="small"
                        id="outlined-11"
                        label="Phí vượt km trong tháng(Vnd/km)*" //Over LimitedMileage
                        name="overLimitedMileage"
                        fullWidth
                        onChange={handleoverLimitedMileageChange}
                        error={
                          formik.touched.overLimitedMileage && formik.errors.overLimitedMileage
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.overLimitedMileage && formik.touched.overLimitedMileage ? (
                        <div className="text-red-600">{formik.errors.overLimitedMileage}</div>
                      ) : null}
                    </div>

                  </div>
                 






                </div>
               
              

       <div className="mt-2 mb-5">
       <h3 className="font-bold text-3xl"> Tài khoản</h3>
       <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ tài khoản dưới đây</p>
       <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">
       <div className="w-full mt-2 ">
                    <TextField
                      value={formik.values.linkTracking}
                      size="small"
                      id="outlined-basic16"
                      label="Trang tracking  " //Link tracking
                      name="linkTracking"
                      disabled
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.linkTracking && formik.errors.linkTracking
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.linkTracking && formik.touched.linkTracking ? (
                      <div className="text-red-600">{formik.errors.linkTracking}</div>
                    ) : null}
                  </div>
                  <div className="w-full mt-2 ">
                    <TextField
                      value={formik.values.trackingUsername}
                      size="small"
                      id="outlined-basic17"
                      label="Tài khoản tracking* " //TrackingUsername
                      variant="outlined"
                      name="trackingUsername"
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.trackingUsername && formik.errors.trackingUsername
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.trackingUsername && formik.touched.trackingUsername ? (
                      <div className="text-red-600">{formik.errors.trackingUsername}</div>
                    ) : null}
                  </div>
                  <div className=" w-full mt-2">
                    <TextField
                      value={formik.values.trackingPassword}
                      type={showPassword ? 'text' : 'password'}
                      size="small"
                      id="outlined-basic18"
                      label=" Mật khẩu tracking*"
                      variant="outlined"
                      name="trackingPassword"
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.trackingPassword && formik.errors.trackingPassword
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >

                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    {formik.errors.trackingPassword && formik.touched.trackingPassword ? (
                      <div className="text-red-600">{formik.errors.trackingPassword}</div>
                    ) : null}
                  </div>

                  <div className="w-full mt-2  ">
                    <TextField
                      value={formik.values.etcusername}
                      size="small"
                      id="outlined-basic19"
                      label="Tài khoản ETC* "
                      variant="outlined"
                      name="etcusername"

                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.etcusername && formik.errors.etcusername
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.etcusername && formik.touched.etcusername ? (
                      <div className="text-red-600">{formik.errors.etcusername}</div>
                    ) : null}
                  </div>
                  <div className=" w-full mt-2">
                    <TextField
                      value={formik.values.etcpassword}
                      type={showPassword1 ? 'text' : 'password'}
                      size="small"
                      id="outlined-basic"
                      label="Mật khẩu ETC*"
                      variant="outlined"
                      name="etcpassword"
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.etcpassword && formik.errors.etcpassword
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword1}
                              onMouseDown={handleMouseDownPassword1}
                              edge="end"
                            >

                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    {formik.errors.etcpassword && formik.touched.etcpassword ? (
                      <div className="text-red-600">{formik.errors.etcpassword}</div>
                    ) : null}
                  </div>
        </div>
       </div>
                {/* <div className="mb-5 mt-2 border-[1px] border-[#8d99ae] rounded-md bs bg-white p-5  items-start flex-nowrap ">
                  <h3 className="bg-white text-black w-20 -mt-8 mb-2"> Tài khoản</h3>
                  <p className="text-xs mb-1 "> (*)thêm đủ các thông tin xe dưới đây</p>
              

                </div> */}

               
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
