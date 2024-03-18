import React, { useCallback, useEffect, useState } from "react";
import "../../layouts/Layout/Rslick/Rslick.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import AddIcon from "@mui/icons-material/Add";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/store";
import { getCarfileByIdAsyncApi } from "../../redux/CarFileReducer/CarFileReducer";
import { useParams, Link } from "react-router-dom";

import {
  CarExpense,
  carAction,
  getCarByIdAsyncApi,
  getCarExpenseReducerByIdAsyncApi,
  getcarmaintenanceinfoByIdAsyncApi,
  putCarAsyncApi,
} from "../../redux/CarReducer/CarReducer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import QrCodeIcon from "@mui/icons-material/QrCode";

import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
// import interactionPlugin from "@fullcalendar/interaction";
import "../../layouts/Layout/Rslick/Rslick.css";

import dayjs, { Dayjs } from "dayjs";
import { Car } from "../../models/Car";
import { UpdateModal } from "./Modal/UpdateModal";
import { AlertComponent } from "../../Components/AlertComponent";
import { QRcodeModal } from "./Modal/QRcodeModal";
import { Tooltip, Card, Box, Tabs, Tab } from "@mui/material";
import { ModalpostcarExpense } from "./Modal/ModalpostcarExpense";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
type Column = {
  id: "dateStart" | "dateEnd" | "carStatusName";
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
};

const columns: readonly Column[] = [
  // { id: 'carLicensePlates', label: 'biển số xe', minWidth: 100 },

  {
    id: "dateStart",
    label: "Ngày bắt đầu",
    minWidth: 100,
    align: "left",
  },
  {
    id: "dateEnd",
    label: "Ngày kết thúc",
    minWidth: 100,
    align: "left",
  },
  {
    id: "carStatusName",
    label: "Tình trạng xe",
    minWidth: 100,
    align: "left",
  },
];

function createData(data: Car) {
  const carSchedules = data.carSchedules ?? [];
  const result = [];

  for (const schedule of carSchedules) {
    const { dateStart, dateEnd, carStatusName } = schedule;
    const formattedStartDate = new Date(dateStart).toLocaleDateString();
    const formattedEndDate = new Date(dateEnd).toLocaleDateString();
    result.push({
      dateStart: formattedStartDate,
      dateEnd: formattedEndDate,
      carStatusName,
    });
  }

  return result;
}

function formatToVND(value: any) {
  if (typeof value === "number" && !isNaN(value)) {
    const parts = value.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";
    return integerPart + decimalPart + " VND";
  } else {
    return "";
  }
}

function formatToKM(value: any) {
  if (typeof value === "number" && !isNaN(value)) {
    const parts = value.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";
    return integerPart + decimalPart + " km";
  } else {
    return "";
  }
}


interface Column1 {
  id:
  | "stt"
  | "title"
  | "day"
  | "amount"

  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: number) => string;
}
const column1: readonly Column1[] = [
  {
    id: "stt",
    label: "Stt",
    minWidth: 50,
    align: "left",
  },
  { id: "title", label: "Nội dung", minWidth: 150 },
  { id: "day", label: "Ngày", minWidth: 150 },
  {
    id: "amount",
    label: "Số tiền",
    minWidth: 100,
    align: "left",
  },


];
function createData1(data: CarExpense[]) {
  const result = [];

  for (const item of data) {
    const { title, day, amount } = item;

    const formattedStartDate = day
      ? dayjs(day).toDate().toLocaleDateString()
      : "";
    result.push({
      stt: result.length + 1,
      title,
      day: formattedStartDate,
      amount: formatToVND(amount),

    });
  }

  return result;
}


