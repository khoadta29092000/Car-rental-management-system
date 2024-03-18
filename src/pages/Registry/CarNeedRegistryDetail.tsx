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
import { carAction, getCarByIdAsyncApi, getcCarNeedRegistryApi } from '../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../redux/store';
import { CarNeedRegistryModal } from './Modal/CarNeedRegistryModal';
import { CarNeedRegistryUpdate } from './Modal/CarNeedRegistryUpdate';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
type Props = {}
interface Column {
    id: "stt" | "registrationDeadline" | "registryAmount" | "registryAddress" | "registryInvoice" | "certificateRegistryDocument"  | "edit";
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
    { id: "registrationDeadline", label: "Hạn cuối đăng kiểm", minWidth: 100 },
    { id: "registryAmount", label: "Số tiền đăng kiểm", minWidth: 100 },
    { id: "registryAddress", label: "Địa chỉ đăng kiểm", minWidth: 100 },
    {
      id: "registryInvoice",
      label: "Hóa đơn đăng kiểm",
      minWidth: 150,
      align: "left",
    },
    {
      id: "certificateRegistryDocument",
      label: "Biên bản đăng kiểm",
      minWidth: 150,
      align: "left",
    },
  
    { id: "edit", label: "Thao tác", minWidth: 50 },
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
  
export default function CarNeedRegistryDetail({}: Props) {
    const dispatch: DispatchType = useDispatch();
    let callbackFunctionAlert1 = (childData: any) => {
      setAlert(childData);
    };
    let callbackFunctionAlert = (childData: any) => {
      setAlert(childData);
      setMessageAlert(childData);
    };
    let callbackFunctionMessageAlert = (childData: any) => {
      setMessageAlert(childData);
    };
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,

  });
  const [page, setPage] = useState(0);
  const [messageAlert, setMessageAlert] = useState("");
  const [userDad, setUserDad] = useState({});
  const { alertAction, CarIdregistry, message, showPopup,CarResultDetail } = useSelector((state: RootState) => state.CarResult); //r

  const userString = localStorage.getItem("user");

  const userProfile = userString ? JSON.parse(userString) : null;
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
    const actionAsync = getcCarNeedRegistryApi(decodedId);
    dispatch(actionAsync);
  }


  useEffect(() => {
    getProductById()
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
  }, [alertAction,])
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
  const handleClickOpenUpdate = (car: object , id:number) => {
    setOpen1(true);
    setUserDad(car);
    dispatch(carAction.showPopup());
    if (id !== null) {
      setid(id);
    }
  };
  const handleClickOpenadd = (carId: number) => {
    setOpen(true);
    dispatch(carAction.showPopup());
    setCarId(carId);
  };
  const rows = CarIdregistry && Array.isArray(CarIdregistry) ? CarIdregistry.map((data: any, index: number) => {
    return createData(data, index, page);
  }) : [];
  function createData(data: any, index: number, page: number) {
    let registryAmount = data.registryAmount ? formatToVND(data.registryAmount) : "Chưa cập nhật";
    let registryAddress = data.registryAddress ? data.registryAddress : "Chưa cập nhật";
    let formattedStartDate = new Date(data.registrationDeadline).toLocaleDateString();
    let maintenanceInvoiceImg = data.registryInvoice ? <img className=' h-24 w-24 my-5' src={data.registryInvoice} alt="Maintenance Invoice" /> : "Chưa cập nhật";
    let maintenancecertificateRegistryDocumentImg = data.certificateRegistryDocument ? <img className=' h-24 w-24 my-5' src={data.certificateRegistryDocument} alt="certificateRegistryDocument" /> : "Chưa cập nhật";
    let id = data.id;
    let stt = page * rowsPerPage + (index + 1);
  
    let edit = (
      <Tooltip title="Thao tác">
        <IconButton onClick={() => handleClickOpenUpdate(data , id)}>
          <RemoveRedEyeOutlinedIcon className="" />
        </IconButton>
      </Tooltip>);
   
    return { stt, registryAmount,registryAddress, registrationDeadline: formattedStartDate, edit, registryInvoice: maintenanceInvoiceImg,certificateRegistryDocument:maintenancecertificateRegistryDocumentImg, id };
  }
  let  encodedId = btoa(CarResultDetail?.id.toString()); 
  
  return (
    <div className=" mt-2    ">
    <div className='flex justify-between '>
      <div>
         
          
                   {userProfile.role === "OperatorStaff" ? (
        
           <div className="mt-10 ml-6">
               
                  <Breadcrumbs className='mx-4' aria-label="breadcrumb">
         <NavLink to="/OperatorStaff/CarNeedRegistry" className="hover:underline">
         Đăng kiểm 
         </NavLink>
         <Typography className="text-sm" color="text.primary">
           Chi tiết Theo xe
         </Typography>
         <Tooltip title="Xem chi tiết xe">
         <Link to={`/Admin/CarManagement/CarDetail/${encodedId}`}>
         <Typography className="text-sm font-bold" color="text.primary">
           {CarResultDetail?.modelName} - {CarResultDetail?.carLicensePlates}
         </Typography>
         </Link>
         </Tooltip>;
       </Breadcrumbs>
           </div>
        
       ) : (
        
           <div className="mt-10 ml-6">

                 <Breadcrumbs className='mx-4 ' aria-label="breadcrumb">
         <NavLink to="/Admin/CarNeedRegistry" className="hover:underline">
           Đăng kiểm 
         </NavLink>
         <Typography className="text-sm" color="text.primary">
           Chi tiết Theo xe
         </Typography>
         <Tooltip title="Xem chi tiết xe">
         <Link to={`/Admin/CarManagement/CarDetail/${encodedId}`}>
         <Typography className="text-sm font-bold" color="text.primary">
           {CarResultDetail?.modelName} - {CarResultDetail?.carLicensePlates}
         </Typography>
         </Link>
         </Tooltip>;
       </Breadcrumbs>
           </div>
        
       )}
         
        
      </div>
      <div className='flex'>
        <button
          className=" mt-5 flex justify-end mx-12bs m-4 hover:text-blue-400 rounded-lg cursor-pointer hover:bg-gray-100 shadow-md shadow-gray-400 border text-gray-600 border-gray-400 py-2 px-4"
          onClick={() => handleClickOpenadd(CarIdregistry?.carId)}
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
  
  <CarNeedRegistryModal
   openDad={open}
   parentCallback={callbackFunctionPopup1}
   carId={decodedId}
   parentCallbackAlert={callbackFunctionAlert}
   parentCallbackMessageAlert={callbackFunctionMessageAlert}
  />
       <CarNeedRegistryUpdate
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