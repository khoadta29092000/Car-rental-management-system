import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import FlightClassOutlinedIcon from '@mui/icons-material/FlightClassOutlined';

import IconButton from "@mui/material/IconButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';

// import { getcarFileAsyncApi } from '../../redux/CarFileReducer/CarFileReducer';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';

import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Check from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import Skeleton from "@mui/material/Skeleton";
import { MenuItem, Select, Tooltip, Menu,Card,Box, Tabs,Tab  } from '@mui/material';
import { useAppSelector } from '../../hooks';
import { DispatchType, RootState } from '../../redux/store';
import { carAction, getcaractiveAsyncApi } from '../../redux/CarReducer/CarReducer';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { getParkingLotcarByIdAsyncApi } from '../../redux/ParkingLotReducer/ParkingLotReducer';
import {
  Avatar,
 
} from "@mui/material";
import { getUserdetailtAsyncApi, getUsertAsyncApi } from '../../redux/UserReducer/userReducer';
import UserManagement from '../UserManagement/UserManagement';
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PublicOffOutlinedIcon from "@mui/icons-material/PublicOffOutlined";
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
      {value === index && <Box sx={{ p:1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
interface Column {
  id: "stt" | "modelName" | "carColor" | "seatNumber" | "carFuel" | "carLicensePlates" | "edit";
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
  // {
  //   id: "status",
  //   label: "Trạng thái",
  //   minWidth: 180,
  //   align: "left",
  // },

  { id: "edit", label: "Chi tiết", minWidth: 100 },
];



interface Column1 {
  id:
  | "stt"
  | "email"
  | "name"
  | "sdt"
  | "edit";
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
  { id: "email", label: "Email", minWidth: 150 },
  { id: "name", label: "Họ và tên", minWidth: 200 },
  {
    id: "sdt",
    label: "Số điện thoại",
    minWidth: 150,
    align: "right",
  },
];

export default function Parkingdetail() {
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


  const dispatch: DispatchType = useDispatch();
  const { alertAction, error, message, CarActiveResult, showPopup, loading } = useSelector((state: RootState) => state.CarResult);
  const {  userListdetail } = useAppSelector((state: RootState) => state.user);


  const { carStatus } = useAppSelector((state: RootState) => state.carStatus);
  const { ParkingLot,parkinglotdetail } = useSelector((state: RootState) => state.ParkingLot)

  //tên xe
  const [isconvert, setIsconvert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;


  const [messageAlert, setMessageAlert] = useState("");
  const handleClickOpenAdd = () => {
    setOpen(true);
    dispatch(carAction.showPopup());



  };
  const [value, setValue] = React.useState(0);
  const handleChange3 = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  let firstCharacter: string = "";
  const [searchTerm, setSearchTerm] = useState("");


  const [openFilter, setOpenFilter] = useState(false);
 
  const handleFilter = () => {
    dispatch(
      getcaractiveAsyncApi({
        page: 1,
        pageSize: pagination.pageSize,
      })
    );
  };;
  const param = useParams()
  const param1 = useParams()

  // const getUserAPi = () => {
  //   const actionAsync = getUsertAsyncApi(filter);
  //   dispatch(actionAsync);
  // };

  const getUserAPi = () => {
    if (param1.id) {
      const parkingLotId: string = param1.id;
      const decodedId = parkingLotId ? atob(parkingLotId) : "";
      const actionAsync = getUserdetailtAsyncApi({
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
        searchName: '',
        searchEmail: '',
        searchPhoneNumber: '',
        parkingLotId: parseInt(decodedId),
      });
      dispatch(actionAsync);
    }
  }


  const getParkingById = () => {
    const id: string | undefined = param.id;
    const decodedId = param.id ? atob(param.id) : "";
    const actionAsync = getParkingLotcarByIdAsyncApi(decodedId);
    dispatch(actionAsync);
  };

  



  const getAllcarActive = () => {
    if (param.id) { // Kiểm tra param.id có giá trị hay không
      const parkingLotId: string = param.id;
      const decodedId = parkingLotId ? atob(parkingLotId) : "";
      const actionAsync = getcaractiveAsyncApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: parseInt(decodedId),
      });
      dispatch(actionAsync);
    }
  }




  const { carMake } = useSelector((state: RootState) => state.carMake);
  const { carModel } = useSelector((state: RootState) => state.CarModel);

  useEffect(() => {
    getAllcarActive()
    getUserAPi()
    getParkingById()
    if (showPopup == false) {
      setOpen(false);
    }
    if (alertAction != "") {
      setAlert(alertAction);
    }
    if (message != null) {
      setMessageAlert(message);
    }

  }, [alertAction, pagination]);

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
  const [rowsPerPage1, setRowsPerPage1] = useState(7);
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

  const row1s = userListdetail.users.map((data: any, index: number) => {
    return createData1(data, index, page);
  });

  function createData1(data: any, index: number, page: number) {
    const words: string[] = data.name.trim().split(" ");
    const lastName: string = words[words.length - 1];
    firstCharacter = lastName.charAt(0);
    let name = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        {data.cardImage == null || data.cardImage == "" ? (
          <Avatar className=" h-5 w-5" sx={{}}>
            {firstCharacter}
          </Avatar>
        ) : (
          <img src={data.cardImage} className="h-5 w-5 rounded-full" />
        )}
        <p className="">{data.name}</p>
      </button>
    );
    let sdt = data.phoneNumber;
    let stt = page * rowsPerPage + (index + 1);
    let edit = (
      <>
        <Tooltip  title="Chi tiết">
          <IconButton>
            <EditOutlinedIcon className="text-gray-700" />
          </IconButton>
        </Tooltip>
      </>
    );
    // let parkingLot = data.role === "OperatorStaff"
    //   ? ParkingLot.find(item => item.id === data.parkingLotId)?.name ?? "Đang cập nhật"
    //   : "Atshare";
    let email = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <EmailOutlinedIcon className="h-5 w-5" />
        <p className="">{data.email}</p>
      </button>
    );
    let id = data.id;
    return {  name, sdt, stt, edit, email, id };
  }









  const rows = CarActiveResult.cars.map((data: any, index: number) => {
    return createData(data, index, page);
  });
  function createData(data: any, index: number, page: number) {
    let modelName = (<button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
      <TimeToLeaveOutlinedIcon className="h-6 w-6" />
      <p className="">{data.modelName}</p>
    </button>)

    // let carColor = data.carColor;
    let carColor = (<button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
      <ColorLensOutlinedIcon className="h-6 w-6" />
      <p className="">{data.carColor}</p>
    </button>)
    let seatNumber = (<button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
      <FlightClassOutlinedIcon className="h-6 w-6" />
      <p className="">{data.seatNumber}</p>
    </button>)
    //let carFuel = data.carFuel;
    let carFuel = (<button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
      <BatteryChargingFullIcon className="h-6 w-6" />
      <p className="">{data.carFuel}</p>
    </button>)

    let id = data.id;
    let status = data.carStatus;


    let stt = page * rowsPerPage + (index + 1);
    //let carLicensePlates = data.carLicensePlates.slice(0, 3) + '-' +data.carLicensePlates.slice(3);
    let carLicensePlates = (<button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-xl ">
     <PaymentOutlinedIcon className="h-6 w-6" />
      <p className="">{data.carLicensePlates.slice(0, 3) + '-' + data.carLicensePlates.slice(3)}</p>
    </button>)


    let edit = (
      <Tooltip title="Chi tiết Xe" >
        <IconButton>
          <Link to={`/Operator/CarActiveManagement/CarDetail/${data.id}`}>
            <EditOutlinedIcon className="text-gray-400" />
          </Link>
        </IconButton>
      </Tooltip>
    );

    return { modelName, carColor, seatNumber, status, stt, edit, carFuel, carLicensePlates, id };
  }

  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {},{}, {},{}, {}];


  const dataLoad1 = [{}, {}, {}, {}, ];
  const dataLoadRow1 = [{}, {}, {}, {}];
  const [selectedImage, setSelectedImage] = useState(null);
  return (

    <div className="mt-10  mx-2" >

<div className="mt-4 ml-6 ">

<Breadcrumbs className='mx-4' aria-label="breadcrumb">
  <NavLink to="/Admin/Parking" className="hover:underline">
    Bãi đậu xe
  </NavLink>
  <Typography className="text-sm" color="text.primary">
    Chi tiết bãi đậu xe
  </Typography>
</Breadcrumbs>
</div>
<div className="grid grid-cols-2 relative xl:grid-cols-7 bg-white  ">

<div className="col-span-5 xl:col-span-2   xl:grid-rows-5 xl:h-300  ">

  <div className="relative  border-gray-300 ">
  <h6 className="mx-1 mt-4 font-bold text-[#2c2c2c] text-xl">
              <span className="flex items-center">Thông tin bãi xe</span>
            </h6>
  <img
              className="mt-2 lg:w-[2000px] h-[600px]"
              src={
                selectedImage == null
                  ? parkinglotdetail?.parkingLotImg
                  : selectedImage
              }
              alt="img"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            />
            
  </div>
  <div className='text-center mt-6 font-bold'><h2>	Địa chỉ bãi xe: {parkinglotdetail?.address}</h2> </div>
              <div className='text-center mt-6 mx-4  font-bold'><h2>	Tên bãi xe: {parkinglotdetail?.name}</h2> </div>
</div>
<div className=' col-span-2 xl:col-span-5 relative md:row-span-3 bg-white py-0 md:py-xl:py-0 mx-4  '>
<h6 className="mx-2 mt-4 font-bold text-[#2c2c2c] text-xl">
              <span className="flex items-center"></span>
            </h6>
{/* <div className="mt-5 mb-5">
<Paper sx={{ overflow: "hidden" }} className="">
          <TableContainer sx={{ minHeight: 600, maxHeight: 600 }}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgb(219 234 254)",
                  }}
                >
                  {column1.map((column) => (
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
                  dataLoad1.map((row, index) => {
                    return (
                      <TableRow
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                      >
                        {dataLoadRow1.map((column, index) => {
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
                ) : row1s.length > 0 ? (
                  row1s.map((row, index) => {
                    return (
                      <TableRow
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
              rowsPerPageOptions={[10, 25, 100]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trên ${count}`
              }
              component="div"
              count={userListdetail.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        
        </div>   */}

<Box sx={{ width: '100%' }}>
  <Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Tabs
      component="div"
      value={value}
      onChange={handleChange3}
      aria-label="basic tabs example"
    >
      <Tab label="Nhân viên quản lí bãi xe " {...a11yProps(1)} />
      <Tab label="Số xe trong bãi" {...a11yProps(2)} />
    </Tabs>
  </Box>
 
  <TabPanel value={value} index={0}>
 <div className="mt-5 mb-5">
<Paper sx={{ overflow: "hidden" }} className="">
          <TableContainer sx={{ minHeight: 600, maxHeight: 600 }}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgb(219 234 254)",
                  }}
                >
                  {column1.map((column) => (
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
                  dataLoad1.map((row, index) => {
                    return (
                      <TableRow
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                      >
                        {dataLoadRow1.map((column, index) => {
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
                ) : row1s.length > 0 ? (
                  row1s.map((row, index) => {
                    return (
                      <TableRow
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
              rowsPerPageOptions={[10, 25, 100]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trên ${count}`
              }
              component="div"
              count={userListdetail.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        
        </div>  
  </TabPanel>
  <TabPanel value={value} index={1}>
  {/* <h2 className="mx-1 mt-4 font-bold text-[#2c2c2c] text-2xl">
              <span className="flex items-center">Số xe trong bãi : {CarActiveResult.total} xe</span>
            </h2> */}
      <div className="mt-5 mb-5">
        <Paper sx={{ overflow: "hidden" }} className="">
          <TableContainer sx={{ minHeight: 600, maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                    sx={{
                      backgroundColor: "rgb(219 234 254)",
                    }}
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

  </TabPanel>
</Box>
</div>
</div>

    </div>

  )
}