import AddIcon from "@mui/icons-material/Add";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import {
  Button, FormControl, IconButton, InputLabel, MenuItem,
  Select, Skeleton,
  Stack, TextField, Tooltip
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4, v4 } from "uuid";
import { useAppSelector } from "../../hooks";
import {
  getByIdCarContractgroupReducercarAsyncApi,
  putCarContractgroupReducercarAsyncApi,
  putStatusCarContractgroupReducercarAsyncApi
} from "../../redux/ContractgroupReducer/ContractgroupReducer";
import { DispatchType, RootState } from "../../redux/store";

import {
  UploadResult,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useFormik } from "formik";
import * as Yup from "yup";
import { storage } from "../../../src/util/FirebaseConfig";
import { contractgroupDetailsModel } from "../../models/contractgroupDetailsModel";
import {
  AppraisalRecordAction,
  getByIdAppraisalRecordReducerAsyncApi,
} from "../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import { getcarMakeAsyncApi } from "../../redux/CarMakeReducer/CarMakeReducer";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Link } from "react-router-dom";
import { AlertComponent } from "../../Components/AlertComponent";
import PopupComfirm from "../../Components/PopupComfirm";
import PopupImage from "../../Components/PopupImage";
import PopupLoading from "../../Components/PopupLoading";
import { deleteCustomerInfoBycustomerFileId } from "../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { getRentContractByContractIdAsyncApi, getRentContractFilesByContractIdAsyncApi, postSendMailReducerAsyncApi } from "../../redux/RentContractReducer/RentContractReducer";
import { getProfileAsyncApi } from "../../redux/UserReducer/userReducer";
import { PopupPdf } from "../ContractGroup/Component/PopupPdf";
import ProfileTemplate from "./ProfileTemplate";
function parseToInputDate(dateString: any) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const requireDescriptionInfoSeatNumber = [4, 5, 7];
const requireDescriptionInfoCarColor = [
  "Đỏ",
  "Xanh",
  "Tím",
  "Vàng",
  "trắng",
  "Xám",
  "Xanh lá",
];
const requireDescriptionInfoGearBox = ["Số sàn", "Tự động"];
const requireDescriptionInfoYearCreate = [2022, 2021, 2020, 2019, 2018, 2017];
interface Column {
  id: "stt" | "title" | "paperType" | "file" | "note" | "action";
  label: string;
  minWidth?: number;
  align?: "left";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  {
    id: "stt",
    label: "Stt",
    minWidth: 50,
    align: "left",
  },
  { id: "title", label: "Tên giấy tờ", minWidth: 150 },
  { id: "paperType", label: "Hình thức giấy tờ", minWidth: 150 },
  {
    id: "file",
    label: "Đính kèm",
    minWidth: 250,
    align: "left",
  },
  {
    id: "note",
    label: "Ghi chú",
    minWidth: 150,
    align: "left",
  },
  { id: "action", label: "Thao tác", minWidth: 100 },
];

