import AddIcon from "@mui/icons-material/Add";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PublicOffOutlinedIcon from "@mui/icons-material/PublicOffOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "../../layouts/Layout/Paginaton";
// import { getcarFileAsyncApi } from '../../redux/CarFileReducer/CarFileReducer';
import TimeToLeaveOutlinedIcon from "@mui/icons-material/TimeToLeaveOutlined";
import {
  carAction,
  deleteCarAsyncApi,
  getcarAsyncApi,
  postCarExcelAsyncApi
} from "../../redux/CarReducer/CarReducer";
import { DispatchType, RootState } from "../../redux/store";
// import { UpdateModal } from './Modal/UpdateModal';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MenuItem, Select, Tooltip } from "@mui/material";
import * as XLSX from "xlsx";
import { AlertComponent } from "../../Components/AlertComponent";
import { useAppSelector } from "../../hooks";
import { getcarMakeAsyncApi } from "../../redux/CarMakeReducer/CarMakeReducer";
import { getcarStatusAsyncApi } from "../../redux/CarStatus/CarStatusReducer";
import { getParkingLotcarAsyncApi } from "../../redux/ParkingLotReducer/ParkingLotReducer";
import { Modal } from "./Modal/Modal";

import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { ModalStatus } from "./Modal/ModalStatus";
import { Car } from "../../models/Car";
interface Column {
  id:
  | "stt"
  | "modelName"
  | "parkingLotName"
  | "carColor"
  | "seatNumber"
  | "carFuel"
  | "carLicensePlates"
  | "status"
  | "availability"
  | "edit";
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: number) => string;
}



const columns: readonly Column[] = [
  {
    id: "stt",
    label: "Stt",
    minWidth: 50,
    align: "center",
  },
  { id: "modelName", label: "Tên xe", minWidth: 100, },
  { id: "parkingLotName", label: "Bãi xe", minWidth: 100, align: "center", },
  { id: "carColor", label: "Màu xe", minWidth: 100 },
  {
    id: "seatNumber",
    label: "Số chỗ ngồi",
    minWidth: 150,
    align: "left",
  },

  {
    id: "carFuel",
    label: "Nhiên liệu",
    minWidth: 150,
    align: "left",
  },
  {
    id: "carLicensePlates",
    label: " Biển kiểm soát",
    minWidth: 150,
    align: "left",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 200,
    align: "center",
  },
  { id: "availability", label: "Khả dụng", minWidth: 100, align: "center", },
  { id: "edit", label: "Chi tiết", minWidth: 100, align: "center", },
];


