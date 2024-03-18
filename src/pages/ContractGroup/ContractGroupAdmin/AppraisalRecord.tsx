import HistoryIcon from "@mui/icons-material/History";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import {
  Button, Skeleton, Stack,
  TextField, TablePagination
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFormik } from "formik";
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from "react";
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
  | "title";

  label: string;
  minWidth?: number;
  width?: number;
  align?: "left";
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
];

export default function AppraisalRecord(props: any) {
  let { parentCallbackAlert, parentCallbackMessageAlert } = props;
  const dispatch: DispatchType = useDispatch();
  const { contractgroupDetails, contractGroupByCustomer } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { CarResult, carSelect, CarResultDetail } = useAppSelector(
    (state: RootState) => state.CarResult
  );
  const { AppraisalRecord } = useAppSelector(
    (state: RootState) => state.AppraisalRecord
  );

  const { user } = useAppSelector((state: RootState) => state.user);

  const getContractByCustomerAPI = () => {
    const actionAsync = getByCustomerReducercarAsyncApi(
      contractgroupDetails.citizenIdentificationInfoNumber
    );
    dispatch(actionAsync);
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
  function createData(data: any, index: number) {
    let title = data.contractGroupStatusName;
    let rentFrom = new Date(data.rentFrom).toLocaleDateString();
    let rentTo = new Date(data.rentTo).toLocaleDateString();
    let stt = index + 1;


    return {
      stt,
      title,
      rentFrom,
      rentTo
    };
  }
  const rows = contractGroupByCustomer.map((data: any, index: number) => {
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
  const newPrice = (weekdays.length +  weekends.length) < 30 ?
    weekdays.length * peiceCarDay + weekends.length * peiceCarWeek 
    : (weekdays.length +  weekends.length) * peiceCarMonth ;
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
        {/* <Button
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
        </Button> */}
      </>
    );
  } else if (contractgroupDetails.contractGroupStatusId === 1) {
    buttonStatus = (
      <>
        {/* <Button
          type="submit"
          className="btn-choose-car mr-5"
          sx={{ ml: 2 }}
          variant="contained"
          color="success"
        >
          Kiểm Duyệt
        </Button> */}
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
                      <TableBody>
                        {((rowsPerPage > 0
                          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : rows
                        )).map((row, index) => {
                     
                          return (
                            <TableRow

                              role="checkbox"
                              tabIndex={-1}
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
                  <TablePagination
                    labelRowsPerPage={"Số lượng của trang"}
                    className=""
                    rowsPerPageOptions={[5, 25, 100]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} trên ${count}`
                    }
                    component="div"
                    count={contractGroupByCustomer.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
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
