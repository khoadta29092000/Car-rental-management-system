import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import FlightClassOutlinedIcon from '@mui/icons-material/FlightClassOutlined';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
// import { getcarFileAsyncApi } from '../../redux/CarFileReducer/CarFileReducer';

import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';

// import { UpdateModal } from './Modal/UpdateModal';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Check from '@mui/icons-material/Check';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Menu, MenuItem, Select, Tooltip } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";

import TableRow from "@mui/material/TableRow";
import { AlertComponent } from '../../../Components/AlertComponent';
import { useAppSelector } from '../../../hooks';
import { carAction, getcaractiveAsyncApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
import { Modal } from '../Modal/Modal';
import Pagination1 from '../../../layouts/Layout/Paginaton';
import { getcarStatusAsyncApi } from '../../../redux/CarStatus/CarStatusReducer';
interface Column {
  id: "stt" | "modelName" | "carColor" | "seatNumber" | "carFuel" | "carLicensePlates" | "status"|  "edit";
  label: string;
  minWidth?: number;
  align?: "left" | "center";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  {
    id: "stt",
    label: "Stt",
    minWidth: 50,
    align: "left",
  },
  { id: "modelName", label: "Tên Xe", minWidth: 150 },
  { id: "carColor", label: "màu xe", minWidth: 150 },
  {
    id: "seatNumber",
    label: "Số chỗ ngồi:",
    minWidth: 150,
    align: "left",
  },

  {
    id: "carFuel",
    label: "Nhiên liệu",
    minWidth: 100,
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
    minWidth: 180,
    align: "center",
  },
  { id: "edit", label: "Chi tiết", minWidth: 100 },
];
export default function CarActive() {
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  const carColor = [
    'Đỏ',
    'Xanh',
    'Tím',
    'Vàng',
    'trắng',
    'xám',
    'xanh lá'
  ];
 const CarTrimId = [
    "AT",
    "MT"
  ]

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,

  });
  let callbackFunctionPagination = (childData: any) => {
    
    if (isconvert == false) {
      setPagination({
        page: childData,
        pageSize: 10,
      })
    } else if (isconvert == true) {
      setPagination({
        page: childData,
        pageSize: 10,
      })
    }
  };
  const dispatch: DispatchType = useDispatch();
  const { alertAction, error, message, CarActiveResult, showPopup, loading } = useSelector((state: RootState) => state.CarResult);




 
  const { carStatus } = useAppSelector((state: RootState) => state.carStatus);
  const { ParkingLot } = useSelector((state: RootState) => state.ParkingLot)
  //tên xe
  const [isconvert, setIsconvert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const parkingLotId = userProfile?.parkingLotId;

  const [messageAlert, setMessageAlert] = useState("");
  const handleClickOpenAdd = () => {
    setOpen(true);
    dispatch(carAction.showPopup());



  };
  let firstCharacter: string = "";
  const [searchTerm, setSearchTerm] = useState("");


  //  const [dataUpdate, setDataUpdate]=useState({})
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };

  const getAllCarStatus = () => {
    const actionAsync = (getcarStatusAsyncApi());
    dispatch(actionAsync);
  }




  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState({
    carStatusId: 0,
    carMakeName: "",
    seatNumber: 0,
    carColor: "",
    CarModelId: 0,
   
    
  });
  const handleFilter = () => {

    dispatch(
        getcaractiveAsyncApi({
        page: 1,
        pageSize: pagination.pageSize,
        
        ...filter,
      })
    );

    setOpenFilter(false);
    setOpen1(false);
  };;

  const getAllcarActive = () => {
    const actionAsync = getcaractiveAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      carLicensePlates: searchTerm,
      ...filter,
       parkingLotId
    }
    )
    dispatch(actionAsync);
  }
  const { carMake } = useSelector((state: RootState) => state.carMake);
  const { carModel } = useSelector((state: RootState) => state.CarModel);

  useEffect(() => {
    getAllcarActive()
    getAllCarStatus()
    if (showPopup == false) {
      setOpen(false);
    }
    if (alertAction != "") {
      setAlert(alertAction);
    }
    if (message != null) {
      setMessageAlert(message);
    }

  }, [alertAction,pagination]);
  
  const handleClickChangeConvert = () => {
    setIsconvert(!isconvert);
    if (!isconvert === false) {
      setPagination({
        page: 1,
        pageSize: 10,
      });
    } else {
      setPagination({
        page: 1,
        pageSize: 10,
      });
    }
  };
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleClickOpen = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const seatnumber = [
    4,
    5,
    7,
  ];

  const [showCarStatus, setShowCarStatus] = useState<number[]>([]);

  const toggleShow = (id: number) => {
    setShowCarStatus(prevState => {
      const index = prevState.indexOf(id);
      if (index === -1) {
        return [...prevState, id];
      } else {
        return prevState.filter(item => item !== id);
      }
    });
  };

  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const rows = CarActiveResult.cars.map((data: any, index: number) => {
    return createData(data, index, page);
  });
  function createData(data: any, index: number, page: number) {
    const encodedId = btoa(data.id);
 let modelName = (  <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
 <TimeToLeaveOutlinedIcon className="h-6 w-6" />
 <p className="">{data.modelName}</p>
</button>)
  
    // let carColor = data.carColor;
    let carColor = ( <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
    <ColorLensOutlinedIcon className="h-6 w-6" />
    <p className="">{data.carColor}</p>
   </button>)
     let seatNumber =( <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
     <FlightClassOutlinedIcon className="h-6 w-6" />
     <p className="">{data.seatNumber}</p>
    </button>)
    //let carFuel = data.carFuel;
    let carFuel =( <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
    <BatteryChargingFullIcon className="h-6 w-6" />
    <p className="">{data.carFuel}</p>
   </button>)
    
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
    

    let status = (
      <button className={`gap-2  px-4 py-1 border-[1px] rounded-md mx-auto w-[200px]  ${statusColor}`}>
        <p className="">{data.carStatus}</p>
      </button>
    );
 
    
    let stt = page * rowsPerPage + (index + 1);
   //let carLicensePlates = data.carLicensePlates.slice(0, 3) + '-' +data.carLicensePlates.slice(3);
   let carLicensePlates =( <button className="flex gap-2  mx-4 hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-xl hover:text-gray-600">
   <p className="">{data.carLicensePlates.slice(0, 3) + '-' +data.carLicensePlates.slice(3)}</p>
  </button>)


    let edit = (
      <Tooltip title="Chi tiết Xe" >
        <IconButton>
          <Link to={`/Operator/CarActiveManagement/CarDetail/${encodedId}`}>
            <EditOutlinedIcon className="text-gray-400" />
          </Link>
        </IconButton>
      </Tooltip>
    );

    return { modelName, carColor, seatNumber, status, stt, edit, carFuel, carLicensePlates, id };
  }

  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}, {},{},{}];
  return (

    <div className="mt-5 mx-5" >
      <div className="  xl:flex mb-5 w-full">

        <div className="flex mb-2">
          <FormControl className=" lg:w-auto w-full" variant="outlined">
            <InputLabel size="small" >
              Tìm kiếm theo biển số xe
            </InputLabel>
            <OutlinedInput
              name="tìm kiếm theo biển số xe"
              id="outlined-adornment-password"
              label="tìm kiếm theo biển số xe"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={getAllcarActive}
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
                    onChange={(e) => setFilter({ ...filter, carStatusId: parseInt(e.target.value.toString()) })}
                  >
                    {carStatus.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className="w-full mt-2" >
                  <InputLabel size="small">Hãng xe</InputLabel>

                  <Select
                    size="small"
                    label={"Hãng xe"}
                    name="carMakeName"
                    onChange={(e) => setFilter({ ...filter, carMakeName: e.target.value })}
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
                    onChange={(e) => setFilter({ ...filter, seatNumber: e.target.value != undefined ? parseInt(e.target.value.toString()) : 0 })}
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
                    onChange={(e) => setFilter({ ...filter, carColor: e.target.value != undefined ? e.target.value.toString() : "" })}
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
                  <InputLabel size="small">Tên Xe</InputLabel>
                  <Select
                    size="small"
                    label={"Tên Xe"}
                    name="CarModelId"
                    onChange={(e) => setFilter({ ...filter, CarModelId: e.target.value != undefined ? parseInt(e.target.value.toString()) : 0 })}
                    value={filter.CarModelId == 0 ? "" : filter.CarModelId}
                  >
                    {carModel?.map((model: any) => (
                      <MenuItem key={model.name} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            
              </div>


            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose1} color="primary">
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
            className="text-gray-600 h-10 border-gray-400 hover:text-purple-400"
            variant="outlined"
            startIcon={<ViewListOutlinedIcon />}
            onClick={handleClickChangeConvert}
          >
            Trình bày
          </Button>
         
        </div>
      </div>

      {isconvert === false ?
       <div className="mt-5 mb-5">
       <Paper sx={{ overflow: "hidden" }} className="">
         <TableContainer sx={{ minHeight: 700, maxHeight: 700 }}>
           <Table stickyHeader aria-label="sticky table">
             <TableHead>
               <TableRow>
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
                       key={index}
                       component="tr"
                       role="checkbox"
                       tabIndex={-1}
                     >
                       {dataLoadRow.map((column, index) => {
                         return (
                           <TableCell key={index} component="td">
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
                   return (
                     <TableRow
                       key={index}
                       component="tr"
                       role="checkbox"
                       tabIndex={-1}
                     >
                       {columns.map((column) => {
                         const value = row[column.id];
                         return (
                           <TableCell
                             key={column.id}
                             align={column.align}
                             className="py-[6px] px-3"
                             component="td"
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
              className=""
              rowsPerPageOptions={[10, 25, 100]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trên ${count}`
              }
              component="div"
              count={CarActiveResult.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        : <div
          className={
            "grid relative  mx-12 -mt-2  md:mx-0 grid-cols-1 mb-10 gap-10 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3  2xl:grid-cols-5   "

          }
        >
          {CarActiveResult.cars.length > 0 ? (
            CarActiveResult.cars.map((item) => {
              if (item.carLicensePlates) {
                const words: string[] = item.carLicensePlates.split(" ");
                const lastName: string = words[words.length - 1];
                firstCharacter = lastName.charAt(0);
              }
              return (

                <div
                  key={item.id}
                  className={
                    "p-2 shadow-sm  shadow-gray-400  rounded-lg  "
                  }
                >
                  <div className='w-full relative inline-block' >
                    <Link to={`/Admin/CarManagement/CarDetail/${item.id}`} className='flex hover:text-blue-400 cursor-pointer'>
                      <img
                        className={
                          " object-cover w-full h-[180px] mx-auto  "
                        }
                        src={item?.frontImg}
                        alt="..."
                      />
                    </Link>

                    <div key={item.id}>
                      {item.isDeleted ? (
                        <VisibilityOffOutlinedIcon
                          className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-blue-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
                        />
                      ) : (
                        <>
                          {isDelete ? (
                            <DeleteOutlinedIcon
                          
                              className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-red-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
                            />
                          ) : (
                            <>
                              {showCarStatus.includes(item.id) ? (
                                <div className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2  cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black" onClick={() => toggleShow(item.id)}>{item.carStatus}</div>
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
                  <div className='text-zinc-500'>

                    <div className=' flex flex-row items-center' >
                      {CarActiveResult.cars.map((model: any) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id} >
                              <p  >   <TimeToLeaveOutlinedIcon className='-mt-1 ' />  {model.modelName}</p>
                            </div>

                          );
                        }
                        return null;
                      })}
                    </div>

                    <div className="grid grid-cols-6 gap-4 mb-5 mt-2" >
                      {CarActiveResult.cars.map((model: any) => {


                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left "  ><CalendarTodayOutlinedIcon className='-mt-1 ' /> {model.modelYear}</p>
                            </div>
                          );

                        }

                        return null;

                      })}

                      {CarActiveResult.cars.map((model) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left  -mx- " > <FlightClassOutlinedIcon className='-mt-1  ' /> {model.seatNumber}</p>
                            </div>
                          );
                        }
                        return null;
                      })}

                    </div>
                    <div className="grid grid-cols-6 gap-4">
                      {CarActiveResult.cars.map((model) => {
                        if (model.id === item.id) {
                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left" > <BatteryChargingFullIcon className='-mt-1 ' /> {model.carFuel}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                      {CarActiveResult.cars.map((model) => {

                        if (model.id === item.id) {

                          return (
                            <div className="col-span-3" key={model.id}>
                              <p className="text-left" > <ColorLensOutlinedIcon className='-mt-1 ' /> {model.carColor}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    {CarActiveResult.cars.map((model) => {
                      if (model.id === item.id) {
                        const licensePlate = model.carLicensePlates.slice(0, 3) + '-' + model.carLicensePlates.slice(3);
                        return (
                          <div className='bs bg-white  mt-2  items-start flex-nowrap  border-[1px] border-[#050709] text-center' key={model.id}>{licensePlate}  </div>
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
              <img src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Fdownload.svg2561bc28-0cfc-4d75-b183-00387dc91474?alt=media&token=cc09aed8-ccd7-4d8a-ba3c-0b4ace899f40"
                className="h-40 w-40 mx-auto " />
              <h2>Không tìm thấy kết quả nào</h2>
              <div className="text-gray-400">Hãy thử sử dụng các từ khóa chung chung hơn</div>
            </div>
          )}
        
        </div>
      }


      <Modal
        openDad={open}
        parentCallback={callbackFunctionPopup}

      />
      {/* {CarActiveResult.cars.length > 0 && isconvert == true ? <Pagination
        pagination={pagination}
        total={CarActiveResult.total
        onPageChange={callbackFunctionPagination}
      /> : undefined} */}
         {CarActiveResult.cars.length > 0 && isconvert == true ? (
        <Pagination1
          pagination={pagination}
          total={CarActiveResult.total}
          onPageChange={callbackFunctionPagination}
        />
      ) : undefined}
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>

  )
}