export default function CarList() {
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionPopup1 = (childData: any) => {
    setOpen2(childData);
  };
  const carColor = ["Đỏ", "Xanh", "Tím", "Vàng", "trắng", "xám", "xanh lá"];
  const CarTrimId = ["AT", "MT"];

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
  });
  let callbackFunctionPagination = (childData: any) => {
    if (isconvert == false) {
      setPagination({
        page: childData,
        pageSize: 12,
      });
    } else if (isconvert == true) {
      setPagination({
        page: childData,
        pageSize: 10,
      });
    }
  };
  const dispatch: DispatchType = useDispatch();
  const { alertAction, error, message, CarResult, showPopup, loading } =
    useSelector((state: RootState) => state.CarResult); //r
  const { carStatus } = useAppSelector((state: RootState) => state.carStatus);
  const { ParkingLot } = useSelector((state: RootState) => state.ParkingLot);
  const [userDad, setUserDad] = useState({});
  //tên xe
  const [isconvert, setIsconvert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [alert, setAlert] = useState("");
  const getAllparkinglotdetail = () => {
    // const id: string | undefined = param.id
    const actionAsync = getParkingLotcarAsyncApi();
    dispatch(actionAsync);
  };
  const [messageAlert, setMessageAlert] = useState("");
  const handleClickOpenAdd = () => {
    setOpen(true);
    dispatch(carAction.showPopup());
  };
  const [id, setid] = useState<number | null>(null);
  const handleClickOpenUpdate = (car: object, id: number) => {
    setOpen2(true);
    setUserDad(car);
    setid(id)
    if (id != null) {
      setid(id)
    }
  };

  let firstCharacter: string = "";
  const [searchTerm, setSearchTerm] = useState("");

  //  const [dataUpdate, setDataUpdate]=useState({})
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };

  const getAllCarStatus = () => {
    const actionAsync = getcarStatusAsyncApi();
    dispatch(actionAsync);
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState({
    carStatusId: 0,
    carMakeName: "",
    seatNumber: 0,
    carColor: "",
    CarModelId: 0,
    parkingLotId: 0,
  });
  const handleFilter = () => {
    dispatch(
      getcarAsyncApi({
        page: 1,
        pageSize: pagination.pageSize,
        ...filter,
      })
    );

    setOpenFilter(false);
    setOpen1(false);
  };
  const resetFilter = () => {
    setFilter({
      carStatusId: 0,
      carMakeName: "",
      seatNumber: 0,
      carColor: "",
      CarModelId: 0,
      parkingLotId: 0,
    });
  };
  const getAllcar = () => {
    const actionAsync = getcarAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      carLicensePlates: searchTerm,
      ...filter,
    });
    dispatch(actionAsync);
  };
  const { carMake } = useSelector((state: RootState) => state.carMake);
  const getAllcarMake = () => {
    const actionAsync = getcarMakeAsyncApi();
    dispatch(actionAsync);
  };
  useEffect(() => {
    getAllcar();

    getAllcarMake();
    getAllparkinglotdetail();
    getAllCarStatus();
    if (showPopup == false) {
      setOpen(false);
    }
    if (showPopup == false) {
      setOpen2(false);
    }
    if (alertAction != "") {
      setAlert(alertAction);
    }
    if (message != null) {
      setMessageAlert(message);
    }
  }, [alertAction, pagination]);

  const handleClickOpenDelete = (id: number) => {
    const actionAsyncLogin = deleteCarAsyncApi(id);
    dispatch(actionAsyncLogin);

  };


  const handleClickOpenDelete1 = (ids: number[]) => {
    ids.forEach((id) => {
      const actionAsyncLogin = deleteCarAsyncApi(id);
      dispatch(actionAsyncLogin);
    });
  };
  const handleClickChangeConvert = () => {
    setIsconvert(!isconvert);
    if (!isconvert === false) {
      setPagination({
        page: 1,
        pageSize: 12,
      });
    } else {
      setPagination({
        page: 1,
        pageSize: 10,
      });
    }
  };
  const [open1, setOpen1] = useState(false);

  const handleClickOpen = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };


  const seatnumber = [4, 5, 7];

  const [showCarStatus, setShowCarStatus] = useState<number[]>([]);

  const toggleShow = (id: number) => {
    setShowCarStatus((prevState) => {
      const index = prevState.indexOf(id);
      if (index === -1) {
        return [...prevState, id];
      } else {
        return prevState.filter((item) => item !== id);
      }
    });
  };
  const [excelData, setExcelData] = useState([]);
  const errorDataExcel: any = [];
  const handleClickExport = (event: any) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setAlert("error");
      setMessageAlert("Chỉ nhận file Excel thôi");
      return;
    } else {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          //đọc data
          const bufferArray = e.target!.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[1];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          const lastData = data.splice(0, 2);
          data.forEach((item: any) => {
            item.__EMPTY_15 = XLSX.SSF.format(
              "yyyy-mm-dd hh:mm:ss",
              item.__EMPTY_15
            );
            item.__EMPTY_42 = XLSX.SSF.format(
              "yyyy-mm-dd hh:mm:ss",
              item.__EMPTY_42
            );

            setExcelData(lastData as never[]);
          });
          resolve(data);


        };
        fileReader.onerror = (errors) => {
          reject(errors);
        };
      });

      promise.then((data: any) => {

        const newData = data.map((x: any) => {
          return {
            carLicensePlates: x.__EMPTY_1,
            carMakeName: x.__EMPTY_2,
            carModelName: x.__EMPTY_3, // add id join bảng khác
            carGenerationName: x.__EMPTY_4, // add id join bảng khác
            modelYear: x.__EMPTY_5, // add id join bảng khác
            carTrimName: x.__EMPTY_6, // add id join bảng khác
            carSeriesName: x.__EMPTY_7,
            seatNumber: x.__EMPTY_8,
            carColor: x.__EMPTY_9,
            carFuel: x.__EMPTY_10,
            parkingLotName: x.__EMPTY_11, // add id join bảng khác
            carOwnerName: x.__EMPTY_13,
            rentalMethod: x.__EMPTY_14,
            rentalDate: new Date(x.__EMPTY_15).toISOString(),
            speedometerNumberReceive: x.__EMPTY_16,
            ownerSlitRatio: x.__EMPTY_17 != null ? parseInt(x.__EMPTY_17, 10) : x.__EMPTY_17,
            priceForDayReceive: x.__EMPTY_17 != null ? parseInt(x.__EMPTY_17, 10) : x.__EMPTY_17,
            priceForMonthReceive: x.__EMPTY_18,
            insurance: true,
            maintenance: true,
            limitedKmForMonthReceive: x.__EMPTY_21,
            overLimitedMileageReceive: x.__EMPTY_22,
            priceForNormalDay: x.__EMPTY_24,
            priceForWeekendDay: x.__EMPTY_25,
            priceForMonth: x.__EMPTY_26,
            limitedKmForMonth: x.__EMPTY_27,
            overLimitedMileage: x.__EMPTY_28,
            linkTracking: "http://dinhvi.vn",
            trackingUsername: x.__EMPTY_31.split("/")[0],
            trackingPassword: x.__EMPTY_31.split("/")[1],
            etcusername: x.__EMPTY_32.split("/")[0],
            etcpassword: x.__EMPTY_31.split("/")[1],
            paymentMethod: x.__EMPTY_34,
            carDescription: "",
            createdDate: new Date(),
            isDeleted: false,
            periodicMaintenanceLimit: x.__EMPTY_39,
            carStatusDescription: "",
            currentEtcAmount: x.__EMPTY_40,
            fuelPercent: 100,
            speedometerNumber: x.__EMPTY_16,
            carKmLastMaintenance: x.__EMPTY_41,
            registrationDeadline: new Date(x.__EMPTY_42).toISOString(),
            tankCapacity: x.__EMPTY_43,
          };
        });
        for (let item of newData) {
          dispatch(postCarExcelAsyncApi(item)).then((response: any) => {
            let successCount = 0;
            if (response.payload != undefined) {
              getAllcar();
              setAlert("success");
              setMessageAlert(`Tạo thành công xe`);
              successCount++;
              if (successCount + errorDataExcel.length === newData.length) {
                // Nếu đã xử lý hết tất cả các item thì xuất Excel
                const newDataError = errorDataExcel.length > 0 ? errorDataExcel.map((x: Car) => {
                  return {
                    "Biển số xe": x.carLicensePlates,
                    "Hãng xe": x.carMakeName,
                    "Tên xe": x.carModelName, // add id join bảng khác
                    "Phiên bản xe": x.carGenerationName, // add id join bảng khác
                    "Năm sản xuất": x.modelYear, // add id join bảng khác
                    "Truyền động": x.carTrimName, // add id join bảng khác
                    "Kiểu dáng": x.carSeriesName,
                    "Số ghế": x.seatNumber,
                    "Màu xe": x.carColor,
                    "Nhiên liệu": x.carFuel,
                    "Bãi xe": x.parkingLotName, // add id join bảng khác
                    "Chủ xe": x.carOwnerName,
                    "Hình thức thuê": x.rentalMethod,
                    "Ngày thuê": x.rentalDate,
                    "Số km lúc nhận": x.speedometerNumberReceive,
                    "Giá ngày": x.priceForMonthReceive,
                    "Bảo hiểm": x.insurance,
                    "Bảo dưỡng": true,
                    "Giới hạn của chủ xe (km/tháng)": x.limitedKmForMonthReceive,
                    "Phí vượt km của chủ xe (vnđ/km)": x.overLimitedMileageReceive,
                    "Giá ngày thường": x.priceForNormalDay,
                    "Giá cuối tuần": x.priceForWeekendDay,
                    "Giá thuê tháng": x.priceForMonth,
                    "Giới hạn (km/tháng)": x.limitedKmForMonth,
                    "Phí vượt km(vnđ/km)": x.overLimitedMileage,
                    "Link tài khoản": x.linkTracking,
                    "Acc/Pass: ": x.trackingUsername + "/" + x.trackingPassword,
                    "ETC": x.etcusername + "/" + x.etcpassword,
                    "Phương thức thanh toán": x.paymentMethod,
                    "Mô tả xe": x.carDescription,
                    "Định mức bảo trì": x.periodicMaintenanceLimit,
                    "Mô tả tình trạng xe": x.carStatusDescription,
                    "Số tiền ETC": x.currentEtcAmount,
                    "Số Km bảo trì lần cuối": x.carKmLastMaintenance,
                    "Hạn cuối đăng kiểm": x.registrationDeadline,
                    "Thể tích xăng": x.tankCapacity,
                  };
                }) : undefined;
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(newDataError);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace('.xlsx', '_error.xlsx');
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }, 0);
              }
            
            } else {
              const isErrorItem = data.find((x: any) => x.__EMPTY_1 === item.carLicensePlates);
              errorDataExcel.push(item);
              if (successCount + errorDataExcel.length === newData.length) {
                // Nếu đã xử lý hết tất cả các item thì xuất Excel
                const newDataError = errorDataExcel.length > 0 ? errorDataExcel.map((x: Car) => {
                  return {
                    "Biển số xe": x.carLicensePlates,
                    "Hãng xe": x.carMakeName,
                    "Tên xe": x.carModelName, // add id join bảng khác
                    "Phiên bản xe": x.carGenerationName, // add id join bảng khác
                    "Năm sản xuất": x.modelYear, // add id join bảng khác
                    "Truyền động": x.carTrimName, // add id join bảng khác
                    "Kiểu dáng": x.carSeriesName,
                    "Số ghế": x.seatNumber,
                    "Màu xe": x.carColor,
                    "Nhiên liệu": x.carFuel,
                    "Bãi xe": x.parkingLotName, // add id join bảng khác
                    "Chủ xe": x.carOwnerName,
                    "Hình thức thuê": x.rentalMethod,
                    "Ngày thuê": x.rentalDate,
                    "Số km lúc nhận": x.speedometerNumberReceive,
                    "Giá ngày": x.priceForMonthReceive,
                    "Bảo hiểm": x.insurance,
                    "Bảo dưỡng": true,
                    "Giới hạn của chủ xe (km/tháng)": x.limitedKmForMonthReceive,
                    "Phí vượt km của chủ xe (vnđ/km)": x.overLimitedMileageReceive,
                    "Giá ngày thường": x.priceForNormalDay,
                    "Giá cuối tuần": x.priceForWeekendDay,
                    "Giá thuê tháng": x.priceForMonth,
                    "Giới hạn (km/tháng)": x.limitedKmForMonth,
                    "Phí vượt km(vnđ/km)": x.overLimitedMileage,
                    "Link tài khoản": x.linkTracking,
                    "Acc/Pass: ": x.trackingUsername + "/" + x.trackingPassword,
                    "ETC": x.etcusername + "/" + x.etcpassword,
                    "Phương thức thanh toán": x.paymentMethod,
                    "Mô tả xe": x.carDescription,
                    "Định mức bảo trì": x.periodicMaintenanceLimit,
                    "Mô tả tình trạng xe": x.carStatusDescription,
                    "Số tiền ETC": x.currentEtcAmount,
                    "Số Km bảo trì lần cuối": x.carKmLastMaintenance,
                    "Hạn cuối đăng kiểm": x.registrationDeadline,
                    "Thể tích xăng": x.tankCapacity,
                  };
                }) : undefined;
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(newDataError);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace('.xlsx', '_error.xlsx');
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }, 0);
              }
              successCount = 0;
            }
          })
        }

      });
    }
  };

  const exportTemplate = () => {
    const dataToExport = [...excelData];
    const sheet = XLSX.utils.json_to_sheet(dataToExport, {
      header: Object.keys(excelData[0]),
      cellStyles: true
    });

    sheet['A1'].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFFFAA00" } }
    };

    sheet['B2'].s = {
      font: { color: { rgb: "FF0000FF" } }
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    XLSX.writeFile(workbook, "NewExcel.xlsx");
  };

  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [page, setPage] = useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setPagination({ page: newPage + 1, pageSize: rowsPerPage });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const handleClickDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setOpen1(!open1);
    setAnchorEl1(event.currentTarget);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPagination({ page: 1, pageSize: +event.target.value });
    setPage(0);
  };
  const rows = CarResult.cars.map((data: any, index: number) => {
    return createData(data, index, page);
  });

  function createData(data: any, index: number, page: number) {
    const encodedId = btoa(data.id);
    let modelName = (
      <Tooltip title="Chi tiết Xe">
        <Link to={`/Admin/CarManagement/CarDetail/${encodedId}`}>
          <button className="flex gap-2  bg-gray-100 px-2 py-1 border-[1px] rounded-2xl">
            <TimeToLeaveOutlinedIcon className="h-6 w-6" />
            <p className="">{data.modelName}</p>
          </button>
        </Link>
      </Tooltip>
    );
    let parkingLotName = (
      <button className="mx-2flex gap-2 bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <p className="">{data.parkingLotName}</p>
      </button>
    );
    // let carColor = data.carColor;
    let carColor = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <ColorLensOutlinedIcon className="h-6 w-6" />
        <p className="">{data.carColor}</p>
      </button>
    );
    let seatNumber = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <FlightClassOutlinedIcon className="h-6 w-6 -mt-[2px]" />
        <p className="">{data.seatNumber}</p>
      </button>
    );
    //let carFuel = data.carFuel;
    let carFuel = (
      <button className="flex gap-2  bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <BatteryChargingFullIcon className="h-6 w-6 -mt-[2px]" />
        <p className="">{data.carFuel}</p>
      </button>
    );

    let id = data.id;
    let statusColor = '';
    switch (data.carStatus) {
      case 'Đang thẩm định':
        statusColor = 'bg-yellow-300';
        break;
      case 'Sẵn sàng để thuê':
        statusColor = 'bg-green-300';
        break;
      case 'Chưa sẵn sàng để thuê':
        statusColor = 'bg-red-300';
        break;
      case 'Đang được thuê':
        statusColor = 'bg-blue-400';
        break;
      case 'Đang bảo hiểm':
        statusColor = 'bg-purple-300';
        break;
      case 'Đang bảo dưỡng':
        statusColor = 'bg-pink-300';
        break;
      case 'Đang sửa':
        statusColor = 'bg-gray-300';
        break;
      case 'Chưa thẩm định':
        statusColor = 'bg-orange-300';
        break;
      case 'Tới hạn bảo dưỡng':
        statusColor = 'bg-teal-300';
        break;
      case 'Đã được đặt':
        statusColor = 'bg-indigo-300';
        break;
      case 'Tới hạn đăng kiểm':
        statusColor = 'bg-red-400';
        break;
    }

    // let status = data.carStatus;
    let status = (
      <button onClick={() => handleClickOpenUpdate(data, id)} className={` gap-2  px-4 py-1 border-[1px] rounded-md mx-auto w-[200px] ${statusColor}`}>
        <p className="">{data.carStatus}</p>

      </button>
    );

    const selected: number = 0;
    let availability = (
      <>
        <div >
          {data.isDeleted == false ? (
            <Tooltip title="Đang hoạt động">
              <IconButton>
                <PublicOutlinedIcon className="text-blue-400" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Tạm ngưng">
              <IconButton>
                <PublicOffOutlinedIcon className="text-red-400" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </>);
    let stt = page * rowsPerPage + (index + 1);
    //let carLicensePlates = data.carLicensePlates.slice(0, 3) + '-' +data.carLicensePlates.slice(3);
    let carLicensePlates = (
      <button className="flex gap-2 w-32  text-center  bg-gray-100 px-1  py-1 border-[1px] rounded-xl ">
        <PaymentOutlinedIcon className="h-6 w-6 -mt-[1px] mx-1" />
        <p className="text-center">
          {data.carLicensePlates.slice(0, 3) +
            "-" +
            data.carLicensePlates.slice(3)}
        </p>
      </button>
    );

    let edit = (
      <Tooltip title="Chi tiết Xe">
        <Link to={`/Admin/CarManagement/CarDetail/${encodedId}`}>
          <IconButton>

            <EditOutlinedIcon className="text-gray-400" />
          </IconButton>
        </Link>
      </Tooltip>
    );

    return {
      modelName,
      carColor,
      seatNumber,
      status,
      stt,
      edit,
      carFuel,
      carLicensePlates,
      availability,
      id,
      parkingLotName,
    };
  }
  interface EnhancedTableToolbarProps {
    numSelected: number;
    onClickDelete: () => void;
  }

  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onClickDelete } = props;
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => {
      setOpenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
    };
    const handleDelete = () => {
      onClickDelete();
      setOpenDeleteDialog(false);
      // close the dialog after deleting

    };
    return (
      <div>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Xe
            </Typography>
          )}
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={handleOpenDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton>

              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{"Delete Cars?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn chắc chắn muốn xóa xe này !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              thoát
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              xóa
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  const [selected, setSelected] = useState<number[]>([]);

  function handleClick(event: React.ChangeEvent<HTMLInputElement>, id: number) {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = [...selected.slice(1)];
    } else if (selectedIndex === selected.length - 1) {
      newSelected = [...selected.slice(0, -1)];
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  }
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClickChangeEdit = () => {
    setIsDelete(!isDelete)
    setSelected([])
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const [showCheckbox, setShowCheckbox] = useState(false);
  const handleShowCheckbox = () => {
    setShowCheckbox(!showCheckbox);
  }
  return (
    <div className="mt-5 mx-5 ">
      <div className="  xl:flex mb-5 w-full">
        <div className="flex mb-2">
          <FormControl className=" lg:w-auto w-full bg-white" variant="outlined">
            <InputLabel size="small">Tìm kiếm theo biển số xe</InputLabel>
            <OutlinedInput
              name="tìm kiếm theo biển số xe"
              id="outlined-adornment-password"
              label="tìm kiếm theo biển số xe"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={getAllcar}
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <SearchOutlinedIcon className="" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <div >
            <Tooltip title="Bộ lọc tìm kiếm" className="ml-auto md:ml-5 cursor-pointer rounded-full hover:bg-gray-100 p-2">
              <IconButton onClick={handleClickOpen}>
                <TuneOutlinedIcon className="text-gray-400 " />
              </IconButton>
            </Tooltip>
          </div>
          <Dialog
            open={open1}
            onClose={handleClose1}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">Bộ lọc tìm kiếm</DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-2 mx-2 gap-2 gap-x-5 ">
                <FormControl className="w-full mt-2">
                  <InputLabel size="small">Trạng thái</InputLabel>
                  <Select
                    size="small"
                    labelId="car-status-id-label"
                    id="car-1"
                    name="carStatusId"
                    label="Trạng thái"
                    value={filter.carStatusId == 0 ? "" : filter.carStatusId}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        carStatusId: parseInt(e.target.value.toString()),
                      })
                    }
                  >
                    {carStatus.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className="w-full mt-2">
                  <InputLabel size="small">Hãng xe</InputLabel>

                  <Select
                    size="small"
                    label={"Hãng xe"}
                    name="carMakeName"
                    onChange={(e) =>
                      setFilter({ ...filter, carMakeName: e.target.value })
                    }
                    value={filter.carMakeName}
                  >
                    {carMake.map((model) => (
                      <MenuItem key={model.id} value={model.name}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="w-full mt-2">
                  <InputLabel size="small">Số Ghế</InputLabel>
                  <Select
                    size="small"
                    label={"Số Ghế"}
                    name="seatNumber"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        seatNumber:
                          e.target.value != undefined
                            ? parseInt(e.target.value.toString())
                            : 0,
                      })
                    }
                    value={filter.seatNumber == 0 ? "" : filter.seatNumber}
                  >
                    {seatnumber?.map((model: any) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="w-full mt-2">
                  <InputLabel size="small">Màu xe</InputLabel>
                  <Select
                    size="small"
                    label={"Màu xe"}
                    name="carColor"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        carColor:
                          e.target.value != undefined
                            ? e.target.value.toString()
                            : "",
                      })
                    }
                    value={filter.carColor}
                  >
                    {carColor?.map((model: any) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className="w-full mt-2">
                  <InputLabel size="small">Bãi xe</InputLabel>
                  <Select
                    size="small"
                    labelId="car-status-id-label"
                    id="car-1"
                    name="parkingLotId"
                    label="Bãi xe"
                    value={filter.parkingLotId == 0 ? "" : filter.parkingLotId}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        parkingLotId: parseInt(e.target.value.toString()),
                      })
                    }
                  >
                    {ParkingLot.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetFilter} color="primary">
                Huỷ bỏ
              </Button>
              <Button onClick={handleFilter} color="primary">
                Tìm kiếm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div className="ml-auto flex justify-between flex-wrap  gap-5 ">
          <Button
            className="text-gray-600 h-10 hover:text-green-400  border-gray-400 shadow-lg"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpenAdd}
          >
            {/* <Modal /> */}
            Thêm Mới
          </Button>
          <Button
            className="text-gray-600 h-10 border-gray-400 shadow-lg hover:text-red-400"
            variant="outlined"
            startIcon={
              isDelete == false ? <DeleteOutlinedIcon /> : <EditOutlinedIcon />
            }
            onClick={handleClickChangeEdit}
          >
            {isDelete == false ? "Xóa" : "Chọn"}
          </Button>
          <Button
            className="text-gray-600 h-10 border-gray-400 hover:text-purple-400"
            variant="outlined"
            startIcon={<ViewListOutlinedIcon />}
            onClick={handleClickChangeConvert}
          >
            Trình bày
          </Button>
          <Button
            className="text-gray-600 h-10 border-gray-400 hover:text-green-700"
            variant="outlined"
            startIcon={<SystemUpdateAltIcon />}
            component="label"
          >
            <input
              hidden
              accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className=""
              type="file"
              onChange={handleClickExport}
            />

            Tạo bằng Excel
          </Button>

        </div>
      </div>


      {isconvert === false ? (
        <div className="mt-5 mb-5">
          <Paper sx={{ overflow: "hidden" }} className="">

            <TableContainer sx={{ minHeight: 700, maxHeight: 700 }}>
              <EnhancedTableToolbar numSelected={selected.length}
                onClickDelete={() => handleClickOpenDelete1(selected)}
              />
              <Table aria-label="sticky table">

                <TableHead>

                  <TableRow
                    sx={{
                      backgroundColor: "rgb(219 234 254)",
                    }}
                  >
                    {isDelete && selected && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < rows.length
                          }
                          checked={
                            rows.length > 0 &&
                            selected.length === rows.length
                          }
                          onChange={handleSelectAllClick}
                          inputProps={{
                            "aria-label": "Select all rows",
                          }}
                        />
                      </TableCell>
                    )}
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
                  {loading == true ? (
                    dataLoad.map((row, index) => {
                      return (
                        <TableRow
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >

                          {dataLoadRow.map((column, index) => {
                            return (
                              <TableCell key={index}>
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
                  ) : rows.length > 0 ? (
                    rows.map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableRow
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                          selected={isItemSelected}
                        >
                          {isDelete && selected && (
                            <TableCell padding="checkbox">

                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) =>
                                  handleClick(event, row.id)
                                }
                                inputProps={{
                                  "aria-labelledby": `checkbox-${row.id}`,
                                }}
                              />
                            </TableCell>
                          )}
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                className="py-[3px] px-3"
                              >
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="w-full mx-auto text-center text-lg">
                      <TableCell
                        colSpan={columns.length}
                        className="w-full text-center text-lg border-none pt-40"
                      >
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Fdownload.svg2561bc28-0cfc-4d75-b183-00387dc91474?alt=media&token=cc09aed8-ccd7-4d8a-ba3c-0b4ace899f40"
                          className="h-40 w-40 mx-auto "
                        />
                        <h2>Không tìm thấy kết quả nào</h2>
                        <div className="text-gray-400">
                          Hãy thử sử dụng các từ khóa chung chung hơn
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              labelRowsPerPage={"Số lượng của trang"}
              rowsPerPageOptions={[12, 25, 100]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trên ${count}`
              }
              component="div"
              count={CarResult.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

          </Paper>
        </div>
      ) : (
        <div
          className={
            "grid relative  mx-12 -mt-2  md:mx-0 grid-cols-1 mb-10 gap-10 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3  2xl:grid-cols-5   "
          }
        >
          {CarResult.cars.length > 0 ? (
            CarResult.cars.map((item) => {
              let encodedId;
              if (item.carLicensePlates) {
                encodedId = btoa(item.id.toString());
                const words: string[] = item.carLicensePlates.split(" ");
                const lastName: string = words[words.length - 1];
                firstCharacter = lastName.charAt(0);
              }

              return (
                <div

                  key={item.id}

                  className={"p-2 shadow-sm  shadow-gray-400  rounded-lg  "}
                >
                  <div className="w-full relative inline-block">

                    <Link

                      to={`/Admin/CarManagement/CarDetail/${encodedId}`}
                      className="flex hover:text-blue-400 cursor-pointer"
                    >
                      <img
                        className={" object-cover w-full h-[180px] mx-auto  "}
                        src={item?.frontImg ? item.frontImg : "https://i.imgur.com/YIcWBqg.jpeg"}
                        alt="..."
                      />
                    </Link>

                    <div key={item.id}>
                      {item.isDeleted ? (
                        <VisibilityOffOutlinedIcon className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-blue-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black" />
                      ) : (
                        <>
                          {isDelete ? (
                            <DeleteOutlinedIcon
                              onClick={() => handleClickOpenDelete(item.id)}
                              className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-red-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
                            />
                          ) : (
                            <>
                              {showCarStatus.includes(item.id) ? (
                                <div
                                  className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2  cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
                                  onClick={() => toggleShow(item.id)}
                                >
                                  {item.carStatus}
                                </div>
                              ) : (
                                <VisibilityOutlinedIcon
                                  onClick={() => toggleShow(item.id)}
                                  className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-blue-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-zinc-500">
                    <div className=" flex flex-row items-center">
                      {CarResult.cars.map((model: any) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p>
                                {" "}
                                <TimeToLeaveOutlinedIcon className="-mt-1 " />{" "}
                                {model.modelName}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <div className="grid grid-cols-6 gap-4 mb-5 mt-2">
                      {CarResult.cars.map((model: any) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left ">
                                <CalendarTodayOutlinedIcon className="-mt-1 " />{" "}
                                {model.modelYear}
                              </p>
                            </div>
                          );
                        }

                        return null;
                      })}

                      {CarResult.cars.map((model) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left  -mx- ">
                                {" "}
                                <FlightClassOutlinedIcon className="-mt-1  " />{" "}
                                {model.seatNumber}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                      {CarResult.cars.map((model) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left">
                                {" "}
                                <BatteryChargingFullIcon className="-mt-1 " />{" "}
                                {model.carFuel}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                      {CarResult.cars.map((model) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left">
                                {" "}
                                <ColorLensOutlinedIcon className="-mt-1 " />{" "}
                                {model.carColor}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    {CarResult.cars.map((model) => {
                      if (model.id === item.id) {
                        const licensePlate =
                          model.carLicensePlates.slice(0, 3) +
                          "-" +
                          model.carLicensePlates.slice(3);
                        return (
                          <div
                            className="bs bg-white  mt-2  items-start flex-nowrap  border-[1px] border-[#050709] text-center"
                            key={model.id}
                          >
                            {licensePlate}{" "}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full col-span-5 text-center mx-auto text-lg mt-20 ">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Fdownload.svg2561bc28-0cfc-4d75-b183-00387dc91474?alt=media&token=cc09aed8-ccd7-4d8a-ba3c-0b4ace899f40"
                className="h-40 w-40 mx-auto "
              />
              <h2>Không tìm thấy kết quả nào</h2>
              <div className="text-gray-400">
                Hãy thử sử dụng các từ khóa chung chung hơn
              </div>
            </div>
          )}
        </div>
      )}

      <Modal openDad={open} parentCallback={callbackFunctionPopup} />
      <ModalStatus
        openDad={open2}
        id={id}
        parentCallback={callbackFunctionPopup1}
        userDad={userDad}
      />
      {CarResult.cars.length > 0 && isconvert == true ? (
        <Pagination
          pagination={pagination}
          total={CarResult.total}
          onPageChange={callbackFunctionPagination}
        />
      ) : undefined}
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>
  );
}
