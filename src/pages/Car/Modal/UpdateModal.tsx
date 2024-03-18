import React, { useEffect, useState } from "react";

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
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import * as Yup from "yup";
import { storage } from '../../../../src/util/FirebaseConfig';
import { useAppSelector } from "../../../hooks";
import { Car } from "../../../models/Car";
import { getCarGenerationAsyncApi } from "../../../redux/CarGenerationReducer/CarGenerationReducer";
import { getcarMakeAsyncApi } from "../../../redux/CarMakeReducer/CarMakeReducer";
import { getCarModelcarAsyncApi } from "../../../redux/CarModelReducer/CarModelReducer";
import { putCarAsyncApi } from "../../../redux/CarReducer/CarReducer";
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
export const UpdateModal = (props: any) => {
  const { openDad, error, parentCallback, userDad, parentCallbackAlert, parentCallbackMessageAlert } = props;
  const [messageAlert, setMessageAlert] = useState("");

  const today = dayjs();
  const [rentalDate, setRentalDate] = useState(today);
  const { carMake } = useSelector((state: RootState) => state.carMake); //r

  const { CarGeneration } = useSelector((state: RootState) => state.CarGeneration
  ); // đời xe
  const { CarTrim } = useSelector((state: RootState) => state.CarTrim); //r
  const { CarSeries } = useSelector((state: RootState) => state.CarSeries); //r
  const { carModels } = useSelector((state: RootState) => state.CarModel); //tên xe
  const { ParkingLot } = useSelector((state: RootState) => state.ParkingLot)
  const { showPopup } = useAppSelector((state: RootState) => state.CarResult);
  const minDate = today.subtract(7, 'day');
  const dispatch: DispatchType = useDispatch();
  const param = useParams()

  const getAllcarMake = () => {
    const actionAsync = getcarMakeAsyncApi();
    dispatch(actionAsync);
  };

  const getAllCarTrim = (carModelId: number, carSeriesId: number) => {
    const actionAsync = getCarTrimcarAsyncApi({ carModelId, carSeriesId });
    dispatch(actionAsync);
  };
  const getAllCarSeri = (carModelId: number, carGenerationId: number) => {
    const actionAsync = getcarSeriAsyncApi({ carModelId, carGenerationId });
    dispatch(actionAsync);
  };

  const getAllCarModel = (carMakeId: number) => {
    const actionAsync = getCarModelcarAsyncApi(carMakeId);
    dispatch(actionAsync);
  };
  const getAllCarGenration = (carModelId: number) => {
    const actionAsync = getCarGenerationAsyncApi(carModelId);
    dispatch(actionAsync);
  };

  const [rend, setRend] = useState(false);
  const [insurance, setinsurance] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
  const handleMouseDownPassword1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const seatNumber = [
    4,
    5,
    7,
  ];
  const carColor = [
    'Đỏ',
    'Xanh',
    'Tím',
    'Vàng',
    'trắng',
    'xám',
    'xanh lá'
  ];
  const carFuel = [
    'Xăng',
    'Dầu',
    'Điện',
  ];

  const rentalMethod = [
    'Ủy Thác Ngày',
    'Thuê khô',
    '7',
  ];
  // const periodicMaintenanceLimit =[
  //   4,
  //   6,
  //   12,
  //  ]

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
    setRentalDate(newValue);
    formik.setFieldValue('registrationDeadline', newValue);
  };
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedbackOption, setSelectedbackOption] = useState<string | null>(null);
  const [selectedbackImage, setSelectedbackImage] = useState<File | null>(null);
  const [selectedFrontOption, setSelectedFrontOption] = useState<string | null>(null);
  const [selectedFrontImage, setSelectedFrontImage] = useState<File | null>(null);
  const [selectedLeftOption, setSelectedLeftOption] = useState<string | null>(null);
  const [selectedleftImage, setSelectedLeftImage] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageRightUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImageFrontUrl, setSelectedImageFrontUrl] = useState<string | null>(null);
  const [selectedImageleftUrl, setSelectedImageLeftUrl] = useState<string | null>(null);
  const [selectedImagebackUrl, setSelectedImagebackUrl] = useState<string | null>(null);
  const [selectedOtherOption, setSelectedOtherOption] = useState<string | null>(null);
  const [selectedOtherImage, setSelectedOtherImage] = useState<File | null>(null);
  const [selectedImageOtherUrl, setSelectedImageOtherUrl] = useState<string | null>(null);

  // const handleFileOtherInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedOtherOption("file");
  //     setSelectedOtherImage(event.target.files[0]);
  //     const imageRef = ref(storage, `images/${event.target.files[0].name + v4()}`);
  //     uploadBytes(imageRef, event.target.files[0]).then((snapshot: any) => {
  //       getDownloadURL(snapshot.ref).then((url) => {
  //         setImageUrls((prev: string[]) => [...prev, url]);
  //         setSelectedImageOtherUrl(url);
  //         formik.setFieldValue("ortherImg", url); // set the URL inside the formik field
  //       });
  //     });
  //   }
  // };'

  const handleFileOtherInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileType = file.type;

      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        parentCallbackAlert("error");
        parentCallbackMessageAlert("Chỉ nhận ảnh");
        return;
      }

      setSelectedOtherOption("file");
      setSelectedOtherImage(file);
      const imageRef = ref(storage, `images/${file.name + v4()}`);
      uploadBytes(imageRef, file).then((snapshot: any) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrls((prev: string[]) => [...prev, url]);
          setSelectedImageOtherUrl(url);
          formik.setFieldValue("ortherImg", url); // set the URL inside the formik field
        });
      });
    }
  };




  // const handleFilebackInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedbackOption("file");
  //     const file = event.target.files[0];
  //     setSelectedbackImage(file);
  //     const url = URL.createObjectURL(file);
  //     setSelectedImagebackUrl(url);
  //     formik.setFieldValue("backImg", url); // set the URL inside the formik field
  //   }
  // };
  const handleFilebackInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileType = file.type;

      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        parentCallbackAlert("error");
        parentCallbackMessageAlert("Chỉ nhận ảnh");

        return;
      }

      setSelectedbackOption("file");
      setSelectedbackImage(file);
      const url = URL.createObjectURL(file);
      setSelectedImagebackUrl(url);
      formik.setFieldValue("backImg", url); // set the URL inside the formik field
    }
  };




  // const handleFileLeftInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedLeftOption("file");
  //     const file1 = event.target.files[0];
  //     setSelectedLeftImage(file1);
  //     const url1 = URL.createObjectURL(file1);
  //     setSelectedImageLeftUrl(url1)
  //     formik.setFieldValue("leftImg", url1);
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
      formik.setFieldValue("leftImg", url);
    }
  };


  // const handleFileFrontInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedFrontOption("file")
  //     const file2 = event.target.files[0];
  //     setSelectedFrontImage(file2);
  //     const url2 = URL.createObjectURL(file2);
  //     setSelectedImageFrontUrl(url2)
  //     formik.setFieldValue("frontImg", url2);
  //   }
  // };
  const handleFileFrontInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = reader.result
          ?.toString()
          ?.split(";")[0]
          ?.split(":")[1];
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
          parentCallbackAlert("error");
          parentCallbackMessageAlert("Chỉ nhận ảnh");

          return;
        }

        setSelectedFrontOption("file")
        setSelectedFrontImage(file);
        const url2 = URL.createObjectURL(file);
        setSelectedImageFrontUrl(url2)
        formik.setFieldValue("frontImg", url2);
      };
      reader.readAsDataURL(file);
    }
  };
  // const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedOption("file");
  //     const file3 = event.target.files[0];
  //     setSelectedImage(file3);
  //     const url3 = URL.createObjectURL(file3)
  //     setSelectedImageUrl(url3)
  //     formik.setFieldValue("rightImg", url3);

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
      formik.setFieldValue('rightImg', url);
    }
  };

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
    //priceForDayReceive: "",
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
    carMakeName: null,
    carModelName: null,
    carGenerationName: null,
    carSeriesName: null,
    carTrimName: null,
    carFileCreatedDate: new Date(),
    rentalDate: rentalDate,
    periodicMaintenanceLimit: 0,
    linkForControl: null,
    paymentMethod: null,
    forControlDay: null,
    dayOfPayment: null,
    carSchedules: null,
    registrationDeadline: new Date(),
    carKmLastMaintenance: 0,
    ownerSlitRatio: 0,
    kmTraveled: null,
    maintenanceDate: null,
    maintenanceInvoice: "",
    maintenanceAmount: null,
    tankCapacity: 0,
  };

  const formik = useFormik<Car>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      parkingLotId: Yup.string().required("bãi xe Không được trống!"),
      carMakeId: Yup.string().required("hãng xe Không được trống!"),
      // carmodel: Yup.string().required("Tên xe Không được trống!"),
      carSeriesId: Yup.string().required("Dòng xe Không được trống!"),
      carGenerationId: Yup.string().required("Đời xe Không được trống!"),
      // cartrim: Yup.string().required("truyền động  Không được trống!"),
      carColor: Yup.string().required("màu sắc Không được trống!"),
      carFuel: Yup.string().required("Nhiên Liệu Không được trống!"),
      seatNumber: Yup.string().required("Ghế Không được trống!"),
      rentalMethod: Yup.string().required("Hình thức thuê không được để trống"),
      carOwnerName: Yup.string().required("Tên không được để trống"),
      periodicMaintenanceLimit: Yup.number().required("Ghế Không được trống!").positive("Số lượng ghế phải lớn hơn 0"),
      //   .required("ngày thuê không được trống!")
      //   .nullable()
      //   .typeError("Ngày thuê Không hợp lệ!"),

      speedometerNumberReceive: Yup.string()
        .matches(/^[0-9]*$/, "Công tơ  mét chỉ được nhập số ")
        .required("Số công tơ mét không được để trống"),
      limitedKmForMonthReceive: Yup.number()
        .typeError('Số km  phải là số')
        .positive('Số km  phải là số dương')
        .integer('Số km  phải là số nguyên')
        .required("Số km không được để trống"),
      overLimitedMileageReceive: Yup.number()
        .typeError('Số km phải là số')
        .positive('Số km phải là số dương')
        .integer('Số km phải là số nguyên')
        .required("Số km không được để trống"),
      // SpeedometerNumberReceive: Yup.string()
      //   .matches(/^[0-9]*$/, "Số km chỉ được nhập số ")
      //   .required("Số km không được để trống"),
      priceForDayReceive: Yup.string()
        .matches(/^[0-9]*$/, "Giá tiền cho thuê ngày chỉ được nhập số ")
        .required("Số tiền cho thuê ngày không được để trống"),
      priceForMonthReceive: Yup.string()
        .matches(/^[0-9]*$/, "Giá tiền cho thuê Tháng chỉ được nhập số ")
        .required("Số tiền cho thuê tháng không được để trống"),
      priceForMonth: Yup.string()
        .matches(/^[0-9]*$/, "Giá tiền cho thuê Tháng chỉ được nhập số ")
        .required("Số tiền cho thuê tháng không được để trống"),
      priceForNormalDay: Yup.string()
        .matches(/^[0-9]*$/, "Giá tiền ngày bình thường chỉ được nhập số ")
        .required("Số tiền cho ngày bình thường không được để trống"),
      priceForWeekendDay: Yup.string()
        .matches(/^[0-9]*$/, "Giá tiền  ngày cuối Tuần chỉ được nhập số ")
        .required("Số tiền cho  ngày cuối Tuần không được để trống"),
      limitedKmForMonth: Yup.number()
        .typeError('Km giới hạn trong tháng phải là số')
        .positive('Km giới hạn trong tháng phải là số dương')
        .integer('Km giới hạn trong tháng phải là số nguyên')
        .required("Km giới hạn trong tháng không được để trống"),
      overLimitedMileage: Yup.number()
        .typeError('Số Dặm giới hạng trong tháng  phải là số')
        .positive('Số Dặm giới hạng trong tháng  là số dương')
        .integer('Số Dặm giới hạng trong tháng  là số nguyên')
        .required("Số Dặm giới hạng trong tháng không được để trống"),
      currentEtcAmount: Yup.number()
        .typeError('Số công tơ mét phải là số')
        .positive('Số công tơ mét phải là số dương')
        .integer('Số công tơ mét phải là số nguyên')
        .required("Số Dặm giới hạng trong tháng không được để trống"),
      fuelPercent: Yup.number()
        .min(0, 'phần % nhiên liệu phải lớn hơn hoặc bằng 0')
        .max(100, 'phần % nhiên liệu phải nhỏ hơn hoặc bằng 100')
        .required('phần % nhiên liệu không được để trống'),
      // SpeedometerNumber: Yup.string()
      //   .matches(/^[0-9]*$/, "Công tơ mét số chỉ được nhập số ")
      //   .required("Công tơ mét số không được để trống"),
      carLicensePlates: Yup.string()
        .matches(/^[0-9]{2}[A-Z]{1}[0-9]{4,5}$/, "Biển số xe không hợp lệ!")
        .required("Biển số xe không được để trống!"),
      trackingUsername: Yup.string().required("Tài khoản Tracking không để trống!"),
      trackingPassword: Yup.string().required("mật khẩu Tracking không để trống!"),
      etcusername: Yup.string().required("tài khoản ETC không để trống!"),
      carDescription: Yup.string().min(6, 'Quá Ngắn!').max(10000, 'Quá dài!'),
      etcpassword: Yup.string().required("Mật khẩu ETC không để trống!"),
      linkTracking: Yup.string().required("trang link không được để trống"),
      tankCapacity: Yup.number()
        .typeError('Dung tích bình xăng phải là số !')
        .positive('Dung tích bình xăng  phải là số dương !')
        .integer('Dung tích bình xăng không được để trống !')
        .required("Dung tích bình xăng không được để trống !"),
      // frontImg: Yup.mixed().required(
      //   "Ảnh không được để trống!"
      // ),
      // backImg: Yup.mixed()
      //   .required("Ảnh không được để trống!"),
      // leftImg: Yup.mixed().required(
      //   "Ảnh không được để trống!"
      // ),
      // rightImg: Yup.mixed().required(
      //   "Ảnh không được để trống!"
      // ),

    }),

    onSubmit: async (values: Car, { setSubmitting }) => {
      try {
        const promises = [];

        if (selectedFrontImage) {
          const frontImageRef = ref(storage, `images/${selectedFrontImage.name + v4()}`);
          const frontSnapshot = uploadBytes(frontImageRef, selectedFrontImage);
          promises.push(frontSnapshot);
        } else {
          values.frontImg = userDad?.frontImg; // Set current URL if no new image selected
        }

        if (selectedbackImage) {
          const backImageRef = ref(storage, `images/${selectedbackImage.name + v4()}`);
          const backSnapshot = uploadBytes(backImageRef, selectedbackImage);
          promises.push(backSnapshot);
        } else {
          values.backImg = userDad?.backImg; // Set current URL if no new image selected
        }

        if (selectedleftImage) {
          const leftImageRef = ref(storage, `images/${selectedleftImage.name + v4()}`);
          const leftSnapshot = uploadBytes(leftImageRef, selectedleftImage);
          promises.push(leftSnapshot);
        } else {
          values.leftImg = userDad?.leftImg; // Set current URL if no new image selected
        }

        if (selectedImage) {
          const rightImageRef = ref(storage, `images/${selectedImage.name + v4()}`);
          const rightSnapshot = uploadBytes(rightImageRef, selectedImage);
          promises.push(rightSnapshot);
        } else {
          values.rightImg = userDad?.rightImg; // Set current URL if no new image selected
        }

        const snapshots = await Promise.all(promises);

        const urls = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        );

        if (urls[0]) values.frontImg = urls[0];
        if (urls[1]) values.backImg = urls[1];
        if (urls[2]) values.leftImg = urls[2];
        if (urls[3]) values.rightImg = urls[3];

        const actionAsyncUpdateModal = putCarAsyncApi(values);
        dispatch(actionAsyncUpdateModal).then(() => {
          window.location.reload();
        })

        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });


  const [carModelLoaded, setCarModelLoaded] = useState(false);
  const [carGenerationLoaded, setCarGenerationLoaded] = useState(false);
  const [carSeriesLoaded, setCarSeriesLoaded] = useState(false);
  const [carTrimLoaded, setCarTrimLoaded] = useState(false);
  useEffect(() => {
    if (userDad != null) {
      if (userDad.id !== undefined) {
        formik.setValues(userDad);
      }
    }
    if (userDad === "{}") {
      formik.setValues(initialValues);
    }

    getAllcarMake();
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
  }, [showPopup, openDad, formik.values.carMakeId, formik.values.carModelId, formik.values.carGenerationId, formik.values.carSeriesId, carModelLoaded, carGenerationLoaded, carSeriesLoaded, carTrimLoaded]);

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
  const [speedometerNumberReceive, setspeedometerNumberReceive] = useState('')
  const [speedometerNumber, setspeedometerNumber] = useState('')
  const [carKmLastMaintenance, setcarKmLastMaintenance] = useState('')
  const [limitedKmForMonth, setlimitedKmForMonth] = useState('')
  const [overLimitedMileage, setoverLimitedMileage] = useState('')
  const [priceForDayReceive, setpriceForDayReceive] = useState('')
  const [limitedKmForMonthReceive, setlimitedKmForMonthReceive] = useState('')
  const [overLimitedMileageReceive, setoverLimitedMileageReceive] = useState('')
  const [periodicMaintenanceLimit, setperiodicMaintenanceLimit] = useState('')





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
              Cập nhật hồ sơ người dùng
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}

              <div className="mb-5 mt-2    ">
                <h3 className="font-bold text-3xl"> Thông tin xe</h3>
                <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ các thông tin xe dưới đây (từ trái sang phải)</p>


                <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">
                  {/* 
                  <p className="text-xs mb-1 "> (*)thêm đủ các thông tin xe dưới đây</p> */}


                  <FormControl className="w-full mt-2" >
                    <InputLabel size="small">Hãng xe*</InputLabel>

                    <Select

                      defaultValue={userDad?.carMakeId || ""}
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
                      defaultValue={userDad?.carModelId || ""}
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
                      defaultValue={userDad?.carGenerationId || ""}
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
                    <InputLabel size="small">Đời xe*</InputLabel>
                    <Select
                      size="small"
                      defaultValue={userDad?.carSeriesId}
                      label={"Đời xe"}
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
                      defaultValue={userDad?.carTrimId || ""}
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
                      defaultValue={userDad?.modelYear || ""}
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
                      defaultValue={userDad?.carColor || ""}
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
                      {carColor.map((model) => (
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
                      defaultValue={userDad?.seatNumber || ""}
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
                      defaultValue={userDad?.carFuel || ""}
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
                      {carFuel.map((model: any) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.carFuel && formik.touched.carFuel ? (
                      <div className="text-red-600">{formik.errors.carFuel}</div>
                    ) : null}
                  </FormControl>

                  <FormControl className="w-full  mt-2 ">
                    <InputLabel size="small"  >Bãi xe*</InputLabel>
                    <Select
                      size="small"
                      defaultValue={userDad?.parkingLotId}
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
                        <MenuItem key={model.id} value={model.id}>
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
                      defaultValue={userDad?.carLicensePlates || ""}
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
                      defaultValue={userDad?.currentEtcAmount || ""}
                      size="small"
                      id="outlined-basic12"
                      label="số tiền còn trong tài khoản ETC*" //CurrentEtcAmount
                      name="currentEtcAmount"
                      fullWidth
                      onChange={formik.handleChange}
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
                      defaultValue={userDad?.fuelPercent || ""}
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
                      defaultValue={userDad?.speedometerNumber || ""}
                      size="small"
                      id="outlined-basic14"
                      label="Số đồng hồ cập nhật lần cuối*(km)" //SpeedometerNumber
                      name="speedometerNumber"
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.speedometerNumber && formik.errors.speedometerNumber
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.speedometerNumber && formik.touched.speedometerNumber ? (
                      <div className="text-red-600">{formik.errors.speedometerNumber}</div>
                    ) : null}
                  </div>
                  <div className="w-full mt-2 ">
                    <TextField
                      defaultValue={userDad?.carKmLastMaintenance || ""}
                      size="small"
                      id="outlined-basic14"
                      label="Số km bảo trì lần cuối(km)* " //SpeedometerNumber
                      name="carKmLastMaintenance"
                      fullWidth
                      onChange={formik.handleChange}
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
                  <div className="mt-2 ">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          label="Hạn cuối đăng kiểm*"
                          disabled
                          value={userDad?.registrationDeadline}
                          inputFormat="DD/MM/YYYY "
                          onChange={(newValue) =>
                            handleChange1(newValue == null ? today : newValue)
                          }
                          minDate={today}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              error={formik.errors.rentalDate ? true : undefined}
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                      {formik.errors.registrationDeadline && (
                        <div className="text mt-1 text-xs text-red-600 font-semibold">
                          {formik.errors.registrationDeadline as string}
                        </div>
                      )}
                    </LocalizationProvider>
                  </div>
                  <div className="w-full mt-2 " >
                    <TextField
                      type="number"
                      size="small"
                      defaultValue={userDad?.tankCapacity || ""}
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



                <div className="w-full mt-2 ">
                  <TextField
                    size="small"
                    id="outlined-basic3"
                    defaultValue={userDad?.carDescription}
                    label="Mô tả xe" //CarStatusDescription

                    variant="outlined"
                    rows={3}
                    multiline
                    name="carDescription"
                    fullWidth
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

              <div className="mb-5 mt-2  ">
                <h3 className="font-bold text-3xl"> Bảng giá cho thuê</h3>
                <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ  giá cho thuê dưới đây</p>
                <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">

                  {/* <h3 className="bg-white text-black w-36 -mt-8 mb-2">  Bảng giá cho thuê</h3> */}
                  <div className="w-full mt-2">
                    <TextField
                      type="number"
                      defaultValue={userDad?.priceForNormalDay || ""}
                      size="small"
                      id="outlined-basic8"
                      label="Giá cho ngày bình thường*"  //PriceForNormalDay
                      variant="outlined"
                      fullWidth
                      name="priceForNormalDay"
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad.priceForWeekendDay || ""}
                      size="small"
                      id="outlined-basic15"
                      label="Giá cho ngày cuối  tuần* " //PriceForWeekendDay
                      name="priceForWeekendDay"
                      fullWidth
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.priceForMonth || ""}
                      size="small"
                      id="outlined-basic9"
                      label="Giá cho thuê tháng*"
                      name="priceForMonth"
                      fullWidth
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.limitedKmForMonth || ""}
                      size="small"
                      id="outlined-basic10"
                      label="Giới hạn số km trong tháng(km/tháng)*"  //Limited Km ForMonth
                      name="limitedKmForMonth"
                      fullWidth
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.overLimitedMileage || ""}
                      size="small"
                      id="outlined-11"
                      label="Phí vượt km trong tháng(Vnd/km)*" //Over LimitedMileage
                      name="overLimitedMileage"
                      fullWidth
                      onChange={formik.handleChange}
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
                      defaultValue={userDad?.carOwnerName}
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
                      // value={formik.values.rentalMethod}
                      name="rentalMethod"
                      defaultValue={userDad?.rentalMethod}
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
                          label="Ngày Thuê*"
                          value={userDad?.rentalDate || ""}
                          disabled
                          inputFormat="DD/MM/YYYY "
                          onChange={(newValue) =>
                            handleChange(newValue == null ? today : newValue)
                          }
                          minDate={today}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              error={formik.errors.rentalDate ? true : undefined}
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                      {/* {formik.errors.rentalDate && (
                          <div className="text mt-1 text-xs text-red-600 font-semibold">
                            {formik.errors.rentalDate as string}
                          </div>
                        )} */}
                    </LocalizationProvider>
                  </div>
                  <div className="w-full mt-3 ">
                    <TextField
                      type="number"
                      defaultValue={userDad?.speedometerNumberReceive || ""}
                      size="small"
                      id="outlined-basic5"
                      label="Số km ngày nhận(km)"  //SpeedometerNumberReceive đầu vào 
                      variant="outlined"
                      fullWidth
                      name="speedometerNumberReceive"
                      onChange={formik.handleChange}
                      error={
                        formik.touched.speedometerNumberReceive && formik.errors.speedometerNumberReceive
                          ? true
                          : undefined
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
                      defaultValue={userDad?.ownerSlitRatio || ""}
                      size="small"
                      id="outlined-basic6"
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
                      type="number"
                      defaultValue={userDad?.priceForDayReceive || ""}
                      size="small"
                      id="outlined-basic6"
                      label="Giá cho ngày thuê*(Vnd)"
                      fullWidth
                      name="priceForDayReceive"  // đầu vào
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.priceForMonthReceive || ""}
                      size="small"
                      id="outlined-basic7"
                      label="Giá cho tháng thuê*(Vnd)"  //Price For Month Receive // đầu vào
                      variant="outlined"
                      fullWidth
                      name="priceForMonthReceive"
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.limitedKmForMonthReceive || ""}
                      size="small"
                      id="outlined-basic20"
                      label="Giới hạn số km trong  tháng(km)*  "
                      variant="outlined"
                      name="limitedKmForMonthReceive" // đầu vào
                      fullWidth
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.overLimitedMileageReceive || ""}
                      size="small"
                      id="outlined-basic21"
                      label="Phí vượt km trong tháng(Vnd/km)* " // đầu vào
                      variant="outlined"
                      name="overLimitedMileageReceive"
                      fullWidth
                      onChange={formik.handleChange}
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
                      type="number"
                      defaultValue={userDad?.periodicMaintenanceLimit || ""}
                      size="small"
                      id="outlined-basic000"
                      label="Định mức bảo trì (km)*"
                      variant="outlined"
                      name="periodicMaintenanceLimit"
                      fullWidth
                      onChange={formik.handleChange}
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

              <div className="mt-2 mb-5">
                <h3 className="font-bold text-3xl"> Tài khoản</h3>
                <p className="text-xs mb-1 text-red-500 "> (*)Thêm đủ tài khoản dưới đây</p>
                <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5">
                  <div className="w-full mt-2 ">
                    <TextField
                      defaultValue={userDad?.linkTracking}
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

              <div className="mt-2 mb-5">
                <h3 className="font-bold text-3xl"> Hình ảnh</h3>
                <div className="grid grid-cols-3 mx-2 gap-2 gap-x-5">
                  <FormControl className="mb-2">
                    <div className="item_box_image ">
                      <div className="image-option1">

                        <Button
                          variant="contained"
                          component="label"
                          className="bg-white text-[#1976d2] shadow-none rounded-md "
                        >
                          <AddPhotoAlternateIcon />Ảnh  mặt phải *
                          <input
                            type="file"
                            hidden
                            id="image1"
                            onChange={handleFileInputChange}
                          />
                        </Button>
                      </div>

                      {formik.touched.rightImg &&
                        formik.errors.rightImg && (
                          <div className="text-red-600">
                            {formik.errors.rightImg}
                          </div>
                        )}
                      {selectedImage == undefined ? (
                        <img
                          alt=""
                          className=" h-24 w-24 my-5"
                          src={userDad?.rightImg}
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
                  <FormControl className="mb-2" >
                    <div className="item_box_image5 ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "

                      >
                        <AddPhotoAlternateIcon /> Ảnh mặt sau *
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          id="image2"
                          onChange={handleFilebackInputChange}
                        />
                      </Button>
                      {formik.touched.backImg &&
                        formik.errors.backImg && (
                          <div className="text-red-600">
                            {formik.errors.backImg}
                          </div>
                        )}
                      {selectedbackImage == undefined ? (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={userDad?.backImg}
                        />
                      ) : (
                        selectedbackImage && (
                          <img
                            alt=""
                            className="mx-auto h-24 w-24 my-5"
                            src={
                              selectedImagebackUrl ? window.URL.createObjectURL(selectedbackImage) : ''
                            }
                          />
                        )
                      )}
                    </div>
                  </FormControl>
                  <FormControl className="mb-2">
                    <div className="item_box_image2 ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon /> Ảnh  bên trái*
                        <input
                          type="file"
                          hidden
                          id="image4"
                          onChange={handleFileLeftInputChange}
                        />
                      </Button>
                      {formik.touched.leftImg &&
                        formik.errors.leftImg && (
                          <div className="text-red-600">
                            {formik.errors.leftImg}
                          </div>
                        )}

                      {selectedleftImage == undefined ? (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={userDad?.leftImg}
                        />
                      ) : (
                        selectedleftImage && (
                          <img
                            alt=""
                            className="mx-auto h-24 w-24 my-5"
                            src={
                              selectedImageleftUrl ? window.URL.createObjectURL(selectedleftImage) : ''
                            }
                          />
                        )
                      )}
                    </div>
                  </FormControl>
                  <FormControl className="mb-2" >
                    <div className="item_box_image1 ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon />Ảnh  đằng trước  *
                        <input
                          type="file"
                          hidden
                          id="image3"
                          onChange={handleFileFrontInputChange}
                        />
                      </Button>
                      {formik.touched.frontImg &&
                        formik.errors.frontImg && (
                          <div className="text-red-600">
                            {formik.errors.frontImg}
                          </div>
                        )}

                      {selectedFrontImage == undefined ? (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={userDad?.frontImg}
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
                  <FormControl className="mb-2">
                    <div className="item_box_image3 ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon /> otherImg *
                        <input
                          type="file"
                          hidden
                          id="image5"
                          onChange={handleFileOtherInputChange}
                        />
                      </Button>

                      {selectedOtherImage == undefined ? (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={userDad?.ortherImg}
                        />
                      ) : (
                        selectedOtherImage && (
                          <img
                            alt=""
                            className="mx-auto h-24 w-24 my-5"
                            src={
                              selectedImageOtherUrl ? window.URL.createObjectURL(selectedOtherImage) : ''
                            }
                          />
                        )
                      )}
                    </div>
                  </FormControl>
                </div>
              </div>
              {/* 
                <div className="mb-5 mt-2 border-[1px] border-[#8d99ae] rounded-md bs bg-white p-5  items-start flex-nowrap">
                  <h3 className="bg-white text-black w-20 -mt-8 mb-2"> Hình ảnh </h3>
                  <p className="text-xs mb-1 "> (*)thêm đủ các thông tin xe dưới đây</p>
                  <FormControl className="mb-2">
                  <div className="item_box_image ">
                  <div className="image-option1">

                  <Button
                      variant="contained"
                      component="label"
                      className="bg-white text-[#1976d2] shadow-none rounded-md "
                    >
                      <AddPhotoAlternateIcon />Ảnh  mặt phải *
                      <input
                        type="file"
                        hidden
                        id="image1"
                        onChange={handleFileInputChange}
                      />
                    </Button>
                  </div>
                  
                    {formik.touched.rightImg &&
                      formik.errors.rightImg && (
                        <div className="text-red-600">
                          {formik.errors.rightImg}
                        </div>
                      )}
                    {selectedImage == undefined ? (
                      <img
                        alt=""
                        className=" h-24 w-24 my-5"
                        src={userDad?.rightImg}
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
                <FormControl className="mb-2" >
                  <div className="item_box_image5 ">
                    <Button
                      variant="contained"
                      component="label"
                      className="bg-white text-[#1976d2] shadow-none rounded-md "

                    >
                      <AddPhotoAlternateIcon /> Ảnh mặt sau *
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        id="image2"
                        onChange={handleFilebackInputChange}
                      />
                    </Button>
                    {formik.touched.backImg &&
                      formik.errors.backImg && (
                        <div className="text-red-600">
                          {formik.errors.backImg}
                        </div>
                      )}
                    {selectedbackImage == undefined ? (
                      <img
                        alt=""
                        className="mx-auto h-24 w-24 my-5"
                        src={userDad?.backImg}
                      />
                    ) : (
                      selectedbackImage && (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={
                            selectedImagebackUrl ? window.URL.createObjectURL(selectedbackImage) : ''
                          }
                        />
                      )
                    )}
                  </div>
                </FormControl>
                <FormControl className="mb-2">
                  <div className="item_box_image2 ">
                    <Button
                      variant="contained"
                      component="label"
                      className="bg-white text-[#1976d2] shadow-none rounded-md "
                    >
                      <AddPhotoAlternateIcon /> Ảnh  bên trái*
                      <input
                        type="file"
                        hidden
                        id="image4"
                        onChange={handleFileLeftInputChange}
                      />
                    </Button>
                    {formik.touched.leftImg &&
                      formik.errors.leftImg && (
                        <div className="text-red-600">
                          {formik.errors.leftImg}
                        </div>
                      )}

                    {selectedleftImage == undefined ? (
                      <img
                        alt=""
                        className="mx-auto h-24 w-24 my-5"
                        src={userDad?.leftImg}
                      />
                    ) : (
                      selectedleftImage && (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={
                            selectedImageleftUrl ? window.URL.createObjectURL(selectedleftImage) : ''
                          }
                        />
                      )
                    )}
                  </div>
                </FormControl>
                <FormControl className="mb-2" >
                  <div className="item_box_image1 ">
                    <Button
                      variant="contained"
                      component="label"
                      className="bg-white text-[#1976d2] shadow-none rounded-md "
                    >
                      <AddPhotoAlternateIcon />Ảnh  đằng trước  *
                      <input
                        type="file"
                        hidden
                        id="image3"
                        onChange={handleFileFrontInputChange}
                      />
                    </Button>
                    {formik.touched.frontImg &&
                      formik.errors.frontImg && (
                        <div className="text-red-600">
                          {formik.errors.frontImg}
                        </div>
                      )}

                    {selectedFrontImage == undefined ? (
                      <img
                        alt=""
                        className="mx-auto h-24 w-24 my-5"
                        src={userDad?.frontImg}
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
                <FormControl className="mb-2">
                  <div className="item_box_image3 ">
                    <Button
                      variant="contained"
                      component="label"
                      className="bg-white text-[#1976d2] shadow-none rounded-md "
                    >
                      <AddPhotoAlternateIcon /> otherImg *
                      <input
                        type="file"
                        hidden
                        id="image5"
                        onChange={handleFileOtherInputChange} 
                      />
                    </Button>

                    {selectedOtherImage == undefined ? (
                      <img
                        alt=""
                        className="mx-auto h-24 w-24 my-5"
                        src={userDad?.ortherImg}
                      />
                    ) : (
                      selectedOtherImage && (
                        <img
                          alt=""
                          className="mx-auto h-24 w-24 my-5"
                          src={
                            selectedImageOtherUrl ? window.URL.createObjectURL(selectedOtherImage) : ''
                          }
                        />
                      )
                    )}
                  </div>
                </FormControl>
              


            

                </div> */}



            </DialogContent>
            <DialogActions>
              <Button type="submit">Thay đổi</Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };

  return <>{renderuUpdateModalUI()}</>;
};
