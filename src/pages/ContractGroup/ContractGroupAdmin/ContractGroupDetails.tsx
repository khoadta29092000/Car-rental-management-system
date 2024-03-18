import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import HistoryIcon from "@mui/icons-material/History";
import { Button, FormControl, MenuItem, Select, Stack, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { NavLink } from 'react-router-dom';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { AlertComponent } from "../../../Components/AlertComponent";
import PopupComfirm from "../../../Components/PopupComfirm";
import PopupImage from "../../../Components/PopupImage";
import { useAppSelector } from "../../../hooks";
import { contractgroupDetailsModel } from "../../../models/contractgroupDetailsModel";
import {
  putCarContractgroupReducercarAsyncApi,
  putStatusCarContractgroupReducercarAsyncApi,
} from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { DispatchType, RootState } from "../../../redux/store";
import { PopupFail } from "../Component/PopupFail";
import { PopupHistory } from "../Component/PopupHistory";
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
const requireDescriptionInfoYearCreate = [2022, 2021, 2020, 2019, 2018, 2017];

interface Column {
  id:
    | "stt"
    | "title"
    | "typeOfDocument"
    | "file"
    | "documentDescription"
    | "action";
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
  { id: "typeOfDocument", label: "Hình thức giấy tờ", minWidth: 150 },
  {
    id: "file",
    label: "Đính kèm",
    minWidth: 150,
    align: "left",
  },
  {
    id: "documentDescription",
    label: "Ghi chú",
    minWidth: 150,
    align: "left",
  },
  { id: "action", label: "Thao tác", minWidth: 100 },
];

export default function ContractGroupDetail(props: any) {
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const { parentCallback } = props;
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString == null ? "" : userString);
  const [alert, setAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [open, setOpen] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const dispatch: DispatchType = useDispatch();
  const [isFaild, setIsFaild] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const { contractgroupDetails } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );

  interface DataListFile {
    title: string;
    typeOfDocument: string;
    file: string;
    documentDescription: string;
    status: boolean;
    customerInfoId: number;
    id: number;
    isDelete: boolean;
  }
  const customerFilesAlready = contractgroupDetails.customerFiles.map(
    (item) => ({
      id: item.id,
      customerInfoId: item.customerInfoId,
      title: item.title,
      typeOfDocument: item.typeOfDocument,
      file: item.documentImg,
      documentDescription: item.documentDescription ?? null,
      status: true,
      isDelete: false,
    })
  );
  const [dataListFile, setDataListFile] = useState<DataListFile[]>([]);
  const newListFile = dataListFile.filter((item) => {
    if (
      item.documentDescription != "" &&
      item.title != "" &&
      item.isDelete != true
    ) {
      return item;
    }
  });
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };
  const handleClickOpenConfirm = (value: number) => {
    setOpenConfirm(true);
    setIdDelete(value);
  };
  function handleCloseConfirm(value: any) {
    setOpenConfirm(value);
  }
  function handleClickDelete(value: any) {
    if (value == true) {
      let newArrClone = [...dataListFile];
      const newArr = newArrClone.map((item) => {
        if (item.id === idDelete) {
          return { ...item, isDelete: true };
        }
        return item;
      });
      setDataListFile(newArr);
    } else {
    }
  }
  const datatypeOfDocument = ["Bản gốc", "Bản sao", "Bản sao có Mộc"];
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
    let typeOfDocument =
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

    let file =
      data.file != "" || data.file != null ? (
        <img
          onClick={() => haneleClickOpenImg(data.file)}
          src={data.file}
          className="h-40 w-40"
        />
      ) : (
        <img
          onClick={() => haneleClickOpenImg(data.file)}
          src={
            "https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/noimg%2Fistockphoto-1357365823-612x612.jpg01f9bbe9-4c31-44ec-ac2b-61a3c1b745e9?alt=media&token=023c1836-2e15-4827-a53d-674f0159abaa&fbclid=IwAR0beEUcdo-SZ_odc9p0-kAaP_PbOzNtXlILCBqeGLnRfm2qzMyDtRim6UY"
          }
          className="h-40 w-40"
        />
      );
    let documentDescription = (
      <TextField
        disabled={false}
        label={"Ghi chú"}
        value={filterListDelte[index].documentDescription}
        size="small"
        onChange={(e) => {
          const updatedDataListFile = [...filterListDelte];
          updatedDataListFile[index].documentDescription = e.target.value;
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
    let stt = index + 1;
    let status = data.status;
    let action =
      data.status == false ? (
        <Tooltip onClick={() => handleClickOpenConfirm(data.id)} title="Xoá">
          <IconButton>
            <DeleteOutlinedIcon className="" />
          </IconButton>
        </Tooltip>
      ) : undefined;
    let isDelete = data.isDelete;
    return {
      stt,
      title,
      status,
      typeOfDocument,
      file,
      documentDescription,
      action,
      isDelete,
    };
  }
  const filterListDelte = dataListFile.filter((data: any, index: number) => {
    if (data.isDelete == false) {
      return data;
    }
  });
  const rows = filterListDelte.map((data: any, index: number) => {
    return createData(data, index);
  });
 
  const frmContractGroupDetail = useFormik<contractgroupDetailsModel>({
    initialValues: {
      id: 0,
      userId: 0,
      staffEmail: "",
      carId: 0,
      rentPurpose: "",
      rentFrom: new Date(),
      rentTo: new Date(),
      requireDescriptionInfoPriceForDay: 0,
      requireDescriptionInfoGearBox: "",
      requireDescriptionInfoCarClass: "",
      requireDescriptionInfoCarBrand: "",
      requireDescriptionInfoSeatNumber: 4,
      requireDescriptionInfoYearCreate: 0,
      requireDescriptionInfoCarColor: "",
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
      customerEmail: "", // thêm
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
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values: any) => {
      const actionPutContractGroup =
        putCarContractgroupReducercarAsyncApi(values);
      dispatch(actionPutContractGroup).then((response: any) => {
        if (response.payload != undefined) {
          putStatusCarContractgroupReducercarAsyncApi({
            id: contractgroupDetails.id,
            contractGroupStatusId: 1,
          });
        }
      });
    },
  });
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  let callbackFunctionPopupHistory = (childData: any) => {
    setOpenHistory(childData);
  };

  useEffect(() => {
    setDataListFile((prevDataListFile) =>
      prevDataListFile.concat(customerFilesAlready)
    );

    if (contractgroupDetails.id != 0) {
      frmContractGroupDetail.setValues(contractgroupDetails);
    }
  }, []);

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
  function handleChangeCheckCar() {
    if (isFaild == true) {
      setAlert("error");
      setMessageAlert("Bổ sung thông tin rồi phải hủy bỏ");
    } else {
      parentCallback(true);
    }
  }
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  const handleClickOpenAdd = () => {
    setOpen(true);
  };
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
  function handleClickAddItemInDataListFile() {
    if (
      dataListFile[dataListFile.length - 1].title != "" &&
      dataListFile[dataListFile.length - 1].typeOfDocument != ""
    ) {
      setIsFaild(true);
      const newArrayListFile = [...dataListFile];
      const newDataListFile = {
        title: "",
        typeOfDocument: "",
        file: "",
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
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  function handeClickOpenHistory() {
    setOpenHistory(true);
  }

  let viewButtonSale;

  let viewButtonAdminAndExpertise;
  if (contractgroupDetails.contractGroupStatusId == 1) {
    viewButtonAdminAndExpertise = (
      <>
        {/* <Button
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          onClick={handleChangeCheckCar}
        >
          HOÀN TẤT
        </Button> */}
        {/* <Button
          className="btn-choose-car mr-5"
          variant="contained"
          color="error"
          onClick={handleClickOpenAdd}
        >
          THẤT BẠI
        </Button> */}
      </>
    );
  }
  return (
    <>
      <div className="flex">
        <h2 className="font-sans text-2xl font-bold uppercase ">
          Kiểm duyệt thông tin
        </h2>
        <div onClick={handeClickOpenHistory} className="ml-auto xl:mr-10">
          <Button
            startIcon={<HistoryIcon />}
            className="bg-blue-500"
            variant="contained"
          >
            Lịch sử
          </Button>
          {/* <Tooltip title="Lịch sử kiểm duyệt">
            <IconButton>
              <MoreVertOutlinedIcon className="text-gray-400" />
            </IconButton>
          </Tooltip> */}
        </div>
      </div>
      <div className="mt-5 max-w-6xl mx-auto">
        <form onSubmit={frmContractGroupDetail.handleSubmit}>
          <div className="grid grid-cols-3">
            <div>
              <h2 className="text-xl font-bold mb-2">Hồ sơ cá nhân</h2>
              <p className="text-gray-400">
                Những giấy tờ và thông tin của người thuê xe
              </p>
            </div>
            <div className="col-span-2 ">
              <div className="mb-5">
                <p className="font-semibold mb-2">Tên khách hàng*</p>
                <input
                  disabled
                  name="customerName"
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.customerName}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.customerName &&
                  frmContractGroupDetail.touched.customerName && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.customerName}
                    </div>
                  )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Email của Khách*</p>
                <input
                  name="customerEmail"
                  disabled
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.customerEmail}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.customerEmail &&
                  frmContractGroupDetail.touched.customerEmail && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.customerEmail}
                    </div>
                  )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Địa chỉ khách hàng*</p>
                <input
                  disabled
                  name="customerName"
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.customerAddress}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.customerAddress &&
                  frmContractGroupDetail.touched.customerAddress && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.customerAddress}
                    </div>
                  )}
              </div>

              <div className="col-span-2 ">
                <div className="mb-5">
                  <p className="font-semibold mb-2">Số CMND/CCCD của khách*</p>
                  <input
                    disabled
                    name="citizenIdentificationInfoNumber"
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={
                      frmContractGroupDetail.values
                        .citizenIdentificationInfoNumber
                    }
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />
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
              </div>
              <div className="col-span-2 ">
                <div className="mb-5">
                  <p className="font-semibold mb-2">Nơi cấp*</p>
                  <input
                    disabled
                    name="citizenIdentificationInfoAddress"
                    onChange={frmContractGroupDetail.handleChange}
                    onBlur={frmContractGroupDetail.handleBlur}
                    value={
                      frmContractGroupDetail.values
                        .citizenIdentificationInfoAddress
                    }
                    className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                  />
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
              </div>
              <div className=" lg:col-span-2 mb-5">
                <p className="font-semibold mb-2">Ngày cấp*</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      value={
                        frmContractGroupDetail.values
                          .citizenIdentificationInfoDateReceive
                      }
                      disabled
                      className="lg:w-full "
                      inputFormat="DD/MM/YYYY "
                      onChange={(newValue) =>
                        handleChangeTimeRentForm(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              bgcolor: "rgb(243 244 246)",
                            },
                          }}
                          {...params}
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>

              <div className="mb-5">
                <p className="font-semibold mb-2">Số điện thoại*</p>
                <input
                  name="phoneNumber"
                  disabled
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.phoneNumber}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.phoneNumber &&
                  frmContractGroupDetail.touched.phoneNumber && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.phoneNumber}
                    </div>
                  )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Số điện thoại người thân*</p>
                <input
                  name="relativeTel"
                  disabled
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.relativeTel}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.relativeTel &&
                  frmContractGroupDetail.touched.relativeTel && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.relativeTel}
                    </div>
                  )}
              </div>

              <div className="mb-5">
                <p className="font-semibold mb-2">Facebook</p>
                <input
                  name="customerSocialInfoFacebook"
                  disabled
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={
                    frmContractGroupDetail.values.customerSocialInfoFacebook
                  }
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.customerSocialInfoFacebook &&
                  frmContractGroupDetail.touched.customerSocialInfoFacebook && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.customerSocialInfoFacebook}
                    </div>
                  )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Zalo</p>
                <input
                  name="customerSocialInfoZalo"
                  disabled
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.customerSocialInfoZalo}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
                {frmContractGroupDetail.errors.customerSocialInfoZalo &&
                  frmContractGroupDetail.touched.customerSocialInfoZalo && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmContractGroupDetail.errors.customerSocialInfoZalo}
                    </div>
                  )}
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Thông tin công ty</p>
                <input
                  name="companyInfo"
                  disabled
                  onChange={frmContractGroupDetail.handleChange}
                  onBlur={frmContractGroupDetail.handleBlur}
                  value={frmContractGroupDetail.values.companyInfo}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
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
          <div className=" mt-5 ">
            <div>
              <h2 className="text-xl font-bold mb-2">Bổ sung thêm giấy tờ</h2>
              <p className="text-gray-400 mb-2">
                Yêu cầu khách hàng bổ sung thêm giấy tờ sau nếu cần thiết{" "}
              </p>
            </div>
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <TableContainer>
                <Table aria-label="sticky table">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "rgb(219 234 254)",
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
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
                  <TableBody>
                    {rows.map((row, index) => {
                 
                      return (
                        <TableRow
                          sx={
                            row.status == true
                              ? {
                                  backgroundColor: "rgb(243 244 246)",
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }
                              : undefined
                          }
                          role="checkbox"
                          tabIndex={-1}
                          className={row.isDelete == true ? "hidden" : ""}
                          key={index}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
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
                className="btn-choose-car"
                variant="contained"
              >
                thêm mới
              </Button>
            </div>
          </div>

          <PopupFail
            parentCallbackAlert={callbackFunctionAlert}
            parentCallbackMessageAlert={callbackFunctionMessageAlert}
            openDad={open}
            parentCallback={callbackFunctionPopup}
            data={frmContractGroupDetail.values}
            dataNewFiles={newListFile}
            isCar={false}
          />
          <AlertComponent
            message={messageAlert}
            alert={alert}
            parentCallback={callbackFunctionAlert}
          />
          <PopupHistory
            openDad={openHistory}
            parentCallback={callbackFunctionPopupHistory}
            data={contractgroupDetails.id}
            isAppraisal={true}
          />
          <PopupComfirm
            isConfirm={handleClickDelete}
            CloseConfirm={handleCloseConfirm}
            open={openConfirm}
          />
          <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />
          <hr className="mt-2" />
          <div className="mt-5 flex mb-20">
            {viewButtonAdminAndExpertise}
            {viewButtonSale}
            <NavLink to="/Admin/ContractGroup" className="hover:underline">
            <Button
              color="inherit"
              className="btn-choose-car"
              variant="contained"
            >
               QUAY LẠI
            </Button>
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}
