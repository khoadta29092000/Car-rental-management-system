import HistoryIcon from "@mui/icons-material/History";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import {
  Button, Skeleton, Stack,
  TextField, TablePagination, Tooltip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavLink } from 'react-router-dom';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useAppSelector } from "../../../hooks";
import { eachDayOfInterval, isWeekend } from "date-fns";
import { AppraisalRecordModel } from "../../../models/AppraisalRecordModel";
import {
  AppraisalRecordAction,
  getByIdAppraisalRecordReducerAsyncApi,
  postAppraisalRecordReducerAsyncApi,
} from "../../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import {
  carAction,
  getCarByIdAsyncApi,
  getcarAsyncApi,
  putCarupdatestatusAsyncApi,
} from "../../../redux/CarReducer/CarReducer";
import { getByCustomerReducercarAsyncApi, putStatusCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import {
  getProfileAsyncApi,
  userAction,
} from "../../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../../redux/store";
import { PopupFail } from "../Component/PopupFail";
import { PopupHistory } from "../Component/PopupHistory";
import { PopupSelectCar } from "../Component/PopupSelectCar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { postSendMailReducerAsyncApi } from "../../../redux/RentContractReducer/RentContractReducer";
import { getReceiveContractByContractIdAsyncApi } from "../../../redux/ReceiveContractReducer/ReceiveContractReducer";
function parseToVND(number: any) {
  let strNumber = number.toString().replace(/[.,]/g, "");
  strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return strNumber;
}

interface Column {
  id:
  | "stt"
  | "rentFrom"
  | "rentTo"
  | "title"
  | "edit";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "left" | "center";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  {
    id: "stt",
    label: "Stt",
    minWidth: 50,
    width: 50,
    align: "left",
  },

  { id: "rentFrom", label: "Từ ngày", minWidth: 100, width: 100 },
  {
    id: "rentTo",
    label: "Đền ngày",
    minWidth: 100,
    width: 100,
    align: "left",
  },
  { id: "title", label: "Tình trạng", minWidth: 150 },
  { id: "edit", label: "Thao tác", minWidth: 100, width: 100, align: "center", },
];

export default function AppraisalRecord(props: any) {
  let { parentCallbackAlert, parentCallbackMessageAlert } = props;
  const dispatch: DispatchType = useDispatch();
  const { contractgroupDetails, contractGroupByCustomer, loading } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { CarResult, carSelect, CarResultDetail } = useAppSelector(
    (state: RootState) => state.CarResult
  );
  const { AppraisalRecord } = useAppSelector(
    (state: RootState) => state.AppraisalRecord
  );
  const { ReceiveContractDetailByContractId } = useAppSelector(
    (state: RootState) => state.ReceiveContract
  );
  const { user } = useAppSelector((state: RootState) => state.user);
  const [filterContract, setFilterContract] = useState(
    contractGroupByCustomer
      .map((data: any) => ({
        id: data.id,
        contractGroupStatusName: data.contractGroupStatusName,
        contractGroupStatusId: data.contractGroupStatusId,
        rentFrom: data.rentFrom,
        rentTo: data.rentTo,
        status: false,
      }))
      .filter((data: any) => data.id !== contractgroupDetails.id)
  );
  const getContractByCustomerAPI = () => {
    const actionAsync = getByCustomerReducercarAsyncApi(
      contractgroupDetails.citizenIdentificationInfoNumber
    );
    dispatch(actionAsync).then((response: any) => {
      if (response.payload != undefined) {
        setFilterContract(response.payload
          .map((data: any) => ({
            id: data.id,
            contractGroupStatusName: data.contractGroupStatusName,
            contractGroupStatusId: data.contractGroupStatusId,
            rentFrom: data.rentFrom,
            rentTo: data.rentTo,
            status: false,
          }))
          .filter((data: any) => data.id !== contractgroupDetails.id)
        );
      }
    });;
  };
  const getByIdAppraisalRecordAPI = () => {
    const actionAsync = getByIdAppraisalRecordReducerAsyncApi(
      contractgroupDetails.id
    );
    dispatch(actionAsync).then((response: any) => {
      if (response.payload != undefined) {
        dispatch(getProfileAsyncApi(response.payload.expertiserId));
      }
    });
  };
  const [openHistory, setOpenHistory] = useState(false);
  function handeClickOpenHistory() {
    setOpenHistory(true);
  }
  let callbackFunctionPopupHistory = (childData: any) => {
    setOpenHistory(childData);
  };
  function handleClick(data: any, index: number) {
    if (data.contractGroupStatusId == 13 ||
      data.contractGroupStatusId == 14 ||
      data.contractGroupStatusId == 16 ||
      data.contractGroupStatusId == 17) {
      dispatch(
        getReceiveContractByContractIdAsyncApi(data?.id)
      )
    }
    const updatedDataListFile = filterContract.map((data, i) => ({
      ...data,
      status: i === index ? !data.status : false,
    }));
    setFilterContract(updatedDataListFile);
  }

  function createData(data: any, index: number) {
    let title = data.contractGroupStatusName;
    let rentFrom = new Date(data.rentFrom).toLocaleDateString();
    let rentTo = new Date(data.rentTo).toLocaleDateString();
    let stt = index + 1;
    let edit = data.status == false ? <Tooltip title="Vi phạm">
      <button
        onClick={(e) => handleClick(data, index)}
        className="gap-2 hover:bg-gray-200 bg-gray-100 rounded-full p-2 hover:text-gray-600"
      >
        <ExpandMoreIcon className="h-5 w-5" />
      </button>
    </Tooltip> : <Tooltip title="Vi phạm">
      <button
        onClick={(e) => handleClick(data, index)}
        className="gap-2 hover:bg-gray-200 bg-gray-100 rounded-full px-2 pt-1 pb-2 hover:text-gray-600"
      >
        <ExpandLessIcon className="h-5 w-5" />
      </button>
    </Tooltip>;
    let id = data.id;
    let contractGroupStatusId = data.contractGroupStatusId;
    let status = data.status
    return {
      id,
      contractGroupStatusId,
      stt,
      title,
      rentFrom,
      rentTo,
      edit,
      status
    };
  }
  // const filterContract = contractGroupByCustomer
  //   .map((data: any) => ({
  //     id: data.id,
  //     contractGroupStatusName: data.contractGroupStatusName,
  //     rentFrom: data.rentFrom,
  //     rentTo: data.rentTo,
  //     status: false,
  //   }))
  //   .filter((data: any) => data.id !== contractgroupDetails.id);

  const rows = filterContract.map((data: any, index: number) => {
    return createData(data, index);
  });
  const initialValues = {
    id: 0,
    carId: 0,
    contractGroupId: 0,
    expertiserId: 0,
    expertiseDate: new Date(),
    resultOfInfo: true,
    resultOfCar: true,
    resultDescription: "",
    depositInfoCarRental: 0,
    depositInfoDownPayment: 0,
    filePath: "",
  };
  function ApiCar() {
    const actionGetCarById = getcarAsyncApi({
      page: 1,
      pageSize: 100000,
    });
    dispatch(actionGetCarById);
  }
  useEffect(() => {
    if (contractgroupDetails.contractGroupStatusId !== 1) {
      getByIdAppraisalRecordAPI();
      ApiCar();
    } else {
      frmAppraisalRecord.setValues(initialValues);
    }
    getContractByCustomerAPI();
    return () => {
      dispatch(carAction.resetCar());
      dispatch(userAction.resetUser());
      dispatch(AppraisalRecordAction.deleteAppraiselAction());
    };
  }, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);
  const frmAppraisalRecord = useFormik<AppraisalRecordModel>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      carId: Yup.string()
        .required("Xe khả dụng không được trống!")
        .notOneOf(["0"], "Xe khả dụng không được trống!"),
      depositInfoDownPayment: Yup.string()
        .nullable()
        .matches(/^[0-9.]{4,12}$/, "Số tiền đặt cọc không hợp lệ!")
        .required("Số tiền đặt cọc không được trống!"),
      // depositInfoCarRental: Yup.string()
      //   .nullable()
      //   .matches(/^[0-9.]{4,12}$/, "Số tiền đặt cọc không hợp lệ!")
      //   .required("Số tiền đặt cọc không được trống!"),
    }),
    onSubmit: (values: any) => {
      frmAppraisalRecord.setFieldValue(
        "depositInfoDownPayment",
        frmAppraisalRecord.values.depositInfoDownPayment
          .toString()
          .replace(/[.,]/g, "")
      );
      frmAppraisalRecord.setFieldValue(
        "depositInfoCarRental",
        frmAppraisalRecord.values.depositInfoCarRental
          .toString()
          .replace(/[.,]/g, "")
      );
      const actionPostExpertiseGroup = postAppraisalRecordReducerAsyncApi({
        ...values,
        expertiseDate: new Date(),
        expertiserId: userProfile?.id,
        depositInfoDownPayment: parseInt(
          frmAppraisalRecord.values.depositInfoDownPayment
            .toString()
            .replace(/[.,]/g, "")
        ),
        depositInfoCarRental: parseInt(
          frmAppraisalRecord.values.depositInfoCarRental
            .toString()
            .replace(/[.,]/g, "")
        ),
        contractGroupId: contractgroupDetails.id,
      });
      const body = {
        ToEmail: `${contractgroupDetails.staffEmail}`,
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
                Yêu cầu hoàn thành
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
                        margin: 0;">Lưu ý: Xem lại thông tin(<a href="https://atshare.vercel.app/profiledetail/${contractgroupDetails.id}">tại đây</a>)</p>  
    </body></html>`,

      };
      dispatch(postSendMailReducerAsyncApi(body));
      dispatch(actionPostExpertiseGroup).then((response: any) => {
        if (response.payload != undefined) {
          dispatch(
            getByIdAppraisalRecordReducerAsyncApi(contractgroupDetails.id)
          );
        
          dispatch(
            putCarupdatestatusAsyncApi({
              id: frmAppraisalRecord.values.carId,
              carStatusId: 4
            })
          );

          parentCallbackAlert("success");
          parentCallbackMessageAlert("kiểm duyệt thành công");
        }
      });
    },
  });
  const [alert, setAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [open, setOpen] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [openSelectCar, setOpenSelectCar] = useState(false);
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionPopupPdf = (childData: any) => {
    setOpenPdf(childData);
  };
  let callbackFunctionPopupSelectCar = (childData: any) => {
    setOpenSelectCar(childData);
  };
  let callbackFunctionSetCarId = (childData: any) => {
    ApiCarById(childData);
    frmAppraisalRecord.setFieldValue("carId", childData);
  };

  const handleClickOpenAdd = () => {
    setOpen(true);
  };
  const handleClickOpenPDF = () => {
    setOpenPdf(true);
  };
  const handleClickOpenSelectCar = () => {
    setOpenSelectCar(true);
  };
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  function handleChangeStatusContractGroup(values: any) {
    const actionPutContractGroup =
      putStatusCarContractgroupReducercarAsyncApi(values);
    dispatch(actionPutContractGroup);
  }
  function handlechangeTime() { }
  function ApiCarById(values: any) {
    const actionGetCarById = getCarByIdAsyncApi(values);
    dispatch(actionGetCarById);
  }
  useEffect(() => {
    if (AppraisalRecord.id != 0) {
      frmAppraisalRecord.setValues(AppraisalRecord);
      ApiCarById(AppraisalRecord.carId)
  
    } else {
      frmAppraisalRecord.setValues(initialValues);
    }
  }, [AppraisalRecord.id]);
  const peiceCarDay = CarResultDetail?.priceForNormalDay;
  const peiceCarWeek = CarResultDetail?.priceForWeekendDay;
  const peiceCarMonth = CarResultDetail?.priceForMonth;
  const startDate = contractgroupDetails?.rentFrom
    ? new Date(contractgroupDetails.rentFrom)
    : new Date(); // Ngày bắt đầu
  const endDate = contractgroupDetails?.rentTo
    ? new Date(contractgroupDetails.rentTo)
    : new Date(); // Ngày kết thúc
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = dates.filter((date) => !isWeekend(date));
  const weekends = dates.filter((date) => isWeekend(date));
  const newPrice = (weekdays.length + weekends.length) < 30 ?
    weekdays.length * peiceCarDay + weekends.length * peiceCarWeek
    : (weekdays.length + weekends.length) * peiceCarMonth;
  const selectedCar = CarResult.cars.find(
    (car) => car.id === frmAppraisalRecord.values.carId
  );


  let expertiseView;
  if (contractgroupDetails.contractGroupStatusId !== 1) {
    expertiseView = (
      <div className="grid grid-cols-3">
        <div>
          <h2 className="text-xl font-bold mb-2">Nhân viên thẩm định</h2>
          <p className="text-gray-400">
            Người thẩm định khách hàng và lên hợp đồng
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
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Số điện thoại</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Email</p>
              <Skeleton variant="rectangular" className="w-full" height={40} />
            </div>
          </div>
        )}
      </div>
    );
  }
  let buttonStatus;
  if (contractgroupDetails.contractGroupStatusId === 4) {
    buttonStatus = (
      <>
        {/* <Button
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleClickOpenPDF}
        >
          XEM PDF
        </Button> */}
        <Button
          className="btn-choose-car mr-5"
          variant="contained"
          onClick={() =>
            handleChangeStatusContractGroup({
              id: frmAppraisalRecord.values.contractGroupId,
              contractGroupStatusId: 5,
            })
          }
        >
          HOÀN THÀNH
        </Button>
      </>
    );
  } else if (contractgroupDetails.contractGroupStatusId === 1) {
    buttonStatus = (
      <>
        <Button
          type="submit"
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="success"
        >
          Kiểm Duyệt
        </Button>
        <Button
          color="error"
          className="btn-choose-car mr-5"
          variant="contained"
          onClick={handleClickOpenAdd}
        >
          THẤT BẠI
        </Button>
      </>
    );
  } else {
    buttonStatus = (
      <>
        {/* <Button
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleClickOpenPDF}
        >
          XEM PDF
        </Button> */}
      </>
    );
  }
  const dataLoad = [{}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {},];
  return (
    <>
      <div className="flex">
        <h2 className="font-sans  text-2xl font-bold uppercase ">
          Kiểm duyệt xe
        </h2>
        <div onClick={handeClickOpenHistory} className="ml-auto xl:mr-10">
          <Button
            startIcon={<HistoryIcon />}
            className="bg-blue-500"
            variant="contained"
          >
            Lịch sử
          </Button>
        </div>
      </div>
      <hr className="mt-2" />
      <div className="mt-5 max-w-6xl mx-auto">
        <form onSubmit={frmAppraisalRecord.handleSubmit}>
          {expertiseView}
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Yêu cầu thuê xe</h2>
              <p className="text-gray-400">
                Tìm xe phù hợp với yêu cầu của khách hàng
              </p>
            </div>
            <div className="col-span-2 ml-4">
              <div className="mb-5 lg:grid lg:grid-cols-5">
                <div className="lg:mr-5 lg:col-span-2 ">
                  <p className="font-semibold mb-2">Thuê từ ngày</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        value={contractgroupDetails?.rentFrom}
                        disabled
                        className="lg:w-full "
                        inputFormat="DD/MM/YYYY "
                        onChange={handleChangeStatusContractGroup}
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
                <RepeatOutlinedIcon className="my-2 lg:mx-auto lg:mt-7 lg:my-0" />
                <div className="lg:ml-5 lg:col-span-2">
                  <p className="font-semibold mb-2">đến ngày</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        value={contractgroupDetails.rentTo}
                        disabled
                        inputFormat="DD/MM/YYYY "
                        onChange={handleChangeStatusContractGroup}
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
                            {...params}
                          />
                        )}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Địa chỉ giao xe</p>
                <input
                  disabled
                  name="deliveryAddress"
                  onChange={handleChangeStatusContractGroup}
                  value={contractgroupDetails.deliveryAddress}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Loại xe</p>
                <TextField
                  size="small"
                  disabled
                  value={
                    contractgroupDetails.requireDescriptionInfoSeatNumber +
                    " chỗ"
                  }
                  onChange={handleChangeStatusContractGroup}
                  className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full    "
                  name="requireDescriptionInfoSeatNumber"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Hãng xe</p>
                <TextField
                  size="small"
                  disabled
                  value={
                    contractgroupDetails.requireDescriptionInfoCarBrand == ""
                      ? "Tùy chọn hãng xe"
                      : contractgroupDetails.requireDescriptionInfoCarBrand
                  }
                  className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full    "
                  name="requireDescriptionInfoCarBrand"
                />
              </div>

              <div className="mb-5">
                <p className="font-semibold mb-2">Màu xe</p>
                <TextField
                  size="small"
                  disabled
                  value={
                    contractgroupDetails.requireDescriptionInfoCarColor == ""
                      ? "Tùy chọn màu  xe"
                      : contractgroupDetails.requireDescriptionInfoCarColor
                  }
                  className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full    "
                  name="carco.requireDescriptionInfoCarColor"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Truyền động</p>
                <TextField
                  size="small"
                  disabled
                  value={
                    contractgroupDetails.requireDescriptionInfoGearBox == ""
                      ? "Tùy chọn truyền động"
                      : contractgroupDetails.requireDescriptionInfoGearBox
                  }
                  className=" border-[1px] rounded-[4px] h-10   border-gray-400 w-full    "
                  name="carco.requireDescriptionInfoGearBox"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Mục đích thuê</p>
                <textarea
                  name="rentPurpose"
                  disabled
                  value={contractgroupDetails.rentPurpose}
                  className=" border-[1px] rounded-[4px] h-32 pl-2  border-gray-400 w-full  outline-blue-400"
                />
              </div>
              <div className="mb-5">
                <div className="flex mb-2 gap-2">
                  <p className="font-semibold mb-2">Xe khả dụng*</p>{" "}
                  <Button
                    color="secondary"
                    className={
                      contractgroupDetails.contractGroupStatusId == 1
                        ? "btn-choose-car h-6"
                        : "hidden"
                    }
                    variant="contained"
                    onClick={handleClickOpenSelectCar}
                  >
                    Chọn xe
                  </Button>
                </div>
                {selectedCar &&
                  contractgroupDetails.contractGroupStatusId != 1 && (
                    <div className=" lg:flex grid md:mx-0 justify-center items-center  gap-5  w-full text-center border-b-[1px] pb-2 ">
                      <img
                        //onClick={() => haneleClickOpenImg(frmAppraisalRecord.values?.frontImg)}
                        className="h-44 w-40"
                        src={selectedCar.frontImg}
                      />
                      <div className="grid lg:grid-cols-3">
                        <div className="col-span-2">
                          <div className="flex gap-2">
                            <div className="font-semibold">Biển số xe: </div>
                            <div>{selectedCar.carLicensePlates}</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">Hãng xe: </div>
                            <div>{selectedCar.makeName}</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">Tên xe: </div>
                            <div>{selectedCar.makeName}</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">Số chỗ: </div>
                            <div>{selectedCar.seatNumber}</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">Màu xe: </div>
                            <div>{selectedCar.carColor}</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">
                              Giá tiền theo ngày thường:{" "}
                            </div>
                            <div>{parseToVND(CarResultDetail.priceForNormalDay)} Vnđ</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">
                              Giá tiền theo ngày cuối tuần:{" "}
                            </div>
                            <div>{parseToVND(CarResultDetail.priceForWeekendDay)} Vnđ</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">
                              Giá tiền theo tháng:{" "}
                            </div>
                            <div>{parseToVND(CarResultDetail.priceForMonth)} Vnđ</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="font-semibold">Tình trạng xe: </div>
                            <div>{selectedCar.carStatus}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                {carSelect == null ? (
                  frmAppraisalRecord.errors.carId &&
                  frmAppraisalRecord.touched.carId && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmAppraisalRecord.errors.carId}
                    </div>
                  )
                ) : (
                  <div
                    key={carSelect.id}
                    className=" lg:flex grid grid-cols-1 md:mx-0 justify-center items-center gap-2 md:gap-5  w-full text-center border-b-[1px] pb-2 "
                  >
                    <img
                      //onClick={() => haneleClickOpenImg(carSelect?.frontImg)}
                      className="h-44 w-40"
                      src={carSelect.frontImg}
                    />
                    <div className="grid lg:grid-cols-3 w-full">
                      <div className="col-span-2">
                        <div className="flex gap-2">
                          <div className="font-semibold">Biển số xe: </div>
                          <div>{carSelect.carLicensePlates}</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">Hãng xe: </div>
                          <div>{carSelect.makeName}</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">Tên xe: </div>
                          <div>{carSelect.makeName}</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">Số chỗ: </div>
                          <div>{carSelect.seatNumber}</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">Màu xe: </div>
                          <div>{carSelect.carColor}</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">
                            Giá tiền theo ngày thường:{" "}
                          </div>
                          <div>{parseToVND(CarResultDetail.priceForNormalDay)} Vnđ</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">
                            Giá tiền theo ngày cuối tuần:{" "}
                          </div>
                          <div>{parseToVND(CarResultDetail.priceForWeekendDay)} Vnđ</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">
                            Giá tiền theo tháng:{" "}
                          </div>
                          <div>{parseToVND(CarResultDetail.priceForMonth)} Vnđ</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="font-semibold">Tình trạng xe: </div>
                          <div>{carSelect.carStatus}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="grid grid-cols-3 mt-5">
            <div>
              <h2 className="text-xl font-bold mb-2">Thông tin đặt cọc</h2>
              <p className="text-gray-400">
                Những yêu cầu về tiền trả trước và trả sau khi lấy xe
              </p>
            </div>
            <div className="col-span-2 ml-4 ">
              <div className=" mt-5 ">
                <div>
                  <h2 className="text-xl font-bold mb-2">Lịch sử thuê xe</h2>
                  <p className="text-gray-400 mb-2">
                    Điều hành có thể xem và đánh giá mức cọc cần thiết
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
                              style={{ minWidth: column.minWidth, width: column.width }}
                              className="font-bold"
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody >
                        {loading == true
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
                          :
                          (
                            rows.length > 0 ? ((rowsPerPage > 0
                              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              : rows
                            )).map((row, index) => {
                           

                              return (
                                <Fragment key={index}>
                                  <TableRow
                                    role="checkbox"
                                    tabIndex={-1}
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
                                  <TableRow
                                    className={row.status == true ? "" : "hidden"}
                                    role="checkbox"
                                    tabIndex={-1}
                                  >
                                    {row.contractGroupStatusId == 13 ||
                                      row.contractGroupStatusId == 14 ||
                                      row.contractGroupStatusId == 16 ||
                                      row.contractGroupStatusId == 17 ? <TableCell colSpan={5}
                                        className="w-full mx-auto text-center font-semibold ">
                                      <p>Vi phạm giao thông: {ReceiveContractDetailByContractId && ReceiveContractDetailByContractId.detectedViolations == true ? "Có vi phạm" : "Không vi phạm"}
                                      </p>
                                      <p>
                                        Hư hại xe: {ReceiveContractDetailByContractId && ReceiveContractDetailByContractId.originalCondition == false ? "Có hư hại" : "Không hư hại"}
                                      </p>
                                      <p>  Tổng phạt: {ReceiveContractDetailByContractId && ReceiveContractDetailByContractId.insuranceMoney + ReceiveContractDetailByContractId.violationMoney  }
                                      </p>
                                    </TableCell> : <TableCell colSpan={5}
                                      className="w-full mx-auto text-center font-semibold ">
                                      Tới giai đoạn giao xe mới xem được
                                    </TableCell>}
                                  </TableRow>
                                </Fragment >
                              );
                            }) : (
                              <TableRow className="w-full mx-auto text-center text-lg">
                                <TableCell
                                  colSpan={columns.length}
                                  className="w-full text-center text-lg border-none "
                                >
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Fdownload.svg2561bc28-0cfc-4d75-b183-00387dc91474?alt=media&token=cc09aed8-ccd7-4d8a-ba3c-0b4ace899f40"
                                    className="h-40 w-40 mx-auto "
                                  />
                                  <h2>Khách hàng thuê lần đầu</h2>

                                </TableCell>
                              </TableRow>
                            )
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {rows.length > 0 ? <TablePagination
                    labelRowsPerPage={"Số lượng của trang"}
                    className=""
                    rowsPerPageOptions={[5, 25, 100]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} trên ${count}`
                    }
                    component="div"
                    count={filterContract.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  /> : undefined}
                </Paper>

              </div>
              {/* <div className="mb-5">
                <p className="font-semibold mb-2">Giá trị đặt cọc(vnđ)*</p>
                <input
                  name="depositInfoCarRental"
                  disabled={
                    contractgroupDetails.contractGroupStatusId === 1
                      ? false
                      : true
                  }
                  onChange={frmAppraisalRecord.handleChange}
                  onBlur={frmAppraisalRecord.handleBlur}
                  value={
                  sitInfoCarRental: Yup.string()
                      ? ""
                      : parseToVND(frmAppraisalRecord.values.depositInfoCarRental)
                  }
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full l outline-blue-400"
                />
                {frmAppraisalRecord.errors.depositInfoCarRental &&
                  frmAppraisalRecord.touched.depositInfoCarRental && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmAppraisalRecord.errors.depositInfoCarRental}
                    </div>
                  )}
              </div> */}
              <div className="my-5">
                <p className="font-semibold mb-2">Giá trị hợp đồng(vnđ)</p>
                <input
                  onChange={handlechangeTime}
                  disabled
                  value={parseToVND(newPrice) + " đ"}
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full outline-blue-400 bg-gray-100"
                />
              </div>
              <div className="mb-5">
                <p className="font-semibold mb-2">Giá trị thế chấp(vnđ)*</p>
                <input
                  name="depositInfoDownPayment"
                  disabled={
                    contractgroupDetails.contractGroupStatusId === 1
                      ? false
                      : true
                  }
                  onChange={frmAppraisalRecord.handleChange}
                  onBlur={frmAppraisalRecord.handleBlur}
                  value={
                    frmAppraisalRecord.values.depositInfoDownPayment === 0
                      ? ""
                      : parseToVND(
                        frmAppraisalRecord.values.depositInfoDownPayment
                      )
                  }
                  className=" border-[1px] rounded-[4px] h-10 pl-2  border-gray-400 w-full l outline-blue-400"
                />
                {frmAppraisalRecord.errors.depositInfoDownPayment &&
                  frmAppraisalRecord.touched.depositInfoDownPayment && (
                    <div className="text mt-1  text-xs text-red-600 font-semibold">
                      {frmAppraisalRecord.errors.depositInfoDownPayment}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <PopupFail
            parentCallbackAlert={callbackFunctionAlert}
            parentCallbackMessageAlert={callbackFunctionMessageAlert}
            openDad={open}
            parentCallback={callbackFunctionPopup}
            isCar={true}
            data={contractgroupDetails}
          />
          <PopupSelectCar
            parentCallbackAlert={callbackFunctionAlert}
            parentCallbackMessageAlert={callbackFunctionMessageAlert}
            openDad={openSelectCar}
            parentCallback={callbackFunctionPopupSelectCar}
            setCarId={callbackFunctionSetCarId}
            data={contractgroupDetails}
          />
          <PopupHistory
            openDad={openHistory}
            parentCallback={callbackFunctionPopupHistory}
            data={contractgroupDetails.id}
            isAppraisal={true}
          />
          {/* <PopupPdf
          pdf={AppraisalRecord?.filePath}
          openDad={openPdf}
          parentCallback={callbackFunctionPopupPdf}
          pdfName={"AppraisalRecord"}
        /> */}
          <hr className="mt-2" />
          <div className="mt-5 flex mb-20">
            {buttonStatus}
            <NavLink to="/Expertise/ContractGroup" className="hover:underline">
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
