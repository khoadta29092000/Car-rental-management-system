import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Tooltip } from '@mui/material';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useParams } from 'react-router-dom';
import { AlertComponent } from '../../Components/AlertComponent';
import { carAction, getCarByIdAsyncApi, getcarIdmaintenanceinfoByIdAsyncApi } from '../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../redux/store';
import { CarMaintenanceInfoDetailUpdate } from './Modal/CarMaintenanceInfoDetailUpdate';
import { CarMaintenanceInfoPost } from './Modal/CarMaintenanceInfoPost';

type Props = {}
interface Column {
  id: "stt" | "carKmlastMaintenance" | "kmTraveled" | "maintenanceAmount" | "maintenanceDate" | "maintenanceInvoice"  | "edit";
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
  // { id: "carLicensePlates", label: "Biển số xe", minWidth: 100 },
  { id: "carKmlastMaintenance", label: "Số km bảo dưỡng lần cuối", minWidth: 100 },
  { id: "kmTraveled", label: "Số km đã đi", minWidth: 100 },
  {
    id: "maintenanceAmount",
    label: "Tiền bảo trì",
    minWidth: 150,
    align: "left",
  },

  {
    id: "maintenanceDate",
    label: "Ngày bảo trì",
    minWidth: 100,
    align: "left",
  },
  {
    id: "maintenanceInvoice",
    label: " Hóa đơn bảo trì",
    minWidth: 100,
    align: "left",
  },

  { id: "edit", label: "Thao tác", minWidth: 100 },
];
function formatToVND(value: any) {
  if (typeof value === 'number' && !isNaN(value)) {
    const parts = value.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    return integerPart + decimalPart + ' VND';
  } else {
    return '';
  }
}