export default function CarDetail() {
  let callbackFunctionAlert1 = (childData: any) => {
    setAlert(childData);
  };
  var settings = {
    // centerMode: true,
    infinite: false,
    centerPadding: "10px",
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 916,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const dispatch: DispatchType = useDispatch();
  const [qrCodeData, setQrCodeData] = useState("");
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const {
    alertAction,
    CarResultDetail,
    message,
    showPopup,
    loading,
    CarExpenseDetail,
  } = useSelector((state: RootState) => state.CarResult); //r

  const [open1, setOpen1] = useState(false);
  const today = dayjs();
  let callbackFunctionPopup1 = (childData: any) => {
    setOpen(childData);
    setOpenQR(childData);
  };

  let callbackFunctionPopup2 = (childData: any) => {
    setOpen1(childData);
  };
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [alert1, setAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [userDad, setUserDad] = useState({});
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
    setMessageAlert(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  const rows = CarResultDetail ? createData(CarResultDetail) : null;
  const row1s = Array.isArray(CarExpenseDetail) ? createData1(CarExpenseDetail) : null;


  const param = useParams();
  const decodedId = param.id ? atob(param.id) : "";
  const getProductById = () => {
    // const id: string | undefined = param.id;
  
    const actionAsync = getCarByIdAsyncApi(decodedId);
    dispatch(actionAsync);
  };

  const getCarExpensebyid = () => {
    // const id: string | undefined = param.id;
    const decodedId = param.id ? atob(param.id) : "";
    const actionAsync = getCarExpenseReducerByIdAsyncApi(decodedId);
    dispatch(actionAsync);
  }


  const handleChange3 = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    getCarExpensebyid()
    getProductById();
    if (message != null) {
      setMessageAlert(message);
    }
    if (alertAction != "") {
      setAlert(alertAction);
    }
    if (showPopup == false) {
      setOpen(false);
    }
    if (showPopup == false) {
      setOpen1(false);
    }
  }, [alertAction]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
  };
  const [showTable, setShowTable] = useState(false);
  const toggleTable = () => setShowTable(!showTable);
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = useCallback(() => {
    setShowCalendar((prevState) => !prevState);
  }, []);
  const events =
    CarResultDetail && CarResultDetail.carSchedules
      ? CarResultDetail.carSchedules.map((schedule: any) => {
        let color = "";
        switch (schedule.carStatusId) {
          case 1:
            color = "green";
            break;
          case 2:
            color = "orange";
            break;
          case 3:
            color = "red";
            break;
          case 4:
            color = "black";
            break;
          case 5:
            color = "pink";
            break;
          case 6:
            color = "Teal";
            break;

          case 7:
            color = "Lime	";
            break;
          case 8:
            color = "Maroon	";
            break;
          case 9:
            color = "Silver	";
            break;
          default:
            color = "blue";
            break;
        }
        return {
          title: CarResultDetail?.carLicensePlates,
          start: new Date(schedule.dateStart),
          end: new Date(schedule.dateEnd),
          color: color,
        };
      })
      : [];
  const [carId, setCarId] = useState<number | null>(null);
  const handleClickOpenUpdate = (car: object) => {
    setOpen(true);
    setUserDad(car);
    dispatch(carAction.showPopup());

    //frmUser.setValues(user);
  };
  const encodedId = btoa(String(CarResultDetail?.id));
  const handleClickOpenadd = (carId: number | null) => {
    setOpen1(true);
    dispatch(carAction.showPopup());
  };
  const handleGenerateQrCode = () => {
    const dataCarid = {
      carId: CarResultDetail.id,
      parkingLot: CarResultDetail.parkingLotId,
    };
    const qrCodeString = JSON.stringify(dataCarid);
    setQrCodeData(qrCodeString);
    setOpenQR(true);
  };
 
  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  return (
    <div className=" mt-2">
      <div className="flex justify-between ">
        <div>
          {userProfile.role === "OperatorStaff" ? (

            <div className="mt-4 ml-6">
              <Breadcrumbs className='mx-4' aria-label="breadcrumb">
                <NavLink to="/Operator/CarActiveManagement" className="hover:underline">
                  Tổng quát
                </NavLink>
                <Typography className="text-sm" color="text.primary">
                  Chi tiết Theo xe
                </Typography>
              </Breadcrumbs>
            </div>

          ) : (

            <div className="mt-10 ml-6">

              <Breadcrumbs className='mx-4 ' aria-label="breadcrumb">
                <NavLink to="/Admin/CarManagement" className="hover:underline">
                  Tất cả xe
                </NavLink>
                <Typography className="text-sm" color="text.primary">
                  Chi tiết Theo xe
                </Typography>
              </Breadcrumbs>
            </div>

          )}
        </div>


        <div className="flex">
          <button
            className="mt-5 flex justify-end mx-12bs m-4 hover:text-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 shadow-md shadow-gray-400 border text-gray-600 border-gray-400 py-2 px-4"
            onClick={() => handleClickOpenadd(CarResultDetail?.id)}
          >
            <AddIcon className="mx-2 -ml-1" />
            Thêm chi phí
          </button>
          <button
            className="mt-5 flex justify-end mx-12bs m-4 hover:text-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 shadow-md shadow-gray-400 border text-gray-600 border-gray-400 py-2 px-4"
            onClick={() => handleClickOpenUpdate(CarResultDetail)}
          >
            <EditOutlinedIcon className="mx-2 -ml-1" />
            Chỉnh sửa
          </button>
          <button
            onClick={handleGenerateQrCode}
            className="  mt-5 flex justify-end mx-12bs m-4 hover:text-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 shadow-md shadow-gray-400 border text-gray-600 border-gray-400 py-2 px-4"
          >
            <QrCodeIcon className="mx-2 -ml-1" /> Mã QR
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 relative xl:grid-cols-5  mx-5 ">
        <div className="col-span-5 xl:col-span-2   xl:grid-rows-5 xl:h-300 ">
          <div className=" relative shadow-md bg-white shadow-gray-400 rounded-lg border border-gray-300">
            <img
              className="mt-2 lg:w-[2000px] h-[400px]"
              src={
                selectedImage == null
                  ? CarResultDetail?.frontImg ? CarResultDetail?.frontImg : "https://i.imgur.com/YIcWBqg.jpeg"
                  : selectedImage
              }
              alt="img"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            />
            <Slider
              {...settings}
              className="flex items-center justify-center text-center "
            >
              <div
                className="px-5"
                onClick={() => handleImageClick(CarResultDetail?.backImg)}
              >
                <img
                  src={CarResultDetail?.backImg ? CarResultDetail?.backImg : "https://i.imgur.com/YIcWBqg.jpeg"}
                  alt="img"
                  className=" w-[350px] h-[150px] object-cover   "
                />
              </div>
              <div
                className="px-5"
                onClick={() => handleImageClick(CarResultDetail?.frontImg)}
              >
                <img
                  src={CarResultDetail?.frontImg ? CarResultDetail?.frontImg : "https://i.imgur.com/YIcWBqg.jpeg"}
                  alt="img"
                  className="  w-[350px] h-[150px] object-cover "
                />
              </div>
              <div
                className="px-5"
                onClick={() => handleImageClick(CarResultDetail?.leftImg)}
              >
                <img
                  src={CarResultDetail?.leftImg ? CarResultDetail?.leftImg : "https://i.imgur.com/YIcWBqg.jpeg"}
                  alt="img"
                  className=" w-[350px] h-[150px] object-cover   "
                />
              </div>
              <div
                className="px-5"
                onClick={() => handleImageClick(CarResultDetail?.rightImg)}
              >
                <img
                  src={CarResultDetail?.rightImg ? CarResultDetail?.rightImg : "https://i.imgur.com/YIcWBqg.jpeg"}
                  alt="img"
                  className="w-[350px] h-[150px] object-cover  "
                />
              </div>
            </Slider>
          </div>

          <div className="col-span-2 xl:col-span-5 relative md:row-span-3 bg-white py-0 md:py-xl:py-0   ">
            <div>
              <h1 className="font-bold text-[#2c2c2c] text-2xl mt-4 "> THÔNG TIN XE</h1>
            </div>
            <div className="grid lg:grid-cols-2">
              <div className="mt-2 ">
                <div className="flex ">
                  <h3 className="font-bold text-[#2c2c2c]">
                    {" "}
                    <ArticleOutlinedIcon className="-mt-1 " /> Tên Xe:
                  </h3>
                  <p className="text-left mx-1  ">
                    {CarResultDetail?.modelName}
                  </p>
                </div>

                <div className="flex mt-2 ">
                  <h3 className="font-bold text-[#2c2c2c]">
                    {" "}
                    <CalendarTodayOutlinedIcon className="-mt-1 " /> Đời xe:
                  </h3>
                  <p className="text-left mx-1 ">
                    {" "}
                    {CarResultDetail?.generationYearBegin}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex mt-2">
                    <h3 className="font-bold text-[#2c2c2c] ">
                      {" "}
                      <FlagOutlinedIcon className="-mt-1 " />
                      Động cơ:
                    </h3>
                    <p className=" text-right mx-1">
                      {CarResultDetail?.trimName}{" "}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex mt-2">
                      <h3 className="font-bold text-[#2c2c2c] ">
                        {" "}
                        <BatteryChargingFullIcon className="-mt-1 " />
                        Nhiên liệu :
                      </h3>
                      <p className=" text-right mx-1">
                        {CarResultDetail?.carFuel}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex ">
                  <h3 className="font-bold text-[#2c2c2c]">
                    {" "}
                    <DirectionsCarFilledOutlinedIcon className="-mt-1 " /> Hãng
                    xe:
                  </h3>
                  <p className="text-right mx-1">
                    {" "}
                    {CarResultDetail?.makeName}
                  </p>
                </div>

                <div className="flex mt-2  ">
                  <h3 className="font-bold text-[#2c2c2c]">
                    {" "}
                    <FlightClassOutlinedIcon className="-mt-1  " />
                    Số chỗ ngồi:
                  </h3>
                  <p className="text-right mx-1">
                    {CarResultDetail?.seatNumber}{" "}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex mt-2  ">
                    <h3 className="font-bold text-[#2c2c2c]">
                      {" "}
                      <ColorLensOutlinedIcon className="-mt-1 " /> Màu sắc:
                    </h3>
                    <p className="text-right  mx-1">
                      {CarResultDetail?.carColor}{" "}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex mt-2 ">
                      <h3 className="font-bold text-[#2c2c2c]">
                        {" "}
                        <LocalParkingIcon className="-mt-1 " /> Bãi đỗ xe:
                      </h3>
                      <p className="text-right  mx-1">
                        {CarResultDetail?.parkingLotName}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  mt-4 py-2 ">
              <h3 className="font-bold text-[#2c2c2c]"> Biển kiểm soát: </h3>
              <p className="bs bg-white  border-[1px] border-[#050709] text-center w-40 mx-4 ">
                {CarResultDetail?.carLicensePlates }{" "}
              </p>
            </div>

            <div className="flex   ">
              {" "}
              <h3 className="font-bold text-[#2c2c2c] ">Mô tả:</h3>
              <p className=" mx-2 ">{CarResultDetail?.carDescription}</p>
            </div>
          </div>
        </div>
        <div className=" col-span-2 xl:col-span-3 relative md:row-span-3 bg-white py-0 md:py-xl:py-0  ">
          <div className="mt-6 mx-4">
            <h2 className="mx-1 mt-4 font-bold text-[#2c2c2c]  text-2xl ">
              {" "}
              <span className="flex items-center">THÔNG TIN THUÊ XE</span>
            </h2>
            <div className="grid lg:grid-cols-2">
              <div className="mt-2">
                <div className="flex  mx-1 py-1 ">
                  <h3 className="font-bold text-[#2c2c2c] "> GIá cho ngày bình thường:</h3>
                  <p className="text-left mx-1 ">
                    {" "}
                    {formatToVND(CarResultDetail?.priceForNormalDay)}{" "}
                  </p>
                </div>

                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Giới hạn số km trong tháng:</h3>
                  <p className="text-left mx-1">
                    {formatToKM(CarResultDetail?.limitedKmForMonth)}{" "}
                  </p>
                </div>
                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Phí vượt km trong tháng:</h3>
                  <p className="text-left mx-1">
                    {formatToVND(CarResultDetail?.overLimitedMileage)}/km
                  </p>
                </div>

                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]">Hạn cuối đăng kiểm:</h3>
                  <p className="text-left mx-1">
                    {CarResultDetail &&
                      dayjs(CarResultDetail.registrationDeadline).format(
                        "DD/MM/YYYY"
                      )}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Giá cho ngày cuối tuần:</h3>
                  <p className="text-right mx-1">
                    {" "}
                    {formatToVND(CarResultDetail?.priceForWeekendDay)}{" "}
                  </p>
                </div>

                <div className="flex mx-1 py-1 ">
                  <h3 className="font-bold text-[#2c2c2c]  "> Giá cho thuê tháng :</h3>
                  <p className="text-right mx-1">
                    {" "}
                    {formatToVND(CarResultDetail?.priceForMonth)}{" "}
                  </p>
                </div>

                <div className="flex mx-1 py-1 ">
                  <h3 className="font-bold text-[#2c2c2c]  "> Tỉ lệ ăn chia :</h3>
                  <p className="text-right mx-1">
                    {" "}
                    {CarResultDetail?.ownerSlitRatio} %
                  </p>
                </div>
              </div>
            </div>
            <hr className="mt-6 border-black" />
            <h2 className="mx-1 mt-4 font-bold text-[#2c2c2c] text-2xl">
              <span className="flex items-center">HIỆN TRẠNG XE</span>
            </h2>
            <div className="grid lg:grid-cols-2">
              <div className="mt-2">
                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c] "> Số đồng hồ lần cuối cập nhật:</h3>
                  <p className="text-left mx-1  ">
                    {formatToKM(CarResultDetail?.speedometerNumber)}
                  </p>
                </div>

                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Mức nhiên liệu hiện tại: </h3>
                  <p className="text-left mx-1">
                    {CarResultDetail?.fuelPercent}%{" "}
                  </p>
                </div>

              </div>
              <div className="mt-2">
                <div className="flex mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Phí cao tốc ETC hiện tại: </h3>
                  <p className="text-right mx-1">
                    {" "}
                    {formatToVND(CarResultDetail?.currentEtcAmount)}{" "}
                  </p>
                </div>
                <div className="flex mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Trạng thái: </h3>
                  <p className="text-right mx-1">
                    {" "}
                    {CarResultDetail?.carStatus}{" "}
                  </p>
                </div>

              </div>
            </div>

            <hr className="mt-6 border-black" />
            <div className="flex justify-between">
              <h2 className="mx-1 mt-4 font-bold text-gray-700 text-2xl items-center">
                <span className="flex items-center">THÔNG TIN BẢO DƯỠNG</span>
              </h2>
              <Tooltip title="Chi tiết bảo dưỡng">
                    
                <Link
                  to={`/Admin/CarMaintenanceInfo/CarMaintenanceInfoDetail/${encodedId}`}
                  className="flex items-center"
                >
                  <ArrowForwardIosIcon className="mt-4 mx-2" />
                </Link>
              </Tooltip>
            </div>



            <div className="grid lg:grid-cols-2">
              <div className="mt-2">
                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c] ">
                    {" "}
                    Số km bảo dưỡng lần cuối cùng:
                  </h3>
                  <p className="text-left mx-1 ">
                    {" "}
                    {formatToKM(CarResultDetail?.carKmLastMaintenance)}{" "}
                  </p>
                </div>



              </div>
              <div className="mt-2">
                <div className="flex mx-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Số km đã đi:</h3>
                  <p className="text-right mx-1">
                    {formatToKM(CarResultDetail?.kmTraveled)}
                  </p>
                </div>


              </div>
            </div>
            <hr className="mt-6 border-black" />

            <h2 className="mx-1 mt-4 font-bold text-[#2c2c2c] text-2xl">
              <span className="flex items-center">THÔNG TIN CHỦ XE</span>
            </h2>
            <div className="grid lg:grid-cols-2">
              <div className="mt-2">
                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c] "> Tên:</h3>
                  <p className="text-left mx-1 ">
                    {CarResultDetail?.carOwnerName}
                  </p>
                </div>

                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Phương thức cho thuê:</h3>
                  <p className="text-left mx-1">
                    {CarResultDetail?.rentalMethod}
                  </p>
                </div>
                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c]  "> Đồng hồ tốc độ khi nhận:</h3>
                  <p className="text-left mx-1">
                    {formatToKM(CarResultDetail?.speedometerNumberReceive)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c] "> Giới hạn số km trong tháng: </h3>
                  <p className="text-right mx-1">
                    {formatToKM(CarResultDetail?.limitedKmForMonthReceive)}{" "}
                  </p>
                </div>

                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c] "> Phí vượt km trong tháng:</h3>
                  <p className="text-right mx-1 ">
                    {formatToVND(CarResultDetail?.overLimitedMileageReceive)}/km
                  </p>
                </div>
                <div className="flex  mx-1 py-1">
                  <h3 className="font-bold text-[#2c2c2c] ">Định mức bảo trì:</h3>
                  <p className="text-right mx-1 ">
                    {formatToKM(CarResultDetail?.periodicMaintenanceLimit)}
                  </p>
                </div>
              </div>
            </div>

            <hr className="mt-6 border-black" />

            <div>
              <h2 className="m-2 mx-2 mt-4 font-bold text-[#2c2c2c] text-2xl">
                THÔNG TIN  CỦA XE
                {/* <DashboardOutlinedIcon
                  onClick={toggleCalendar}
                  className="mt-2 float-right text-2xl"
                /> */}
              </h2>
            </div>
            <Box sx={{ width: '100%' }}>
              <Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  component="div"
                  value={value}
                  onChange={handleChange3}
                  aria-label="basic tabs example"
                >
                  <Tab label="Chi phí của xe " {...a11yProps(1)} />
                  <Tab label="Thông tin hoạt động" {...a11yProps(2)} />
                </Tabs>
              </Box>
              {/* <TabPanel value={value} index={0}>
    {showCalendar ? (
      <div className="w-full h-[470px] ">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          events={events}
        />
      </div>
    ) : null}
  </TabPanel> */}
              <TabPanel value={value} index={0}>
                <div className="mx-5 mb-5">
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {column1.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row1s
                            ? row1s.map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  {column1.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {value}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })
                            : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="mx-5 mb-5">
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows
                            ? rows.map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {value}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })
                            : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>

              </TabPanel>
            </Box>
          </div>
        </div>
      </div>

      <UpdateModal
        openDad={open}
        parentCallback={callbackFunctionPopup1}
        userDad={userDad}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
      />
      <QRcodeModal
        openDad={openQR}
        parentCallback={callbackFunctionPopup1}
        userDad={qrCodeData}
      />
      <AlertComponent
        message={messageAlert}
        alert={alert1}
        parentCallback={callbackFunctionAlert1}

      />
      <ModalpostcarExpense
        openDad={open1}
        parentCallback={callbackFunctionPopup2}
        carId={decodedId}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}

      />
    </div>
  );
}
