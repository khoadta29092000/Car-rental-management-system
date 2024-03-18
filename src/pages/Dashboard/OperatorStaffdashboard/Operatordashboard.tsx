import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Card } from "@mui/material";
import { useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link } from "react-router-dom";
import { Tooltip } from '@mui/material';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import TimeToLeaveOutlinedIcon from "@mui/icons-material/TimeToLeaveOutlined";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import { useDispatch, useSelector } from 'react-redux';
import { getCarNeedRegistryApi, getcarAsyncApi, getcaractiveAsyncApi, getneedmaintainceApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
import { useAppSelector } from "../../../hooks";
import { getParkingLotcarAsyncApi } from "../../../redux/ParkingLotReducer/ParkingLotReducer";
import { getCustomerinfoReducerAsyncApi } from "../../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { getUsertAsyncApi } from "../../../redux/UserReducer/userReducer";
import { getCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import DonutChartComponent from "../Admindashboard/DonutChartComponent";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
type Props = {}
interface Column {
  id: "stt" | "modelName" | "carLicensePlates" | "kmTraveled" | "periodicMaintenanceLimit" | "edit";
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
  { id: "modelName", label: "Tên xe", minWidth: 150 },
  { id: "carLicensePlates", label: "Biển số xe", minWidth: 150 },
  {
    id: "kmTraveled",
    label: "số km đã đi(Km)",
    minWidth: 150,
    align: "left",
  },
  {
    id: "periodicMaintenanceLimit",
    label: "Định mức bảo trì(Km)",
    minWidth: 200,
    align: "left",
  },
  { id: "edit", label: "Chi tiết", minWidth: 100 },
];
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
export default function Operatordashboard({}: Props) {
  const { CarActiveResult} = useSelector((state: RootState) => state.CarResult);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 1 });
  const [statusContractGr, setStatusContractGr] = useState(0);
  let filter = {
    pagination: pagination,
    status: statusContractGr === 0 ? "" : statusContractGr,
    id: null,
    CitizenIdentificationInfoNumber:null
  };
  let filterUser = {
    pagination: pagination,
    searchName: "",
    searchEmail: "",
    searchPhoneNumber: "",
  };

  const [filterCar, setFilterCar] = useState({
    carStatusId: 0,
    carMakeName: "",
    seatNumber: 0,
    carColor: "",
    CarModelId: 0,
  });
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const parkingLotId = userProfile?.parkingLotId;
  const { contractgroup } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { userList } = useAppSelector((state: RootState) => state.user);
  const { carmaitance,loading } = useAppSelector((state: RootState) => state.CarResult);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const { CarNeedRegistry } = useSelector(
    (state: RootState) => state.CarResult
  );
  const { customerinfo } = useAppSelector(
    (state: RootState) => state.customerinfo
  );
  const { ParkingLot } = useSelector((state: RootState) => state.ParkingLot);
  const getAllparkinglotdetail = () => {
    const actionAsync = getParkingLotcarAsyncApi();
    dispatch(actionAsync);
  };
  const getcustomerinfoApi = () => {
    const actionAsync = getCustomerinfoReducerAsyncApi();
    dispatch(actionAsync);
  };
  const getUserAPi = () => {
    const actionAsync = getUsertAsyncApi(filterUser);
    dispatch(actionAsync);
  };
  const getAllCarNeedRegistryApi = () => {
    const actionAsync = getCarNeedRegistryApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      parkingLotId:null
    });
    dispatch(actionAsync);
  };
  const getAllcar = () => {
    const actionAsync = getcarAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filterCar,
    });
    dispatch(actionAsync);
  };
 
  const getAllcarmaitance = () => {
    const actionAsync = getneedmaintainceApi({
      page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: parkingLotId
    });
    dispatch(actionAsync);
  };
  // const contracGroupFinish =
  //   contractgroup.total != 0
  //     ? contractgroup.contracts.filter((item, index) => {
  //         if (item.contractGroupStatusId == 17) {
  //           return item;
  //         }
  //       })
  //     : undefined;
  const getContractAPi = () => {
    const actionAsync = getCarContractgroupReducercarAsyncApi(filter);
    dispatch(actionAsync);
  };

  useEffect(() => {
    getAllparkinglotdetail();
    getcustomerinfoApi();
    getUserAPi();
    getContractAPi();
    getAllcarmaitance();
    getAllCarNeedRegistryApi();
    getAllcar();
    getAllcarActive();
    return () => {};
  }, []);
  // const { customerinfo } = useAppSelector((state: RootState) => state.customerinfo);
  const dispatch: DispatchType = useDispatch();
  
  const getAllcarActive = () => {
    const actionAsync = getcaractiveAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
       parkingLotId
    }
    )
    dispatch(actionAsync);
  }
  useEffect(() => {
    getAllcarActive()
  

  }, []);
  
  const filterCarActive = CarActiveResult.cars.filter((item, index) => {
    if (item.carStatus == "Sẵn sàng để thuê") {
      return item;
    }
  });
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

  const rows = carmaitance.cars.map((data: any, index: number) => {
    return createData(data, index, page);
  });
  function createData(data: any, index: number, page: number) {
    const encodedId = btoa(data.id);
    let modelName = (
      <Tooltip title="Chi tiết Xe">
        <Link to={`/Admin/CarManagement/CarDetail/${encodedId}`}>
          <button className="flex gap-2  hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-2xl hover:text-gray-600">
            <TimeToLeaveOutlinedIcon className="h-6 w-6" />
            <p className="">{data.modelName}</p>
          </button>
        </Link>
      </Tooltip>
    )
    let kmTraveled = formatToKM(data.kmTraveled);
    let color1 = data.kmTraveled >= 10000 ? "text-red-500" : "text-green-400";
    let periodicMaintenanceLimit = formatToKM(data.periodicMaintenanceLimit);
    let carLicensePlates = (<button className="flex gap-2    bg-gray-100 px-2 py-1 border-[1px] rounded-xl ">
      <PaymentOutlinedIcon className="h-6 w-6" />
      <p className="">{data.carLicensePlates.slice(0, 3) + '-' + data.carLicensePlates.slice(3)}</p>
    </button>)
    let id = data.id;
    let status = data.carStatus
    let stt = page * rowsPerPage + (index + 1);
    //let color =data.periodicMaintenanceLimit >= 10000000 ? "text-red-500" : "text-yellow-500";
    let edit = (
      <Link to={{ pathname: `/Admin/CarMaintenanceInfo/CarMaintenanceInfoDetail/${encodedId}` }}>
        <Tooltip title="Chi tiết Xe" >
          <IconButton>
            <EditOutlinedIcon className="text-gray-400" />
          </IconButton>
        </Tooltip>
      </Link>
    );


    return { modelName, status, stt, edit, carLicensePlates, id, kmTraveled: (<span className={color1}>{kmTraveled}</span>), periodicMaintenanceLimit, };
  }


  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}];
  const data = [
    CarActiveResult.total - filterCarActive.length,
    filterCarActive.length,
  ];
  const labels = ["Xe đang hoạt động", "Xe chờ kiểm duyệt"];
  return (
    <section className="bg-gray-100">
      <div className="mt-5 mx-8 ">
        {/* <h2 className=" text-2xl  mt-2 font-mono font-bold mb-5 ">Tổng quan</h2> */}

        <div className=" mb-2 gap-2 mt-2 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400 pl-2">
          Danh sách quản lý
        </div>
    
        <div className="grid grid-cols-1 2xl:grid-cols-5  gap-y-4 2xl:gap-x-4 gap-x-0   mt-4">
          <Card className="col-span-3 ">
            <div className=" gap-2 mt-5  font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Chi tiết xe</p>
            </div>
            <div className="grid gap-10 grid-cols-1 lg:grid-cols-2 mx-10 my-5">
              <Card className=" bg-blue-50 flex gap-5">
              <Link to="/Operator/CarActiveManagement">
                <button className="text-white bg-blue-500 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <TimeToLeaveOutlinedIcon className="text-white h-12 w-12" />
                </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400 font-light"> xe đang hoạt động</p>
                  <p className="text-blue-500 text-lg mt-2 font-bold">{CarActiveResult.total}</p>
                </div>
              </Card>
              <Card className=" bg-yellow-50 flex gap-5">
              <Link to="/Operator/CarMaintenanceInfo">
                <button className="text-white bg-yellow-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <EngineeringOutlinedIcon className="text-white h-12 w-12" />
                </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe tới hạn bảo dưỡng</p>
                  <p className="text-yellow-400 text-lg mt-2 font-bold">  {carmaitance.total}</p>
                </div>
              </Card>
              <Card className=" bg-indigo-100 flex gap-5">
              <Link to="/Operator/CarNeedRegistry">
                <button className="text-white bg-indigo-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <NoCrashOutlinedIcon className="text-white h-12 w-12" />
                </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe tới hạn đăng kiểm</p>
                  <p className="text-indigo-400 text-lg mt-2 font-bold">{CarNeedRegistry.total}</p>
                </div>
              </Card>
            </div>
          </Card>
          {/* <Card className="col-span-2 w-full">
            <div className=" gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Xe</p>
            </div>
            <Card className="mt-2 bg-yellow-50 flex gap-5">
                <button className="text-white bg-yellow-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <EngineeringOutlinedIcon className="text-white h-12 w-12" />
                </button>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe đã bảo dưỡng trong tháng</p>
                  <p className="text-yellow-400 text-lg mt-2 font-bold">2</p>
                </div>
              </Card>
              <Card className="mt-12 bg-indigo-100 flex gap-5">
                <button className="text-white bg-indigo-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <NoCrashOutlinedIcon className="text-white h-12 w-12" />
                </button>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe đã đăng kiểm trong tháng</p>
                  <p className="text-indigo-400 text-lg mt-2 font-bold">3</p>
                </div>
              </Card>
          </Card> */}
          <Card className="col-span-2 w-full">
            <div className=" gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Xe</p>
            </div>
            <DonutChartComponent data={data} labels={labels} />
          </Card>
        </div>
        <div  >
        






</div>
<div className="  gap-y-4 2xl:gap-x-4 gap-x-0   mt-4">
          <Card className="col-span-3 ">
            <div className=" gap-2 mt-5  font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Xe tới hạn bảo dưõng</p>
            </div>
            <div className=" mx-10 my-5">
              <div className=" mt-8">
                <Paper sx={{ overflow: "hidden" }} className="">
                  <TableContainer sx={{ minHeight: 300, maxHeight: 700 }}>
                    <Table component="div" aria-label="sticky table">
                      <TableHead component="div">
                        <TableRow
                          sx={{
                            backgroundColor: "rgb(219 234 254)",
                          }}
                          component="div"
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
                          : rows.map((row, index) => {
                            return (
                              <TableRow
                                component="div"
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                              >
                                {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                    <TableCell
                                      component="div"
                                      key={column.id}
                                      align={column.align}
                                      className="py-[6px] px-3"
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
                    rowsPerPageOptions={[3, 25, 100]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} trên ${count}`
                    }
                    component="div"
                    count={carmaitance.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}