export default function ProfileDetail(props: any) {
  const { parentCallback } = props;
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  // const userString = localStorage.getItem("user");
  // const user = JSON.parse(userString == null ? "" : userString);
  const [alert, setAlert] = useState("");
  const [isConfirm, setIscConfirm] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const dispatch: DispatchType = useDispatch();
  const { AppraisalRecord } = useSelector(
    (state: RootState) => state.AppraisalRecord
  );
  const { carMake } = useSelector((state: RootState) => state.carMake);
  const { contractgroupDetails } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { user } = useAppSelector((state: RootState) => state.user);
  const { rentContractDetailByContractId } = useAppSelector(
    (state: RootState) => state.rentContract
  );
  const { rentContractFiles } = useAppSelector(
    (state: RootState) => state.rentContract
  );

  function ApiGetRentContractFilter(values: any) {
    const actionGetRentContractFilter =
      getRentContractFilesByContractIdAsyncApi(values);
    dispatch(actionGetRentContractFilter);
  }
  function ApiGetRentContractByStatusContracId(values: any) {
    const actionGetRentContractByStatusContracId =
      getRentContractByContractIdAsyncApi(values);
    dispatch(actionGetRentContractByStatusContracId).then((response: any) => {
      if (response.payload != undefined) {

        ApiGetRentContractFilter(response.payload.id)
      }
    });
  }
  const getAllcarMake = () => {
    const actionAsync = getcarMakeAsyncApi();
    dispatch(actionAsync);
  };
  interface imgView {
    id: number;
    file: File | null;
    status: boolean;
    title: string;
    typeOfDocument: string;
  }
  interface imgFireBase {
    id: number;
    url: string | null;
  }

  const [selectedImageCMNDBefore, setSelectedImageCMNDBefore] = useState<
    imgView[]
  >([]);
  const [selectedImageOtherUrl, setSelectedImageOtherUrl] = useState<
    imgFireBase[]
  >([]);
  const handleFileNewData = (
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
          return;
        }

      };
      reader.readAsDataURL(file1);
    }
  };
  let expertiseView;
  if (contractgroupDetails.contractGroupStatusId !== 1) {
    expertiseView = (
      <>
        <div className="grid grid-cols-3">
          <div>
            <h2 className="text-xl font-bold mb-2">Nhân viên Điều hành</h2>
            <p className="text-gray-400">
              Nhân viên của bãi xe đi giao xe
            </p>
          </div>
          {user?.id != 0 ? (
            <div className="col-span-2 ml-4">
              <div className="mb-5">
                <p className="font-semibold mb-2">Họ và tên</p>
                <input
                  value={user?.name}
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số điện thoại</p>
                <input
                  value={user?.phoneNumber}
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Email</p>
                <input
                  value={user?.email}
                  disabled
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              </div>
            </div>
          ) : (
            <div className="col-span-2 ml-4">
              <div className="mb-5">
                <p className="font-semibold mb-2">Họ và tên</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số điện thoại</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Email</p>
                <Skeleton
                  variant="rectangular"
                  className="w-full"
                  height={40}
                />
              </div>
            </div>
          )}
        </div>
        <hr className="mt-2" />
      </>
    );
  }
  const handleFileOtherInputChange = (
    newValue: number,
    status: boolean,
    title: string,
    papertype: string,
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
          return;
        }

        const newArrayListFile = [...selectedImageCMNDBefore];
        const newDataListFile = { id: newValue, status: status, title: title, typeOfDocument: papertype, file: file1 };
        if (selectedImageCMNDBefore.find(item => item.id === newDataListFile.id)) {
          const newArr = selectedImageCMNDBefore.map(item => {
            if (item.id === newDataListFile.id) {
              return { ...item, file: newDataListFile.file };
            }
            return item;
          });
          setSelectedImageCMNDBefore(newArr);
        } else {
          newArrayListFile.push(newDataListFile);
          setSelectedImageCMNDBefore(newArrayListFile);
        }
        const url = URL.createObjectURL(file1);
        const newArrayListFileFireBase = [...selectedImageOtherUrl];
        const newDataListFileFireBase = { id: newValue, url: url };
        newArrayListFileFireBase.push(newDataListFileFireBase);
        setSelectedImageOtherUrl(newArrayListFileFireBase);

        //setSelecteddrivingLisenceImage1Image1Option("file");
        //setSelectedImageGPLXBefore(file1);
      };
      reader.readAsDataURL(file1);
    }
  };
  const body = {
    ToEmail: `${user?.email}`,
    Subject: `[ATSHARE] Thông báo yêu cầu thuê xe đơn ${contractgroupDetails.id}`,
    Body: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style=" text-align: center; padding: 40px 0; background: #EBF0F5;  width: 100%; height: 100%;">
    <div style="
        background: white;
        padding-left: 300px;
    padding-right: 300px;
    padding-top: 50;
    padding-bottom: 50px;
        border-radius: 4px;
        box-shadow: 0 2px 3px #C8D0D8;
        display: inline-block;
        margin: 0 auto;
    " class="card">
        <h1 style=" color: #008CBA;font-size: 40px;"> ATSHARE</h1>
        <hr />
        <img style="" src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Flogo-color%20(1).pngeddab547-393c-4a52-8228-389b00aeacad?alt=media&token=a9fe5d57-b871-46a0-a9da-508902f09832&fbclid=IwAR0naf-IAgqC0ireg_vTPIvu9q0dK_n0gqKdNHhWFhvOyvhjWph-boPTWYk" />
        <h1 style=" color: #59c91c; font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
            font-weight: 900;
            font-size: 40px;
            margin-bottom: 10px;">
            Yêu cầu cập nhật
        </h1>
        <p style=" padding-top: 5px;
        color: #404F5E;
        font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
           font-size: 20px;
           margin: 0;">Yêu cầu:${contractgroupDetails.id}</p>
          
                 <p style=" padding-top: 5px;
                 color: ##DCDCDC;
                 font-family: " Nunito Sans", "Helvetica Neue" , sans-serif;
                    font-size: 20px;
                    margin: 0;">Lưu ý: Xem lại thông tin(<a href="https://atshare.vercel.app/Expertise/ContractGroup/ContractGroupDetail/${contractgroupDetails.id}">tại đây</a>)</p>  
</body></html>`,

  };
  const initialValues = {
    id: 0,
    userId: 0,
    staffEmail: "",
    carId: 0,
    rentPurpose: "",
    rentFrom: new Date(),
    rentTo: new Date(),
    requireDescriptionInfoCarClass: "",
    requireDescriptionInfoCarBrand: "",
    requireDescriptionInfoSeatNumber: 4,
    requireDescriptionInfoYearCreate: 0,
    requireDescriptionInfoCarColor: "",
    requireDescriptionInfoPriceForDay: 0,
    requireDescriptionInfoGearBox: "",
    deliveryAddress: "",
    contractGroupStatusId: 0,
    contractGroupStatusName: "",
    customerInfoId: 0,
    phoneNumber: "",
    customerSocialInfoZalo: "",
    customerSocialInfoFacebook: "",
    customerSocialInfoLinkedin: "",
    customerSocialInfoOther: "",
    addtionalInfo: "",
    relativeTel: "",
    expertiseInfoIsFirstTimeRent: false,
    expertiseInfoTrustLevel: "",
    companyInfo: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    path: "",
    citizenIdentifyImage1: "",
    citizenIdentifyImage2: "",
    drivingLisenceImage1: "",
    drivingLisenceImage2: "",
    housePaperImages: "",
    passportImages: "",
    otherImages: "",
    rentContracts: "",
    transferContracts: "",
    expertiseContractId: "",
    expertiseContractStatusId: "",
    expertiseContractStatusName: "",
    rentContractId: "",
    rentContractStatusId: "",
    rentContractStatusName: "",
    transferContractId: "",
    transferContractStatusId: "",
    transferContractStatusName: "",
    receiveContractId: "",
    receiveContractStatusId: "",
    receiveContractStatusName: "",
    citizenIdentificationInfoNumber: "",
    citizenIdentificationInfoAddress: "",
    citizenIdentificationInfoDateReceive: null,
    customerFiles: [
      {
        id: 0,
        customerInfoId: 0,
        typeOfDocument: "",
        title: "",
        documentImg: "",
        documentDescription: "",
      },
    ],
  };

  const frmContractGroupDetail = useFormik<contractgroupDetailsModel>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      citizenIdentificationInfoNumber: Yup.string()
        .matches(/^[0-9]{9}$|^[0-9]{12}$/, "CCCD/CMND không hợp lệ!")
        .required("CMND/CCCD không được trống!"),
      citizenIdentificationInfoAddress: Yup.string()
        .nullable()
        .required("Nơi cấp của CMND/CCCD không được trống!"),
      customerEmail: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      // citizenIdentificationInfoDateReceive: Yup.date()
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

      phoneNumber: Yup.string()
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

      // rentFrom: Yup.date()
      //   .required("Ngày bắt đầu không được trống!")
      //   .nullable()
      //   .typeError("Ngày bắt đầu không hợp lệ!")
      //   .min(new Date(), "Ngày bắt đầu không hợp lệ"),
      // rentTo: Yup.date()
      //   .min(Yup.ref("rentTo"), "Ngày kết thúc không thể trước ngày bắt đầu !")
      //   .required("Ngày kết thúc không được trống!")
      //   .nullable()
      //   .typeError("Ngày kết thúc không hợp lệ!"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        //setIsLoading(true);
        const promises: Promise<{ id: number; url: UploadResult; status: boolean, title: string, typeOfDocument: string }>[] = [];

        if (selectedImageCMNDBefore) {
          selectedImageCMNDBefore.forEach((image: any) => {
            const imageRef = ref(storage, `imgCCCD/${new Date() + v4()}`);
            const imgaeSnapshot = uploadBytes(imageRef, image.file);
            const promise = imgaeSnapshot.then((uploadResult) => ({
              id: image.id,
              url: {
                metadata: uploadResult.metadata,
                ref: uploadResult.ref,
                contentType: uploadResult.metadata.contentType,
              },
              status: image.status,
              title: image.title,
              typeOfDocument: image.typeOfDocument,
            }));
            promises.push(promise);
          });
        }
        const snapshots = await Promise.all(promises);
        const urls = await Promise.all(
          snapshots
            .map((snapshot) => getDownloadURL(snapshot.url.ref))
            .map((promise, index) =>
              promise.then((url) => ({
                id: snapshots[index].id,
                url,
                status: snapshots[index].status,
                title: snapshots[index].title,
                typeOfDocument: snapshots[index].typeOfDocument,
              }))
            )
        );
        const updatedValues = {
          ...values,
          customerFiles: values.customerFiles.map((file) => {
            const matchingUrl = urls.find((url) => url.id === file.id);
            return matchingUrl
              ? { ...file, documentImg: matchingUrl.url, documentDescription: "" }
              : { ...file, documentDescription: "" };
          }).concat(
            urls.filter((url) => !values.customerFiles.some((file) => file.id === url.id))
              .map((url) => ({
                id: 0,
                documentImg: url.url,
                typeOfDocument: url.typeOfDocument,
                title: url.title,
                documentDescription: "",
                customerInfoId: 0
              }))
          )
        };
        const actionPutContractGroup =
          putCarContractgroupReducercarAsyncApi(updatedValues);
        dispatch(actionPutContractGroup).then((response: any) => {
          if (response.payload != undefined) {
            if (
              contractgroupDetails.contractGroupStatusId == 2 ||
              contractgroupDetails.contractGroupStatusId == 3
            ) {
              dispatch(postSendMailReducerAsyncApi(body));
            }
            for (let data of dataListFile) {

              if (data.isDelete == true && data.status == true) {
                dispatch(deleteCustomerInfoBycustomerFileId(data.id));
              }
            }

            if (contractgroupDetails.contractGroupStatusId != 1) {
              dispatch(
                putStatusCarContractgroupReducercarAsyncApi({
                  id: contractgroupDetails.id,
                  contractGroupStatusId: 1,
                })
              ).then((response: any) => {
                if (response.payload != undefined) {
                  dispatch(
                    getByIdCarContractgroupReducercarAsyncApi(
                      contractgroupDetails.id
                    )
                  );
                  setAlert("success");
                  setMessageAlert("Gửi lại đơn thành công");
                  setIsLoading(false);
                } else {
                  setIsLoading(false);
                }
              });
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            } else {
              setAlert("success");
              setMessageAlert("Gửi lại đơn thành công");
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setIsLoading(false);
            }
          }
        });

        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });
  const datatypeOfDocument = ["Bản gốc", "Bản sao", "Bản sao có Mộc"];
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  interface DataListFile {
    title: string;
    typeOfDocument: string;
    documentImg: string | null;
    documentDescription: string | null;
    status: boolean;
    id: number;
    customerInfoId: number;
    isDelete: boolean,
  }
  let callbackFunctionMessageAlert = (childData: any) => {
    //setMessageAlert(childData);
    setMessageAlert(childData);
  };
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  const [dataListFile, setDataListFile] = useState<DataListFile[]>(
    contractgroupDetails.customerFiles.map((item) => ({
      title: item.title,
      typeOfDocument: item.typeOfDocument,
      documentImg: item.documentImg,
      documentDescription: item.documentDescription ?? null,
      status: true,
      id: item.id,
      customerInfoId: item.customerInfoId,
      isDelete: false,
    }))
  );
  function handleClickAddItemInDataListFile() {
    if (
      dataListFile[dataListFile.length - 1].title != "" &&
      dataListFile[dataListFile.length - 1].typeOfDocument != ""
    ) {
      //setIsFaild(true);
      const newArrayListFile = [...dataListFile];
      const newDataListFile = {
        title: "",
        typeOfDocument: "",
        documentImg: null,
        documentDescription: "",
        status: false,
        id: parseInt(uuidv4().slice(0, 8), 16),
        customerInfoId: 0,
        isDelete: false,
      };
      newArrayListFile.push(newDataListFile);
      setDataListFile(newArrayListFile);
    } else {
      setAlert("error");
      setMessageAlert("Phải nhập đủ thông tin trước khi tạo mới");
    }
  }
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  useEffect(() => {
    if (carMake.length == 0) {
      getAllcarMake();
    }
  }, [])
  useEffect(() => {
    if (contractgroupDetails.contractGroupStatusId >= 6) {
      ApiGetRentContractByStatusContracId(contractgroupDetails.id)
    }
    if (contractgroupDetails.id != 0) {
      frmContractGroupDetail.setValues(contractgroupDetails);
    }
    if (
      contractgroupDetails.contractGroupStatusId >= 2
    ) {
      dispatch(getByIdAppraisalRecordReducerAsyncApi(contractgroupDetails?.id)).then((response: any) => {
        if (response.payload != undefined) {
          dispatch(getProfileAsyncApi(response.payload.expertiserId));
        }
      });
    }
    setDataListFile(
      contractgroupDetails.customerFiles.map((item) => ({
        title: item.title,
        typeOfDocument: item.typeOfDocument,
        documentImg: item.documentImg,
        documentDescription: item.documentDescription ?? null,
        status: true,
        customerInfoId: item.customerInfoId,
        id: item.id,
        isDelete: false,
      }))
    );
    return () => {
      dispatch(AppraisalRecordAction.deleteAppraiselAction());
    };
  }, [contractgroupDetails]);
  const moment = require("moment");
  function handleChangeTimeRentForm(newTimestart: any) {
    if (newTimestart == null) {
      frmContractGroupDetail.setFieldValue(
        "rentFrom",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmContractGroupDetail.setFieldValue(
        "rentFrom",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }
  function handleChangeTimeRentTo(newTimestart: any) {
    if (newTimestart == null) {
      frmContractGroupDetail.setFieldValue(
        "rentTo",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmContractGroupDetail.setFieldValue(
        "rentTo",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }
  const handleClickOpenAdd = () => {
    setOpen(true);
  };
  function handleCloseConfirm(value: any) {
    setOpenConfirm(value);
  }
  function handleClickDelete(value: any) {
    if (value == true) {
      let newArrClone = [...dataListFile];
      const newArr = newArrClone.map(item => {
        if (item.id === idDelete) {
          return { ...item, isDelete: true };
        }
        return item;
      });
      setDataListFile(newArr);
      setSelectedImageCMNDBefore((prevImages) =>
        prevImages.filter((img) => img.id !== idDelete)
      );
    } else {

    }

  }

  function createData(data: any, index: number) {
    let title =
      data.status == true ? (
        data.title
      ) : (
        <TextField
          label="Tên giấy tờ*"
          size="small"
          value={filterListDelte[index].title}
          onChange={(e) => {
            const updatedDataListFile = [...filterListDelte];
            updatedDataListFile[index].title = e.target.value;
            setDataListFile(updatedDataListFile);
          }}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000000",
              bgcolor: "rgb(243 244 246)",
            },
          }}
        />
      );

    let paperType =
      data.status == false ? (
        <div className="h-10 w-48">
          <FormControl className="w-full">
            <InputLabel size="small">Hình thức giấy tờ</InputLabel>
            <Select
              size="small"
              value={filterListDelte[index].typeOfDocument}
              onChange={(e) => {
                const updatedDataListFile = [...filterListDelte];
                updatedDataListFile[index].typeOfDocument = e.target.value;
                setDataListFile(updatedDataListFile);
              }}
              label={"Hình thức giấy tờ"}
              name="requireDescriptionInfoCarBrand"
            >
              {datatypeOfDocument.map((model: any, index) => (
                <MenuItem key={index} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <FormControl fullWidth>
          <TextField
            size="small"
            label="Hình thức giấy tờ*"
            disabled={data.status == true ? true : false}
            id="demo-simple-select"
            value={data.typeOfDocument}
            className="h-10 w-48"
          />
        </FormControl>
      );
    const selectedImage = selectedImageCMNDBefore.find(
      (item) => item.id === data.id
    );

    const imageUrl =
      selectedImage && selectedImage.file
        ? window.URL.createObjectURL(selectedImage.file)
        : undefined;

    let file =
      (
        <>
          <FormControl className="mb-2">
            <div className="item_box_image ">
              <Button
                variant="contained"
                component="label"
                className="bg-white text-[#1976d2] shadow-none rounded-md "
              >
                <AddPhotoAlternateIcon /> Chọn ảnh*
                <input
                  type="file"
                  hidden
                  id="image5"
                  onChange={(e) => handleFileOtherInputChange(data.id, data.status, data.title, data.typeOfDocument, e)}
                />
              </Button>
              {imageUrl != null ? (
                <img
                  onClick={() => haneleClickOpenImg(data.file?.documentImg)}
                  alt=""
                  className="mx-auto h-52 w-full mt-2 mb-[25px]"
                  src={imageUrl}
                />
              ) : data.documentImg != null ?
                <img
                  onClick={() => haneleClickOpenImg(data.documentImg)}
                  src={data.documentImg}
                  className="mx-auto h-52 w-full mt-2 mb-[25px]"
                />
                : imageUrl && (
                  <img
                    onClick={() => haneleClickOpenImg(data.file?.documentImg)}
                    alt=""
                    className="mx-auto h-52 w-full mt-2 mb-[25px]"
                    src={imageUrl}
                  />
                )}
            </div>
          </FormControl>

        </>

      );

    let note = (
      <TextField
        disabled={true}
        label={"Ghi chú"}
        size="small"
        value={data.documentDescription == null ? "" : data.documentDescription}
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
            bgcolor: "rgb(243 244 246)",
          },
        }}
      />
    );
    let stt = index + 1;
    let status = data.status;
    let action = <Tooltip onClick={() => handleClickOpenConfirm(data.id)} title="Xoá">
      <IconButton>
        <DeleteOutlinedIcon className="" />
      </IconButton>
    </Tooltip>;
    let isDelete = data.isDelete;
    return { stt, title, status, paperType, file, note, action, isDelete };
  }
  // const filterDataListFile = dataListFile.filter((data: any, index: number) => {
  //   if (data.isDelete == false) {
  //     return data;
  //   }
  // });
  const filterListDelte = dataListFile.filter((data: any, index: number) => {
    if (data.isDelete == false) {
      return data;
    }
  });
  const rows = filterListDelte.map((data: any, index: number) => {
    return createData(data, index);
  });
  function handleChangeTimeCCCD(newTimestart: any) {
    if (newTimestart === null) {
      frmContractGroupDetail.setFieldValue(
        "citizenIdentificationInfoDateReceive",
        moment(newTimestart, "DD/MM/YYYY").toDate()
      );
    } else {
      let newValue = newTimestart.format("DD/MM/YY");
      frmContractGroupDetail.setFieldValue(
        "citizenIdentificationInfoDateReceive",
        moment(newValue, "DD/MM/YYYY").toDate()
      );
    }
  }
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };


  const handleClickOpenConfirm = (value: number) => {
    setOpenConfirm(true);
    setIdDelete(value);
  };
  const dataLoad = [{}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}];
  return (
    <ProfileTemplate>
      <Link to="/profile" className="flex hover:text-blue-400 cursor-pointer">
        <div className="mt-[22px] ml-5">
          <ArrowBackIosNewOutlinedIcon />
        </div>

        <h2 className="text-xl font-bold py-5  uppercase">
          Đơn thuê {frmContractGroupDetail?.values.id}
        </h2>
      </Link>
      <div className="mx-5">
        <div className="mt-5 max-w-6xl mx-auto">
          <form onSubmit={frmContractGroupDetail.handleSubmit}>

            <div
              className={
                frmContractGroupDetail.values.contractGroupStatusId == 2 ||
                  frmContractGroupDetail.values.contractGroupStatusId == 3
                  ? "grid grid-cols-3"
                  : "hidden"
              }
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Kết quá thẩm định </h2>
                <p className="text-gray-400">
                  Kết quả thẩm định khách hàng hoặc là tìm xe trên hệ thống
                </p>
              </div>
              <div className="col-span-2 ml-4">
                <div className="mb-5">
                  <p className="font-semibold mb-2">Thông tin khách hàng*</p>
                  {AppraisalRecord.id == 0 ? <Skeleton variant="rectangular" className="w-full" height={40} /> : <TextField
                    id="outlined-basic"
                    size="small"
                    variant="outlined"
                    className="w-full"
                    value={
                      AppraisalRecord.resultOfInfo == false
                        ? "Thông tin thất bại"
                        : "Thông tin hoàn tất"
                    }
                    disabled
                  />}

                </div>
                <div
                  className={
                    AppraisalRecord.resultOfCar == false ? "hidden" : "mb-5"
                  }
                >
                  <p className="font-semibold mb-2">Yêu cầu xe*</p>

                  <TextField
                    id="outlined-basic"
                    size="small"
                    variant="outlined"
                    className="w-full"
                    value={
                      AppraisalRecord.resultOfCar == false
                        ? "Không có xe theo yêu cầu"
                        : "Có xe theo yêu cầu"
                    }
                    disabled
                  />
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Lí do thất bại*</p>
                  {AppraisalRecord.id == 0 ? <Skeleton variant="rectangular" className="w-full" height={194} /> : <TextField
                    sx={{ my: 0 }}
                    name="rentPurpose"
                    fullWidth
                    multiline
                    rows={7}
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    value={AppraisalRecord.resultDescription}
                    disabled
                  />}

                </div>
              </div>
            </div>
            <hr className="mt-2 " />
            {expertiseView}

            <div className="grid grid-cols-3 mt-5">
              <div>
                <h2 className="text-xl font-bold mb-2">Hồ sơ cá nhân</h2>
                <p className="text-gray-400">
                  Những giấy tờ và thông tin của người thuê xe
                </p>
              </div>
              <div className="col-span-2 ml-4">

                <div className="mb-5">
                  <p className="font-semibold mb-2">tên khách hàng*</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    name="customerName"
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.customerName}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.customerName &&
                    frmContractGroupDetail.touched.customerName && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.customerName}
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Email của khách*</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    name="customerEmail"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.customerEmail}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.customerEmail &&
                    frmContractGroupDetail.touched.customerEmail && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.customerEmail}
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Địa chỉ khách hàng*</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    name="customerName"
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.customerAddress}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.customerAddress &&
                    frmContractGroupDetail.touched.customerAddress && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.customerAddress}
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Số CMND*</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    name="customerName"
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={
                      frmContractGroupDetail.values
                        .citizenIdentificationInfoNumber
                    }
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors
                    .citizenIdentificationInfoNumber &&
                    frmContractGroupDetail.touched
                      .citizenIdentificationInfoNumber && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {
                          frmContractGroupDetail.errors
                            .citizenIdentificationInfoNumber
                        }
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Nơi cấp*</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    name="customerName"
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={
                      frmContractGroupDetail.values
                        .citizenIdentificationInfoAddress
                    }
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors
                    .citizenIdentificationInfoAddress &&
                    frmContractGroupDetail.touched
                      .citizenIdentificationInfoAddress && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {
                          frmContractGroupDetail.errors
                            .citizenIdentificationInfoAddress
                        }
                      </div>
                    )}
                </div>
                <div className="h-[85px] mb-5 ">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack>
                      <p className="font-semibold mb-2">Ngày cấp*</p>
                      {frmContractGroupDetail.values.id == 0 ? <Skeleton
                        component="div"
                        variant="rectangular"
                        width="100%"
                        height={40}
                      /> : <DesktopDatePicker
                        disabled={
                          contractgroupDetails.contractGroupStatusId == 2 ||
                            contractgroupDetails.contractGroupStatusId == 1 ||
                            contractgroupDetails.contractGroupStatusId == 3
                            ? false
                            : true
                        }
                        value={
                          frmContractGroupDetail.values
                            .citizenIdentificationInfoDateReceive
                        }
                        inputFormat="DD/MM/YYYY "
                        onChange={(newValue) => handleChangeTimeCCCD(newValue)}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            error={
                              frmContractGroupDetail.errors
                                .citizenIdentificationInfoDateReceive &&
                                frmContractGroupDetail.touched
                                  .citizenIdentificationInfoDateReceive
                                ? true
                                : undefined
                            }
                            {...params}
                          />
                        )}
                      />}

                    </Stack>
                  </LocalizationProvider>
                  {frmContractGroupDetail.errors
                    .citizenIdentificationInfoDateReceive && (
                      <div className="text mt-1 text-xs text-red-600 font-semibold">
                        {
                          frmContractGroupDetail.errors
                            .citizenIdentificationInfoDateReceive as string
                        }
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Số điện thoại*</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    name="phoneNumber"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.phoneNumber}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.phoneNumber &&
                    frmContractGroupDetail.touched.phoneNumber && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.phoneNumber}
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">
                    Số điện thoại người thân*
                  </p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    name="relativeTel"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.relativeTel}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.relativeTel &&
                    frmContractGroupDetail.touched.relativeTel && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.relativeTel}
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Facebook</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    name="customerSocialInfoFacebook"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={
                      frmContractGroupDetail.values.customerSocialInfoFacebook
                    }
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}


                  {frmContractGroupDetail.errors.customerSocialInfoFacebook &&
                    frmContractGroupDetail.touched
                      .customerSocialInfoFacebook && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {
                          frmContractGroupDetail.errors
                            .customerSocialInfoFacebook
                        }
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Zalo</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    name="customerSocialInfoZalo"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.customerSocialInfoZalo}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}


                  {frmContractGroupDetail.errors.customerSocialInfoZalo &&
                    frmContractGroupDetail.touched.customerSocialInfoZalo && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.customerSocialInfoZalo}
                      </div>
                    )}
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Thông tin công ty</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={40}
                  /> : <input
                    name="companyInfo"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.companyInfo}
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.companyInfo &&
                    frmContractGroupDetail.touched.companyInfo && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.companyInfo}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <hr className="mt-2" />
            <div className="grid grid-cols-3 mt-5">
              <div>
                <h2 className="text-xl font-bold mb-2">Thông tin yêu cầu</h2>
                <p className="text-gray-400">
                  Những yêu cầu thuê xe của khách hàng{" "}
                </p>
              </div>
              <div className="col-span-2 ml-4">
                <div className="mb-5 lg:grid lg:grid-cols-5">
                  <div className="lg:mr-5 lg:col-span-2 ">
                    <p className="font-semibold mb-2">Thuê từ ngày*</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        {frmContractGroupDetail.values.id == 0 ? <Skeleton
                          component="div"
                          variant="rectangular"
                          width="100%"
                          className="lg:w-full "
                          height={40}
                        /> : <DesktopDatePicker
                          value={frmContractGroupDetail.values.rentFrom}
                          disabled={
                            contractgroupDetails.contractGroupStatusId == 2 ||
                              contractgroupDetails.contractGroupStatusId == 1 ||
                              contractgroupDetails.contractGroupStatusId == 3
                              ? false
                              : true
                          }
                          className="lg:w-full "
                          inputFormat="DD/MM/YYYY "
                          onChange={(newValue) =>
                            handleChangeTimeRentForm(newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              error={
                                frmContractGroupDetail.errors.rentFrom &&
                                  frmContractGroupDetail.touched.rentFrom
                                  ? true
                                  : undefined
                              }
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                  bgcolor: "rgb(243 244 246)",
                                },
                              }}
                              {...params}
                            />
                          )}
                        />}

                      </Stack>
                    </LocalizationProvider>
                    {frmContractGroupDetail.errors.rentFrom &&
                      frmContractGroupDetail.touched.rentFrom ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {frmContractGroupDetail.errors.rentFrom}
                      </div>
                    ) : null}
                  </div>
                  <RepeatOutlinedIcon className="my-2 lg:mx-auto lg:mt-7 lg:my-0" />
                  <div className="lg:ml-5 lg:col-span-2">
                    <p className="font-semibold mb-2">đến ngày*</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        {frmContractGroupDetail.values.id == 0 ? <Skeleton
                          component="div"
                          variant="rectangular"
                          width="100%"
                          className="lg:w-full "
                          height={40}
                        /> : <DesktopDatePicker
                          value={frmContractGroupDetail.values.rentTo}
                          disabled={
                            contractgroupDetails.contractGroupStatusId == 2 ||
                              contractgroupDetails.contractGroupStatusId == 1 ||
                              contractgroupDetails.contractGroupStatusId == 3
                              ? false
                              : true
                          }
                          inputFormat="DD/MM/YYYY "
                          onChange={(newValue) =>
                            handleChangeTimeRentTo(newValue)
                          }
                          className="lg:w-full "
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                  bgcolor: "rgb(243 244 246)",
                                },
                              }}
                              error={
                                frmContractGroupDetail.errors.rentTo &&
                                  frmContractGroupDetail.touched.rentTo
                                  ? true
                                  : undefined
                              }
                              {...params}
                            />
                          )}
                        />}

                      </Stack>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Loại xe*</p>
                  <FormControl className="w-full">
                    {frmContractGroupDetail.values.id == 0 ? <Skeleton
                      component="div"
                      variant="rectangular"
                      width="100%"
                      height={40}
                    /> : <Select
                      disabled={
                        contractgroupDetails.contractGroupStatusId == 2 ||
                          contractgroupDetails.contractGroupStatusId == 1 ||

                          contractgroupDetails.contractGroupStatusId == 3
                          ? false
                          : true
                      }
                      sx={{
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          border: 0,
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "rgb(96 165 250)",
                        },
                      }}
                      className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full    "
                      value={
                        frmContractGroupDetail.values
                          .requireDescriptionInfoSeatNumber
                      }
                      onChange={frmContractGroupDetail.handleChange}
                      onBlur={frmContractGroupDetail.handleBlur}
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
                    </Select>}

                    {frmContractGroupDetail.errors
                      .requireDescriptionInfoSeatNumber &&
                      frmContractGroupDetail.touched
                        .requireDescriptionInfoSeatNumber ? (
                      <div className="text-red-600 text-xs font-semibold p-1">
                        {
                          frmContractGroupDetail.errors
                            .requireDescriptionInfoSeatNumber
                        }
                      </div>
                    ) : null}
                  </FormControl>
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Hãng xe*</p>
                  <FormControl className="w-full">
                    {frmContractGroupDetail.values.id == 0 ? <Skeleton
                      component="div"
                      variant="rectangular"
                      width="100%"
                      height={40}
                    /> : <Select
                      disabled={
                        contractgroupDetails.contractGroupStatusId == 2 ||
                          contractgroupDetails.contractGroupStatusId == 1 ||
                          contractgroupDetails.contractGroupStatusId == 3
                          ? false
                          : true
                      }
                      displayEmpty
                      sx={{
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          border: 0,
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "rgb(96 165 250)",
                        },
                        "&:disabled": {
                          backgroundColor: "#f5f5f5",
                          color: "#888",
                        },
                      }}
                      value={
                        carMake.length > 0
                          ? frmContractGroupDetail.values
                            .requireDescriptionInfoCarBrand
                          : ""
                      }
                      onChange={frmContractGroupDetail.handleChange}
                      className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full    "
                      onBlur={frmContractGroupDetail.handleBlur}
                      name="requireDescriptionInfoCarBrand"
                    >
                      <MenuItem value="">Hãng xe tùy chọn</MenuItem>
                      {carMake.map((model) => (
                        <MenuItem key={model.id} value={model.name}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>}

                  </FormControl>
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Màu xe*</p>
                  <FormControl className="w-full  ">
                    {frmContractGroupDetail.values.id == 0 ? <Skeleton
                      component="div"
                      variant="rectangular"
                      width="100%"
                      height={40}
                    /> : <Select
                      sx={{
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          border: 0,
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "rgb(96 165 250)",
                        },
                      }}
                      disabled={
                        contractgroupDetails.contractGroupStatusId == 2 ||
                          contractgroupDetails.contractGroupStatusId == 1 ||
                          contractgroupDetails.contractGroupStatusId == 3
                          ? false
                          : true
                      }
                      className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full  outline-blue-400    "
                      value={
                        frmContractGroupDetail.values
                          .requireDescriptionInfoCarColor
                      }
                      onChange={frmContractGroupDetail.handleChange}
                      onBlur={frmContractGroupDetail.handleBlur}
                      name="requireDescriptionInfoCarColor"
                    >
                      <MenuItem value={""} >Màu xe tùy chọn</MenuItem>
                      {requireDescriptionInfoCarColor.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>}

                  </FormControl>
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Truyền động*</p>
                  <FormControl className="w-full  ">
                    {frmContractGroupDetail.values.id == 0 ? <Skeleton
                      component="div"
                      variant="rectangular"
                      width="100%"
                      height={40}
                    /> : <Select
                      sx={{
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          border: 0,
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "rgb(96 165 250)",
                        },
                      }}
                      disabled={
                        contractgroupDetails.contractGroupStatusId == 2 ||
                          contractgroupDetails.contractGroupStatusId == 1 ||
                          contractgroupDetails.contractGroupStatusId == 3
                          ? false
                          : true
                      }
                      className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full  outline-blue-400    "
                      value={
                        frmContractGroupDetail.values
                          .requireDescriptionInfoGearBox
                      }
                      onChange={frmContractGroupDetail.handleChange}
                      onBlur={frmContractGroupDetail.handleBlur}
                      name="requireDescriptionInfoGearBox"
                    >
                      <MenuItem value={""} disabled selected>Truyền động tùy chọn</MenuItem>
                      {requireDescriptionInfoGearBox.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>}

                  </FormControl>
                </div>
                <div className="mb-5">
                  <p className="font-semibold mb-2">Mục đích thuê</p>
                  {frmContractGroupDetail.values.id == 0 ? <Skeleton
                    component="div"
                    variant="rectangular"
                    width="100%"
                    height={128}
                  /> : <textarea
                    name="rentPurpose"
                    disabled={
                      contractgroupDetails.contractGroupStatusId == 2 ||
                        contractgroupDetails.contractGroupStatusId == 1 ||
                        contractgroupDetails.contractGroupStatusId == 3
                        ? false
                        : true
                    }
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={frmContractGroupDetail.values.rentPurpose}
                    className=" border-[1px] rounded-[4px] h-32 pl-2  border-gray-400 w-full  outline-blue-400"
                  />}

                  {frmContractGroupDetail.errors.rentPurpose &&
                    frmContractGroupDetail.touched.rentPurpose && (
                      <div className="text mt-1  text-xs text-red-600 font-semibold">
                        {frmContractGroupDetail.errors.rentPurpose}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className=" mt-5 ">
              <div className="mb-2">
                <h2 className="text-xl font-bold mb-2">Bổ sung thêm giấy tờ</h2>
                <p className="text-gray-400">
                  Yêu cầu khách hàng bổ sung thêm giấy tờ sau nếu cần thiết{" "}
                </p>
              </div>
              <Paper component="div" sx={{ width: "100%", overflow: "auto" }}>
                <TableContainer component="div">
                  <Table component="div" aria-label="sticky table">
                    <TableHead component="div">
                      <TableRow component="div"
                        sx={{
                          backgroundColor: "rgb(219 234 254)",
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell
                            component="div"
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            className="font-bold"
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody component="div">
                      {dataListFile.length == 1
                        ? dataLoad.map((row, index) => {
                          return (
                            <TableRow
                              component="div"
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              {dataLoadRow.map((column, index) => {
                                return (
                                  <TableCell component="div" key={index}>
                                    <Skeleton
                                      component="div"
                                      variant="rectangular"
                                      width="100%"
                                      height={20}
                                    />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })
                        : rows.map((row, index) => {
                          const data = dataListFile.find((data) => data.isDelete == row.isDelete);
                          return (
                            data?.isDelete == false ?
                              <TableRow component="div" role="checkbox" tabIndex={-1} key={index}>
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell component="div" key={column.id} align={column.align}>
                                      {column.format && typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                              : undefined);
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <div className="my-5 gap-5 justify-end  flex">
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleClickAddItemInDataListFile}
                  color="success"
                  className={contractgroupDetails.contractGroupStatusId > 1 ? "hidden" : "btn-choose-car"}
                  variant="contained"
                >
                  thêm mới
                </Button>
              </div>
            </div>
            <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />

            <AlertComponent
              message={messageAlert}
              alert={alert}
              parentCallback={callbackFunctionAlert}
            />
            <hr className="mt-2" />
            <div className="mt-5 flex mb-20">
              <Button
                color="warning"
                type="submit"
                className={
                  contractgroupDetails.contractGroupStatusId == 2 ||
                    contractgroupDetails.contractGroupStatusId == 1 ||
                    contractgroupDetails.contractGroupStatusId == 3
                    ? "btn-choose-car mr-5"
                    : "hidden"
                }
                variant="contained"
              >
                CẬP NHẬT
              </Button>
              <Button
                className={
                  contractgroupDetails.contractGroupStatusId >= 6
                    ? "btn-choose-car mr-5"
                    : "hidden"
                }
                sx={{ ml: 2 }}
                variant="contained"
                color="secondary"
                onClick={handleClickOpenAdd}
              >
                XEM PDF
              </Button>
              <Button
                color="inherit"
                className="btn-choose-car"
                variant="contained"
              >
                HUỶ BỎ
              </Button>
              {isloading == true ? <PopupLoading /> : undefined}
            </div>
          </form>
        </div>
      </div>
      <PopupComfirm isConfirm={handleClickDelete} CloseConfirm={handleCloseConfirm} open={openConfirm} />
      <PopupPdf
        pdf={rentContractDetailByContractId?.filePath}
        pdfFileWithSignsPath={
          rentContractDetailByContractId?.fileWithSignsPath
        }
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
        openDad={open}
        parentCallback={callbackFunctionPopup}
        data={rentContractDetailByContractId}
        signStaff={rentContractDetailByContractId?.staffSignature}
        signCustomer={rentContractDetailByContractId?.customerSignature}
        pdfName={"RentContract"}
        dataContract={contractgroupDetails}
        rentContractFiles={rentContractFiles}
        role="sale"
      />
    </ProfileTemplate>
  );
}
