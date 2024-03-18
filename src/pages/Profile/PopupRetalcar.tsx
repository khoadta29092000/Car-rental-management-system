import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  styled
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
//   import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import PopupImage from "../../Components/PopupImage";
import PopupLoading from "../../Components/PopupLoading";
import { contractgroupModel } from "../../models/contractgroupModel";
import { getcarMakeAsyncApi } from "../../redux/CarMakeReducer/CarMakeReducer";
import { getCarModelcarAsyncApi } from "../../redux/CarModelReducer/CarModelReducer";
import {
  getCarContractgroupReducercarAsyncApi,
  postCarContractgroupReducercarAsyncApi,
} from "../../redux/ContractgroupReducer/ContractgroupReducer";
import { getCustomerinfoByCMNDReducerAsyncApi } from "../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { DispatchType, RootState } from "../../redux/store";
import { storage } from "../../util/FirebaseConfig";
// <<<<<<< HEAD
// const apiKey = "cnILsGzlt93LXeRJPcPDrHzDyMl2lvNr";
// =======
import 'dayjs/locale/en';
const apiKey = "cnILsGzlt93LXeRJPcPDrHzDyMl2lvNr";


const apiUrl = "https://api.fpt.ai/vision/idr/vnm";
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
export const PopupRetalcar = (props: any) => {
  //isAdd == true => Call APi Add
  //isAdd == false => call Api Update
  const {
    openRetal,
    parentCallbackAlert,
    parentCallbackMessageAlert,
    parentCallback,
    RetalDad,
    alertAction,
  } = props;

  const dispatch: DispatchType = useDispatch();

  const { customerInfoDetail } = useAppSelector(
    (state: RootState) => state.customerinfo
  );
  const today = dayjs();
  const [rend, setRend] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [loading, setLoading] = useState(false);
  //const [messageAlert, parentCallbackMessageAlert] = useState("");
  // const [timeStart] = useState(new Date());
  // const [timeEnd] = useState(new Date());
  const [timeStart, setTimestart] = useState(dayjs().add(1, "day"));

  const [timeEnd, setTimeEnd] = useState(dayjs().add(2, "day"));
  const [cmndBeforeAlready, setCmndBeforeAlready] = useState(null);
  const [cmndAfterAlready, setCmndAfterAlready] = useState(null);
  const [gplxBeforeAlready, setGplxBeforeAlready] = useState(null);
  const [gplxAfterAlready, setGplxAfterAlready] = useState(null);
  const [dateCMNDAlready, setDateCMNDAlready] = useState(null);

  const [selectedFrontOption, setSelectedFrontOption] = useState<string | null>(
    null
  );
  const [selectedImageCMNDBefore, setSelectedImageCMNDBefore] =
    useState<File | null>(null);
  const [citizenIdentifyImage2, setSelectedImageCMNDAfter] =
    useState<File | null>(null);
  const [drivingLisenceImage1, setSelectedImageGPLXBefore] =
    useState<File | null>(null);
  const [drivingLisenceImage2, setSelectedImageGPLXAfter] =
    useState<File | null>(null);
  const [selectedImageFrontUrl, setSelectedImageFrontUrl] = useState<
    string | null
  >(null);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [
    selectedcitizenIdentifyImage2Option,
    setSelectedcitizenIdentifyImage2Option,
  ] = useState<string | null>(null);
  const [
    selectedImagcitizenIdentifyImageUrl,
    setSelectedImagecitizenIdentifyImageUrl,
  ] = useState<string | null>(null);
  const [
    selecteddrivingLisenceImage1Image1Option,
    setSelecteddrivingLisenceImage1Image1Option,
  ] = useState<string | null>(null);
  const [
    selectedImagdrivingLisenceImage1ImageUrl,
    setSelectedImagedrivingLisenceImage1ImageUrl,
  ] = useState<string | null>(null);
  const [
    selecteddrivingLisenceImageưImage1Option,
    setSelecteddrivingLisenceImageưImage1Option,
  ] = useState<string | null>(null);
  const [
    selectedImagdrivingLisenceImageưImageUrl,
    setSelectedImagedrivingLisenceImageưImageUrl,
  ] = useState<string | null>(null);
  const [selectedOtherOption, setSelectedOtherOption] = useState<string | null>(
    null
  );
  const [selectedOtherImage, setSelectedOtherImage] = useState<File | null>(
    null
  );
  const [selectedImageOtherUrl, setSelectedImageOtherUrl] = useState<
    string | null
  >(null);

  function handleChangeTimeCCCD(newTimestart: any) {
    if (newTimestart === null) {
      formik.setFieldValue(
        "citizenIdentificationInfoDateReceive",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      formik.setFieldValue(
        "citizenIdentificationInfoDateReceive",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }

  const handleFiledrivingLisenceImage2InputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

        setSelecteddrivingLisenceImageưImage1Option("file");
        setSelectedImageGPLXAfter(file);
        const url = URL.createObjectURL(file);
        setSelectedImagedrivingLisenceImageưImageUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFiledrivingLisenceImage1InputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file1 = event.target.files[0];
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
        setSelecteddrivingLisenceImage1Image1Option("file");
        setSelectedImageGPLXBefore(file1);
        const url = URL.createObjectURL(file1);
        setSelectedImagedrivingLisenceImage1ImageUrl(url);
      };
      reader.readAsDataURL(file1);
    }
  };
  const handleFilecitizenIdentifyImage2InputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setLoading(true);
      const file2 = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = reader.result
          ?.toString()
          ?.split(";")[0]
          ?.split(":")[1];
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
          parentCallbackAlert("error");
          parentCallbackMessageAlert("Chỉ nhận ảnh");
          setLoading(false);
          return;
        } else {
          if (event.target.files) {
            event.preventDefault(); // Prevents the default form submission behavior
            const formData = new FormData();
            formData.append("image", event.target.files[0]); // Add the selected image file to the form data
            const response = fetch(apiUrl, {
              method: "POST",
              headers: {
                "api-key": apiKey,
              },
              body: formData,
            })
              .then((response) => response.json())
              .then((result) => {
                if (result) {
                  setLoading(false);
                  const dateString = result.data[0].issue_date;
                  const dateParts = dateString.split("/");
                  const year = Number(dateParts[2]);
                  const month = Number(dateParts[1]) - 1; // Months are zero-indexed in JS
                  const day = Number(dateParts[0]);
                  const date = new Date(Date.UTC(year, month, day));
                  const formattedDate = date.toISOString(); // "2019-11-09T00:00:00.000Z"
                  formik.setFieldValue(
                    "customerCitizenIdentificationInfoDate",
                    formattedDate
                  );
                  formik.setFieldValue(
                    "customerCitizenIdentificationInfoAddress",
                    result.data[0].issue_loc
                  );
                  setSelectedcitizenIdentifyImage2Option("file");
                  setSelectedImageCMNDAfter(file2);
                  const url2 = URL.createObjectURL(file2);
                  setSelectedImagecitizenIdentifyImageUrl(url2);
                }
              })
              .catch((error) => {
                setLoading(false);
                parentCallbackAlert("error");
                parentCallbackMessageAlert("chọn đúng mặt sau CMND");
                formik.setFieldValue(
                  "customerCitizenIdentificationInfoDate",
                  new Date()
                );
                formik.setFieldValue(
                  "customerCitizenIdentificationInfoAddress",
                  ""
                );
              });
          }
        }
      };

      reader.readAsDataURL(file2);
    }
  };

  function handleFileCMNDBeforeInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      setLoading(true);
      const file3 = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileType = reader.result
          ?.toString()
          ?.split(";")[0]
          ?.split(":")[1];
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
          parentCallbackAlert("error");
          parentCallbackMessageAlert("Chỉ nhận ảnh");
          setLoading(false);
          return;
        } else {
          if (event.target.files) {
            event.preventDefault(); // Prevents the default form submission behavior
            const formData = new FormData();
            formData.append("image", event.target.files[0]); // Add the selected image file to the form data
            const response = fetch(apiUrl, {
              method: "POST",
              headers: {
                "api-key": apiKey,
              },
              body: formData,
            })
              .then((response) => response.json())
              .then((result) => {
                if (result) {
                  setLoading(false);
                  if (result.data[0].id != null) {
                    dispatch(
                      getCustomerinfoByCMNDReducerAsyncApi(result.data[0].id)
                    )
                      .then((response: any) => {
                        if (response.payload != undefined) {

                          formik.setFieldValue(
                            "customerCitizenIdentificationInfoAddress",
                            response.payload.citizenIdentificationInfoAddress
                          );


                          formik.setFieldValue(
                            "customerCitizenIdentificationInfoDate",

                            response.payload.citizenIdentificationInfoDateReceive

                          );

                          setDateCMNDAlready(
                            response.payload
                              .citizenIdentificationInfoDateReceive
                          );
                          formik.setFieldValue(
                            "citizenIdentificationInfoNumber",
                            response.payload.citizenIdentificationInfoNumber
                          );
                          formik.setFieldValue(
                            "customerAddress",
                            response.payload.customerAddress
                          );
                          formik.setFieldValue(
                            "companyInfo",
                            response.payload.companyInfo
                          );
                          formik.setFieldValue(
                            "customerEmail",
                            response.payload.customerEmail
                          );
                          formik.setFieldValue(
                            "customerName",
                            response.payload.customerName
                          );
                          formik.setFieldValue(
                            "customerSocialInfoFacebook",
                            response.payload.customerSocialInfoFacebook
                          );
                          formik.setFieldValue(
                            "customerSocialInfoZalo",
                            response.payload.customerSocialInfoZalo
                          );
                          formik.setFieldValue(
                            "customerPhoneNumber",
                            response.payload.phoneNumber
                          );
                          formik.setFieldValue(
                            "relativeTel",
                            response.payload.relativeTel
                          );
                          formik.setFieldValue(
                            "customerCitizenIdentificationInfoNumber",
                            response.payload.citizenIdentificationInfoNumber
                          );
                          setCmndBeforeAlready(
                            response.payload.customerFiles[0].documentImg
                          );
                          setCmndAfterAlready(
                            response.payload.customerFiles[1].documentImg
                          );
                          setGplxBeforeAlready(
                            response.payload.customerFiles[2].documentImg
                          );
                          setGplxAfterAlready(
                            response.payload.customerFiles[3].documentImg
                          );
                        } else {
                          formik.setFieldValue(
                            "customerCitizenIdentificationInfoNumber",
                            result.data[0].id
                          );
                          formik.setFieldValue(
                            "customerAddress",
                            result.data[0].address
                          );
                          formik.setFieldValue(
                            "customerName",
                            result.data[0].name
                          );
                          setLoading(false);
                        }
                      })
                      .catch((error) => {

                      });
                    setSelectedFrontOption("file");
                    setSelectedImageCMNDBefore(file3);
                    const url3 = URL.createObjectURL(file3);
                    setSelectedImageFrontUrl(url3);
                  } else {
                    setLoading(false);
                    parentCallbackAlert("error");
                    parentCallbackMessageAlert("chọn đúng mặt trước CMND");
                    formik.setFieldValue(
                      "customerCitizenIdentificationInfoNumber",
                      ""
                    );
                    formik.setFieldValue("customerAddress", "");
                    formik.setFieldValue("customerName", "");
                  }
                }
              })
              .catch((error) => {
                setLoading(false);
                parentCallbackAlert("error");
                parentCallbackMessageAlert("chọn đúng mặt trước CMND");
                formik.setFieldValue(
                  "customerCitizenIdentificationInfoNumber",
                  ""
                );
                formik.setFieldValue("customerAddress", "");
                formik.setFieldValue("customerName", "");
              });
          }
        }
      };

      reader.readAsDataURL(file3);
    }
  }
  const [selectedImagePasspord, setselectedImagePasspord] = useState<
    File | undefined
  >(undefined);

  const moment = require("moment");
  const { contractgroup, error } = useSelector(
    (state: RootState) => state.ContractGroup
  );
  const { carMake } = useSelector((state: RootState) => state.carMake); //r
  const { carModels } = useSelector((state: RootState) => state.CarModel); //tên xe

  let callbackFunctionAlert = (childData: any) => {
    parentCallbackAlert(childData);
  };
  const getAllcarMake = () => {
    const actionAsync = getcarMakeAsyncApi();
    dispatch(actionAsync);
  };

  const getAllCarModel = (carMakeId: number) => {
    const actionAsync = getCarModelcarAsyncApi(carMakeId);
    dispatch(actionAsync);
  };
  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);
  let filter = {
    pagination: { page: 1, pageSize: 10 },
    status: "",
    id: userProfile.id,
    CitizenIdentificationInfoNumber: null
  };
  const initialValues = {
    userId: userProfile.id,
    carId: 0,
    rentPurpose: "",
    rentFrom: timeStart || today,
    rentTo: timeEnd || today,
    requireDescriptionInfoCarBrand: "",
    requireDescriptionInfoSeatNumber: 0,
    requireDescriptionInfoCarColor: "",
    customerPhoneNumber: "",
    customerSocialInfoZalo: "",
    customerSocialInfoFacebook: "",
    relativeTel: "",
    customerName: "",
    companyInfo: "",
    customerAddress: "",
    deliveryAddress: "",
    customerCitizenIdentificationInfoNumber: "",
    customerCitizenIdentificationInfoAddress: "",
    customerCitizenIdentificationInfoDate: null,
    requireDescriptionInfoPriceForDay: 0, // giá tiền mong muốn
    requireDescriptionInfoGearBox: "", // hộp số của xe
    customerEmail: "", //thêm email khách hàng
    customerFiles: [
      {
        typeOfDocument: "",
        title: "",
        documentImg: "",
        documentDescription: "",
      },
      {
        typeOfDocument: "",
        title: "",
        documentImg: "",
        documentDescription: "",
      },
      {
        typeOfDocument: "",
        title: "",
        documentImg: "",
        documentDescription: "",
      },
      {
        typeOfDocument: "",
        title: "",
        documentImg: "",
        documentDescription: "",
      },
    ],
  };
  const formik = useFormik<contractgroupModel>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      customerCitizenIdentificationInfoNumber: Yup.string()
        .matches(/^[0-9]{9}$|^[0-9]{12}$/, "CCCD/CMND không hợp lệ!")
        .required("CMND/CCCD không được trống!"),
      customerCitizenIdentificationInfoAddress: Yup.string()
        .nullable()
        .required("Nơi cấp của CMND/CCCD không được trống!"),
      customerEmail: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      // customerCitizenIdentificationInfoDate: Yup.date()
      //   .nullable()
      //   .required("Ngày cấp của CMND/CCCD không được trống!")
      //   .nullable()
      //   .typeError("Ngày cấp của CMND/CCCD không hợp lệ!")
      //   .max(new Date(), "Ngày cấp của CMND/CCCD không hợp lệ!"),
      customerAddress: Yup.string().required(
        "Địa chỉ khách hàng  không được trống!"
      ),
      deliveryAddress: Yup.string().required(
        "Địa chỉ giao xe  không được trống!"
      ),
      customerName: Yup.string()
        .matches(
          /^[a-zA-ZÀ-ỹ\s]+$/,
          "Tên khách hàng chỉ được nhập chữ và khoảng trắng!"
        )
        .required("Tên khách hàng không được để trống!"),

      // requireDescriptionInfoYearCreate: Yup.number()
      //   .positive("phiên bản  phải lớn hơn 0")
      //   .required("phiên bản Không được trống!"),
      requireDescriptionInfoSeatNumber: Yup.number()
        .positive("Số ghế không được trống!")
        .required("Số ghế không được trống!"),

      customerPhoneNumber: Yup.string()
        .matches(/^\+?[0-9]{10}$/, "Số điện thoại không hợp lệ!")
        .required("Số điện thoại không được để trống!"),

      relativeTel: Yup.string()
        .matches(/^\+?[0-9]{10}$/, "Số điện thoại không hợp lệ!")
        .required("Số điện thoại không được để trống!"),

      // citizenIdentifyImage2: Yup.mixed()
      //   .required("CCCD/CMND mặt sau không được trống!"),
      // citizenIdentifyImage1: Yup.mixed()
      //   .required("CCCD/CMND mặt trước không được trống!"),

      // drivingLisenceImage1: Yup.mixed().required(
      //   "GPLX mặt trước không được trống!"
      // ),
      // drivingLisenceImage2: Yup.mixed().required(
      //   "GPLX mặt trước không được trống!"
      // ),

      rentFrom: Yup.date()
        .required("Ngày bắt đầu không được trống!")
        .nullable()
        .typeError("Ngày bắt đầu không hợp lệ!")
        .min(new Date(), "Ngày bắt đầu không hợp lệ"),
      rentTo: Yup.date()
        .min(Yup.ref("rentTo"), "Ngày kết thúc không thể trước ngày bắt đầu !")
        .required("Ngày kết thúc không được trống!")
        .nullable()
        .typeError("Ngày kết thúc không hợp lệ!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const promises = [];

        if (selectedImageCMNDBefore) {
          const frontImageRef = ref(
            storage,
            `imgCCCD/${selectedImageCMNDBefore.name + v4()}`
          );
          const frontSnapshot = uploadBytes(
            frontImageRef,
            selectedImageCMNDBefore
          );
          promises.push(frontSnapshot);
        }

        if (citizenIdentifyImage2) {
          const backImageRef = ref(
            storage,
            `imgCCCD/${citizenIdentifyImage2.name + v4()}`
          );
          const backSnapshot = uploadBytes(backImageRef, citizenIdentifyImage2);
          promises.push(backSnapshot);
        }

        if (drivingLisenceImage2) {
          const leftImageRef = ref(
            storage,
            `imgCCCD/${drivingLisenceImage2.name + v4()}`
          );
          const leftSnapshot = uploadBytes(leftImageRef, drivingLisenceImage2);
          promises.push(leftSnapshot);
        }

        if (drivingLisenceImage1) {
          const rightImageRef = ref(
            storage,
            `imgCCCD/${drivingLisenceImage1.name + v4()}`
          );
          const rightSnapshot = uploadBytes(
            rightImageRef,
            drivingLisenceImage1
          );
          promises.push(rightSnapshot);
        }

        const snapshots = await Promise.all(promises);

        const urls = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        );

        // values.citizenIdentifyImage1 = urls[0];
        // values.citizenIdentifyImage2 = urls[1];
        // values.drivingLisenceImage1 = urls[2];
        // values.drivingLisenceImage2 = urls[3];

        const CustomerFiles =
          cmndAfterAlready == null
            ? [
              {
                id: 0,
                customerInfoId: 0,
                typeOfDocument: "Bản gốc",
                title: "Ảnh CMND/CCCD mặt trước",
                documentImg: urls[0],
                documentDescription: null,
              },
              {
                id: 0,
                customerInfoId: 0,
                typeOfDocument: "Bản gốc",
                title: "Ảnh CMND/CCCD mặt Sau",
                documentImg: urls[1],
                documentDescription: null,
              },
              {
                id: 0,
                customerInfoId: 0,
                typeOfDocument: "Bản gốc",
                title: "Ảnh GPLX mặt trước",
                documentImg: urls[3],
                documentDescription: null,
              },
              {
                id: 0,
                customerInfoId: 0,
                typeOfDocument: "Bản gốc",
                title: "Ảnh GPLX mặt sau",
                documentImg: urls[2],
                documentDescription: null,
              },
            ]
            : [
              {
                id: customerInfoDetail?.customerFiles[0].id,
                customerInfoId:
                  customerInfoDetail?.customerFiles[0].customerInfoId,
                typeOfDocument: "Bản gốc",
                title: "Ảnh CMND/CCCD mặt trước",
                documentImg: urls[0],
                documentDescription: null,
              },
              {
                id: customerInfoDetail?.customerFiles[1].id,
                customerInfoId:
                  customerInfoDetail?.customerFiles[1].customerInfoId,
                typeOfDocument: "Bản gốc",
                title: "Ảnh CMND/CCCD mặt Sau",
                documentImg: cmndAfterAlready != null ? cmndAfterAlready : "",
                documentDescription: null,
              },
              {
                id: customerInfoDetail?.customerFiles[2].id,
                customerInfoId:
                  customerInfoDetail?.customerFiles[2].customerInfoId,
                typeOfDocument: "Bản gốc",
                title: "Ảnh GPLX mặt trước",
                documentImg:
                  gplxBeforeAlready != null ? gplxBeforeAlready : "",
                documentDescription: null,
              },
              {
                id: customerInfoDetail?.customerFiles[3].id,
                customerInfoId:
                  customerInfoDetail?.customerFiles[3].customerInfoId,
                typeOfDocument: "Bản gốc",
                title: "Ảnh GPLX mặt sau",
                documentImg: gplxAfterAlready != null ? gplxAfterAlready : "",
                documentDescription: null,
              },
            ];

        const actionAsyncLogin = postCarContractgroupReducercarAsyncApi({
          ...values,
          customerFiles: CustomerFiles,
          customerCitizenIdentificationInfoDate:
            dateCMNDAlready == null
              ? values.customerCitizenIdentificationInfoDate
              : dateCMNDAlready,
          carId: 0,

        });
        dispatch(actionAsyncLogin)
          .then((response: any) => {
            if (response.payload != undefined) {
              parentCallbackAlert("success");
              parentCallbackMessageAlert("Gửi đơn thành công");
              parentCallback(false);
              dispatch(getCarContractgroupReducercarAsyncApi(filter));
              setLoading(false);
              formik.setValues(initialValues);
              setSelectedImageCMNDBefore(null);
              setCmndAfterAlready(null);
              setCmndBeforeAlready(null);
              setGplxAfterAlready(null);
              setGplxBeforeAlready(null);
              formik.setTouched({});
            } else {
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
          });

        // window.location.reload();
        setSubmitting(false);
      } catch (error) {
        parentCallbackAlert("error");
        parentCallbackMessageAlert("Gửi đơn thất bại");
        setLoading(false);
        setSubmitting(false);
      }
    },
  });
  const carmakeValue = formik.values.requireDescriptionInfoCarBrand;
  useEffect(() => {
    getAllcarMake();
    return () => { };
  }, []);


  const handleClickRend = () => {
    setRend(!rend);
  };
  const handleRentFromChange = (newValue: any) => {
    formik.setFieldValue("rentFrom", newValue);
    setTimestart(newValue);
  };

  const handleRentToChange = (newValue: any) => {
    formik.setFieldValue("rentTo", newValue);
    setTimeEnd(newValue);
  };
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };

  const requireDescriptionInfoSeatNumber = [4, 5, 7];
  const requireDescriptionInfoCarColor = [
    "Đỏ",
    "Xanh",
    "Tím",
    "Vàng",
    "Trắng",
    "Xám",
    "Xanh lá",
  ];
  const requireDescriptionInfoYearCreate = [2022, 2021, 2020, 2019, 2018, 2017];

  const requireDescriptionInfoGearBox = ["Số tự động  ", "Số sàn"];

  const handleClose = () => {
    parentCallback(false);
    formik.setValues(initialValues);
    formik.setTouched({});
    formik.setErrors({});
    setSelectedImageFrontUrl(null);
    setSelectedImageCMNDAfter(null);
    setSelectedImageCMNDBefore(null);
    setSelectedImageGPLXAfter(null);
    setSelectedImageGPLXBefore(null);
    setCmndAfterAlready(null);
    setCmndBeforeAlready(null);
    setGplxAfterAlready(null);
    setGplxBeforeAlready(null);
  };

  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="lg"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openRetal}
        >
          <form onSubmit={formik.handleSubmit}>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Đăng ký thuê xe
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {loading == true ? <PopupLoading /> : undefined}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 ">
                <div className="gap-y-2 ">
                  <div className="mb-5">
                    <FormLabel>Yêu cầu thuê xe</FormLabel>
                  </div>
                  <div className="h-[70px] mt-2 ">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          label="Ngày bắt đầu*"
                          value={formik.values.rentFrom}
                          inputFormat="DD/MM/YYYY "
                          onChange={handleRentFromChange}
                          minDate={today}
                          //maxDate={formik.values.rentTo}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              error={
                                formik.errors.rentFrom &&
                                  formik.touched.rentFrom
                                  ? true
                                  : undefined
                              }
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                      {formik.errors.rentFrom && (
                        <div className="text-red-600 t text-xs font-semibold p-1">
                          {formik.errors.rentFrom as string}
                        </div>
                      )}
                    </LocalizationProvider>
                  </div>
                  <div className="h-[70px]">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          label="Ngày Kết thúc*"
                          value={formik.values.rentTo}
                          inputFormat="DD/MM/YYYY "
                          onChange={handleRentToChange}
                          minDate={formik.values.rentFrom}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              error={
                                formik.errors.rentTo && formik.touched.rentTo
                                  ? true
                                  : undefined
                              }
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                      {formik.errors.rentTo && (
                        <div className="text-red-600 text-xs font-semibold p-1 ">
                          {formik.errors.rentTo as string}
                        </div>
                      )}
                    </LocalizationProvider>
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.deliveryAddress}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Địa chỉ giao xe* "
                      variant="outlined"
                      name="deliveryAddress"
                      error={
                        formik.touched.deliveryAddress &&
                          formik.errors.deliveryAddress
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.deliveryAddress &&
                      formik.touched.deliveryAddress ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.deliveryAddress}
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[70px]">
                    <FormControl className="w-full">
                      <InputLabel size="small">Loại xe *</InputLabel>
                      <Select
                        size="small"
                        value={
                          formik.values.requireDescriptionInfoSeatNumber || ""
                        }
                        label={"Loại xe"}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.requireDescriptionInfoSeatNumber &&
                            formik.errors.requireDescriptionInfoSeatNumber
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                        name="requireDescriptionInfoSeatNumber"
                      >
                        <MenuItem value="" disabled>
                          Chọn loại xe
                        </MenuItem>
                        {requireDescriptionInfoSeatNumber.map((model) => (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.requireDescriptionInfoSeatNumber &&
                        formik.touched.requireDescriptionInfoSeatNumber ? (
                        <div className="text-red-600 text-xs font-semibold p-1">
                          {formik.errors.requireDescriptionInfoSeatNumber}
                        </div>
                      ) : null}
                    </FormControl>
                  </div>
                  <div className="h-[70px]">
                    <FormControl className="w-full">
                      <InputLabel size="small">Hãng xe</InputLabel>
                      <Select
                        size="small"
                        value={
                          formik.values.requireDescriptionInfoCarBrand || ""
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label={"Hãng xe"}
                        name="requireDescriptionInfoCarBrand"
                      >
                        {carMake.map((model: any) => (
                          <MenuItem key={model.id} value={model.name}>
                            {model.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="h-[70px]">
                    <FormControl className="w-full">
                      <InputLabel size="small">Màu xe </InputLabel>
                      <Select
                        size="small"
                        value={
                          formik.values.requireDescriptionInfoCarColor || ""
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label={"màu xe"}
                        name="requireDescriptionInfoCarColor"
                      >
                        {requireDescriptionInfoCarColor.map((model) => (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="h-[70px]">
                    <FormControl className="w-full">
                      <InputLabel size="small">Truyền động </InputLabel>
                      <Select
                        size="small"
                        value={
                          formik.values.requireDescriptionInfoGearBox || ""
                        }
                        onChange={formik.handleChange}
                        error={
                          formik.touched.requireDescriptionInfoGearBox &&
                            formik.errors.requireDescriptionInfoGearBox
                            ? true
                            : undefined
                        }
                        onBlur={formik.handleBlur}
                        label={"Truyền động"}
                        name="requireDescriptionInfoGearBox"
                      >
                        {requireDescriptionInfoGearBox.map((model) => (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors.requireDescriptionInfoGearBox &&
                        formik.touched.requireDescriptionInfoGearBox ? (
                        <div className="text-red-600 text-xs font-semibold p-1">
                          {formik.errors.requireDescriptionInfoGearBox}
                        </div>
                      ) : null}
                    </FormControl>
                  </div>
                  {/* <div className="h-[70px] ">
                    <TextField
                      size="small"
                      value={formik.values.requireDescriptionInfoPriceForDay}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Mức giá mong muốn "
                      variant="outlined"
                      name="requireDescriptionInfoPriceForDay"

                      error={
                        formik.touched.requireDescriptionInfoPriceForDay && formik.errors.requireDescriptionInfoPriceForDay
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                  </div> */}

                  <div className="mb-5">
                    <TextField
                      sx={{ my: 0 }}
                      name="rentPurpose"
                      value={formik.values.rentPurpose}
                      onChange={formik.handleChange}
                      fullWidth
                      multiline
                      rows={6}
                      id="outlined-basic"
                      label="Mục đích thuê"
                      variant="outlined"
                      className="w-full"
                    />
                  </div>

                  {/* <div className="h[85px]">
                    <FormControl className="w-full">
                      <FormLabel>Đã từng thuê xe</FormLabel>
                      <RadioGroup row value={rend}>

                        <FormControlLabel
                          className="ml-4"
                          value={false}
                          onClick={handleClickRend}
                          control={<Radio />}
                          label="Thuê lần đầu"
                        />
                        <FormControlLabel
                          value={true}
                          onClick={handleClickRend}
                          control={<Radio />}
                          label="Đã từng thuê"
                        />
                      </RadioGroup>

                    </FormControl>
                  </div> */}
                  <div></div>

                  {/* cmnd mat trc */}
                </div>
                <div className="gap-y-2 ">
                  <div className="mb-5">
                    <FormLabel>Thông tin khách hàng</FormLabel>
                  </div>

                  <FormControl sx={{ mx: 1, minHeight: "70px", width: "30ch" }}>
                    <div className="item_box_image ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon /> CCCD/CMND mặt trước *
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          id="image"
                          onChange={handleFileCMNDBeforeInputChange}
                        />
                      </Button>
                      {/* {formik.touched.CustomerFiles &&
                        formik.errors.CustomerFiles && (
                          <div className="text-red-600 text-xs font-semibold p-1">
                            {formik.errors.CustomerFiles}
                          </div>
                        )} */}

                      {selectedImageCMNDBefore && (
                        <img
                          onClick={() =>
                            haneleClickOpenImg(
                              window.URL.createObjectURL(
                                selectedImageCMNDBefore
                              )
                            )
                          }
                          alt=""
                          className="mx-auto h-[70px] w-24 mt-2 mb-[25px]"
                          src={
                            selectedImageFrontUrl
                              ? window.URL.createObjectURL(
                                selectedImageCMNDBefore
                              )
                              : ""
                          }
                        />
                      )}
                    </div>
                  </FormControl>

                  <FormControl sx={{ mx: 1, minHeight: "70px", width: "30ch" }}>
                    <div className="item_box_image ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon /> CCCD/CMND mặt sau *
                        <input
                          type="file"
                          hidden
                          disabled={cmndAfterAlready == null ? false : true}
                          id="image"
                          onChange={handleFilecitizenIdentifyImage2InputChange}
                        />
                      </Button>
                      {/* {formik.touched.citizenIdentifyImage2 &&
                        formik.errors.citizenIdentifyImage2 && (
                          <div className="text-red-600 text-xs font-semibold p-1">
                            {formik.errors.citizenIdentifyImage2}
                          </div>
                        )} */}
                      {cmndAfterAlready && (
                        <img
                          onClick={() => haneleClickOpenImg(cmndAfterAlready)}
                          alt=""
                          className="mx-auto h-[70px] w-24 mt-2 mb-[25px]  xl:mb-0"
                          src={cmndAfterAlready}
                        />
                      )}
                      {citizenIdentifyImage2 && (
                        <img
                          onClick={() =>
                            haneleClickOpenImg(
                              window.URL.createObjectURL(citizenIdentifyImage2)
                            )
                          }
                          alt=""
                          className="mx-auto h-[70px] w-24 mt-2 mb-[25px]  xl:mb-0"
                          src={
                            selectedImagcitizenIdentifyImageUrl
                              ? window.URL.createObjectURL(
                                citizenIdentifyImage2
                              )
                              : ""
                          }
                        />
                      )}
                    </div>
                  </FormControl>
                  <div className="h-[70px] ">
                    <TextField
                      size="small"
                      value={
                        formik.values.customerCitizenIdentificationInfoNumber
                      }
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Số CCCD/CMND"
                      variant="outlined"
                      name="customerCitizenIdentificationInfoNumber"
                      error={
                        formik.touched
                          .customerCitizenIdentificationInfoNumber &&
                          formik.errors.customerCitizenIdentificationInfoNumber
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />

                    {formik.errors.customerCitizenIdentificationInfoNumber &&
                      formik.touched.customerCitizenIdentificationInfoNumber ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.customerCitizenIdentificationInfoNumber}
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={
                        formik.values.customerCitizenIdentificationInfoAddress
                      }
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Nơi cấp CCCD/CMND"
                      variant="outlined"
                      name="customerCitizenIdentificationInfoAddress"
                      error={
                        formik.touched
                          .customerCitizenIdentificationInfoAddress &&
                          formik.errors.customerCitizenIdentificationInfoAddress
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />

                    {formik.errors.customerCitizenIdentificationInfoAddress &&
                      formik.touched.customerCitizenIdentificationInfoAddress ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.customerCitizenIdentificationInfoAddress}
                      </div>
                    ) : null}
                  </div>

                  <div className="h-[70px] ">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          label="Ngày cấp*"
                          value={
                            formik.values.customerCitizenIdentificationInfoDate
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
                                formik.errors
                                  .customerCitizenIdentificationInfoDate &&
                                  formik.touched
                                    .customerCitizenIdentificationInfoDate
                                  ? true
                                  : undefined
                              }
                              {...params}
                            />
                          )}
                        />
                      </Stack>
                    </LocalizationProvider>
                    {/* <TextField value={formik.values.customerCitizenIdentificationInfoDate == null ? "" : formik.values.customerCitizenIdentificationInfoDate} onChange={formik.handleChange} className="w-full"
                      id="outlined-basic"
                      label="Tên khách hàng*"
                      variant="outlined"
                      name="customerCitizenIdentificationInfoDate " /> */}
                    {formik.errors.customerCitizenIdentificationInfoDate && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {
                          formik.errors
                            .customerCitizenIdentificationInfoDate as string
                        }
                      </div>
                    )}
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.customerName}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Tên khách hàng*"
                      variant="outlined"
                      name="customerName"
                      error={
                        formik.touched.customerName &&
                          formik.errors.customerName
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.customerName &&
                      formik.touched.customerName ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.customerName}
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.customerAddress}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Địa chỉ khách hàng* "
                      variant="outlined"
                      name="customerAddress"
                      error={
                        formik.touched.customerAddress &&
                          formik.errors.customerAddress
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />

                    {formik.errors.customerAddress &&
                      formik.touched.customerAddress ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.customerAddress}
                      </div>
                    ) : null}
                  </div>

                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.customerEmail}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Email khách hàng*"
                      variant="outlined"
                      name="customerEmail"
                      error={
                        formik.touched.customerEmail &&
                          formik.errors.customerEmail
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.customerEmail &&
                      formik.touched.customerEmail ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.customerEmail}
                      </div>
                    ) : null}
                  </div>

                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.customerPhoneNumber || ""}
                      id="outlined-basic"
                      name="customerPhoneNumber"
                      label="Số điện thoại*"
                      onChange={formik.handleChange}
                      error={
                        formik.touched.customerPhoneNumber &&
                          formik.errors.customerPhoneNumber
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      variant="outlined"
                      className="w-full"
                    />

                    {formik.errors.customerPhoneNumber &&
                      formik.touched.customerPhoneNumber ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.customerPhoneNumber}
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.relativeTel || ""}
                      id="outlined-basic"
                      name="relativeTel"
                      label="Số điện thoại người thân*"
                      onChange={formik.handleChange}
                      error={
                        formik.touched.relativeTel && formik.errors.relativeTel
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                      variant="outlined"
                      className="w-full"
                    />
                    {formik.errors.relativeTel && formik.touched.relativeTel ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {formik.errors.relativeTel}
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.customerSocialInfoFacebook}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Facebook"
                      variant="outlined"
                      name="customerSocialInfoFacebook"
                    />
                  </div>
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.customerSocialInfoZalo}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Zalo"
                      variant="outlined"
                      name="customerSocialInfoZalo"
                    />
                  </div>
                  {/* <div className="h-[70px]">
                  <TextField
                    value={formik.values.customerSocialInfoLinkedin}
                    onChange={formik.handleChange}
                    id="outlined-basic"
                    label="Linkedin"
                    variant="outlined"
                    className="w-full"
                    name="customerSocialInfoLinkedin"
                  />
                </div> */}
                  {/* <div className="h-[70px]">
                  <TextField
                    value={formik.values.customerSocialInfoOther}
                    onChange={formik.handleChange}
                    id="outlined-basic"
                    label="Mạng xã hội khác"
                    variant="outlined"
                    name="customerSocialInfoOther"
                    className="w-full"
                  />
                </div> */}
                  <div className="h-[70px]">
                    <TextField
                      size="small"
                      value={formik.values.companyInfo}
                      onChange={formik.handleChange}
                      id="outlined-basic"
                      label="Thông tin công ty"
                      variant="outlined"
                      name="companyInfo"
                      className="w-full"
                    />
                  </div>
                  <FormControl sx={{ m: 1, width: "30ch" }}>
                    <div className="item_box_image ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md "
                      >
                        <AddPhotoAlternateIcon /> GPLX mặt trước *
                        <input
                          type="file"
                          hidden
                          disabled={gplxBeforeAlready == null ? false : true}
                          id="image"
                          onChange={handleFiledrivingLisenceImage1InputChange}
                        />
                      </Button>
                      {gplxBeforeAlready && (
                        <img
                          onClick={() => haneleClickOpenImg(gplxBeforeAlready)}
                          alt=""
                          className="mx-auto h-[70px] w-24 mt-2 mb-[25px]  xl:mb-0"
                          src={gplxBeforeAlready}
                        />
                      )}
                      {drivingLisenceImage1 && (
                        <img
                          onClick={() =>
                            haneleClickOpenImg(
                              window.URL.createObjectURL(drivingLisenceImage1)
                            )
                          }
                          alt=""
                          className="mx-auto h-[85px] w-24 my-5"
                          src={
                            selectedImagdrivingLisenceImage1ImageUrl
                              ? window.URL.createObjectURL(drivingLisenceImage1)
                              : ""
                          }
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormControl sx={{ m: 1, width: "30ch" }}>
                    <div className="item_box_image ">
                      <Button
                        variant="contained"
                        component="label"
                        className="bg-white text-[#1976d2] shadow-none rounded-md"
                      >
                        <AddPhotoAlternateIcon /> GPLX mặt sau *
                        <input
                          type="file"
                          disabled={gplxAfterAlready == null ? false : true}
                          hidden
                          id="image"
                          onChange={handleFiledrivingLisenceImage2InputChange}
                        />
                      </Button>
                      {gplxAfterAlready && (
                        <img
                          onClick={() => haneleClickOpenImg(gplxAfterAlready)}
                          alt=""
                          className="mx-auto h-[70px] w-24 mt-2 mb-[25px]  xl:mb-0"
                          src={gplxAfterAlready}
                        />
                      )}
                      {drivingLisenceImage2 && (
                        <img
                          onClick={() =>
                            haneleClickOpenImg(
                              window.URL.createObjectURL(drivingLisenceImage2)
                            )
                          }
                          alt=""
                          className="mx-auto h-[85px] w-24 my-5"
                          src={
                            selectedImagdrivingLisenceImageưImageUrl
                              ? window.URL.createObjectURL(drivingLisenceImage2)
                              : ""
                          }
                        />
                      )}
                    </div>
                  </FormControl>

                  {/* <div className="h-[70px]">
                    <TextField
                      value={formik.values.expertiseInfoTrustLevel}
                      onChange={formik.handleChange}
                      className="w-full"
                      id="outlined-basic"
                      label="Độ tin cậy"
                      variant="outlined"
                      name="expertiseInfoTrustLevel"
                    />
                  </div> */}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit">Gửi yêu cầu thuê xe</Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
        {/* <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />  */}
        <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />
      </>
    );
  };
  return <>{renderPopupUI()}</>;
};