function formatToKM(value: any) {
  if (typeof value === 'number' && !isNaN(value)) {
    const parts = value.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    return integerPart + decimalPart + ' km';
  } else {
    return '';
  }
}
export default function CarMaintenanceInfoDetail({ }: Props) {
  const dispatch: DispatchType = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,

  });
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
    setMessageAlert(childData);
  };
  let callbackFunctionAlert1 = (childData: any) => {
    setAlert(childData);
  };
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const [page, setPage] = useState(0);
  const [messageAlert, setMessageAlert] = useState("");
  const [userDad, setUserDad] = useState({});
  const { alertAction, CarIdMantance, message, showPopup,CarResultDetail } = useSelector((state: RootState) => state.CarResult); //r

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setPagination({ page: newPage + 1, pageSize: rowsPerPage });
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPagination({ page: 1, pageSize: +event.target.value });
    setPage(0);
  };
  

  const [alert1, setAlert] = useState("");
  const param = useParams()
  const decodedId = param.id ? atob(param.id) : "";
  const getProductById = () => {
    const id: string | undefined = param.id;
    const actionAsync = getCarByIdAsyncApi(decodedId);
    dispatch(actionAsync);
  };
  const getcarIDmaitancedetailById = () => {
    const id: string | undefined = param.id
 
    const actionAsync = getcarIdmaintenanceinfoByIdAsyncApi(decodedId);
    dispatch(actionAsync);
  }
  useEffect(() => {
    getProductById();
    getcarIDmaitancedetailById()
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
  }, [alertAction])
  let callbackFunctionPopup1 = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionPopup2 = (childData: any) => {
    setOpen1(childData);
  };


  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [carId, setCarId] = useState<number | null>(null);
  const [id, setid] = useState<number | null>(null);
  const handleClickOpenUpdate = (car:object,id:number) => {
    setOpen1(true);
    setUserDad(car);
    dispatch(carAction.showPopup());
    setid(id)
    if (id != null) {
      setid(id)
    }
   
  };
  const handleClickOpenadd = (carId: number | null) => {
    setOpen(true);
    dispatch(carAction.showPopup());
    setCarId(carId);
  };
  const rows = CarIdMantance && Array.isArray(CarIdMantance) ? CarIdMantance.map((data: any, index: number) => {
    return createData(data, index, page);
  }) : [];

  function createData(data: any, index: number, page: number) {
    let carKmlastMaintenance = formatToKM(data.carKmlastMaintenance);
    let kmTraveled = formatToKM(data.kmTraveled);
    
    let maintenanceAmount =data.maintenanceAmount? formatToVND(data.maintenanceAmount): "Chưa cập nhật";
    let formattedStartDate =data.maintenanceDate?  new Date(data.maintenanceDate).toLocaleDateString() : "Chưa cập nhật";
    let maintenanceInvoiceImg =data.maintenanceInvoice? <img className=' h-24 w-24 my-5' src={data.maintenanceInvoice} alt="Maintenance Invoice" /> : "Chưa cập nhật";
    
    let id = data.id;
    let status = data.carStatus
    let stt = page * rowsPerPage + (index + 1);
    let edit = (
      <Tooltip title="Thao tác">
      <IconButton onClick={() => handleClickOpenUpdate(data , id)}>
        <RemoveRedEyeOutlinedIcon className="" />
      </IconButton>
    </Tooltip>);
 

    return { stt, carKmlastMaintenance, kmTraveled, maintenanceAmount, status, maintenanceDate: formattedStartDate, edit, maintenanceInvoice: maintenanceInvoiceImg, id };
  }

  return (
    <div className=" mt-2    ">
      <div className='flex justify-between '>
      {userProfile.role === "OperatorStaff" ? (
        <div>
            <Breadcrumbs className='mt-10 ml-6' aria-label="breadcrumb">
            <NavLink to="/OperatorStaff/CarMaintenanceInfo" className="hover:underline">
              Tổng quát
            </NavLink>
            <Typography className="text-sm" color="text.primary">
              Chi tiết Theo xe
            </Typography>
            <Tooltip title="Xem chi tiết xe">
            <Link to={`/Operator/CarActiveManagement/CarDetail/${CarResultDetail.id}`}>
         <Typography className="text-sm font-bold" color="text.primary">
           {CarResultDetail?.modelName} - {CarResultDetail?.carLicensePlates}
         </Typography>
         </Link>
         </Tooltip>;
          </Breadcrumbs>
        </div>
        ) : (
          <div>
          <Breadcrumbs className='mt-10 ml-6' aria-label="breadcrumb">
          <NavLink to="/Admin/CarMaintenanceInfo" className="hover:underline">
            Tổng quát
          </NavLink>
          <Typography className="text-sm" color="text.primary">
            Chi tiết Theo xe
          </Typography>
          <Tooltip title="Xem chi tiết xe">
          <Link to={`/Admin/CarManagement/CarDetail/${CarResultDetail.id}`}>
        
       <Typography className="text-sm font-bold" color="text.primary">
         {CarResultDetail?.modelName} - {CarResultDetail?.carLicensePlates}
       </Typography>
      
       </Link>
       </Tooltip>;
        </Breadcrumbs>
      
      </div>
        )}
        <div className='flex'>
          <button
            className=" mt-5 flex justify-end mx-12bs m-4 hover:text-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 shadow-md shadow-gray-400 border text-gray-600 border-gray-400 py-2 px-4"
            onClick={() => handleClickOpenadd(CarIdMantance?.carId)}
          >
            <AddIcon className='mx-2 -ml-1' />
            Thêm mới
          </button>

        </div>
      </div>
      <div className="mx-5 mb-5">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ minHeight: 700, maxHeight: 700 }}>
        <Table  component="table" stickyHeader aria-label="sticky table">
          <TableHead  component="thead">
            <TableRow   component="tr">
              {columns.map((column) => (
                <TableCell
                sx={{
                  backgroundColor: "rgb(219 234 254)",
                }}
                  component="th"
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
          <TableBody component="tbody">
            {rows.map((row, index) => {
              return (
                <TableRow
                 
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
                  component="tr"
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        component="td"
                        key={column.id}
                        align={column.align}
                        //className="py-[5px] px-2"
                      >
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
            rowsPerPageOptions={[11, 25, 100]}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trên ${count}`
            }
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

      </div>
      <CarMaintenanceInfoPost
        openDad={open}
        parentCallback={callbackFunctionPopup1}
        carId={decodedId}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
      />
      <CarMaintenanceInfoDetailUpdate
  openDad={open1}
  parentCallback={callbackFunctionPopup2}
  userDad={userDad}
  carId={decodedId}
  id ={id}
  parentCallbackAlert={callbackFunctionAlert}
  parentCallbackMessageAlert={callbackFunctionMessageAlert}
/>
<AlertComponent
        message={messageAlert}
        alert={alert1}
        parentCallback={callbackFunctionAlert1}
      />
    </div>
  )
}
