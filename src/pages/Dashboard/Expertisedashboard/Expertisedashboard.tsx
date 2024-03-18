import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Card } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { getCarNeedRegistryApi, getcarAsyncApi, getcaractiveAsyncApi, getneedmaintainceApi } from "../../../redux/CarReducer/CarReducer";
import { getCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { getCustomerinfoReducerAsyncApi } from "../../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { getParkingLotcarAsyncApi } from "../../../redux/ParkingLotReducer/ParkingLotReducer";
import { getUsertAsyncApi } from "../../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../../redux/store";
type Props = {};

interface Column {
  id: "stt" | "customer" | "sales" | "status" | "edit" | "rentTo" | "rentFrom";
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
  { id: "customer", label: "Người thuê", minWidth: 250 },
  { id: "sales", label: "Người gửi yêu cầu", minWidth: 200 },
  { id: "rentFrom", label: "Ngày giao xe", minWidth: 200, align: "center", },
  { id: "rentTo", label: "Ngày nhận xe", minWidth: 200, align: "center", },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 200,
    align: "center",
  },
  { id: "edit", label: "Chi tiết", minWidth: 100, align: "center" },
];


export default function Expertisedashboard() {
  let date = new Date();
  const [year, setYear] = useState((date.getFullYear() - 1).toString());
  const [month, setMonth] = useState((date.getMonth() + 1).toString());
  function handleChangeYear(value: string) {
    setYear(value);
  }
  function handleChangeMonth(value: string) {
    setMonth(value);
  }
  let dataYear = ["2022", "2023"];
  let dataMonth = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const [pagination, setPagination] = useState({ page: 1, pageSize: 8 });
  const [statusContractGr, setStatusContractGr] = useState(0);
  let filter = {
    pagination: pagination,
    status: 1,
    id: null,
    CitizenIdentificationInfoNumber: null
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

  const dispatch: DispatchType = useDispatch();
  const { CarResult, CarActiveResult } = useSelector(
    (state: RootState) => state.CarResult
  ); //r
  const { contractgroup , loading } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { userList } = useAppSelector((state: RootState) => state.user);
  const { carmaitance } = useAppSelector((state: RootState) => state.CarResult);
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
      parkingLotId: null
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
  const getAllcarActive = () => {
    const actionAsync = getcaractiveAsyncApi({
      page: 1,
      pageSize: 1000000,
      ...filterCar,
    });
    dispatch(actionAsync);
  };
  const getAllcarmaitance = () => {
    const actionAsync = getneedmaintainceApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
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
    return () => { };
  }, []);
  // let date = new Date();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
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
  const rows = contractgroup.contracts.map((data: any, index: number) => {
    return createData(data, index, page);
  });
  function createData(data: any, index: number, page: number) {
    let id = data.id;
    let sales = (
      <button className="flex gap-2  hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-2xl hover:text-gray-600">
        <EmailOutlinedIcon className="h-5 w-5" />
        <p className="">{data.staffEmail}</p>
      </button>
    );
    const encodedId = btoa(data.citizenIdentificationInfoNumber);

    let customer = (
      <Tooltip title="Chi tiết khách hàng">
        <Link to={`/Expertise/Customerinfo/CustomerinfoDetail/${encodedId}`}>
          <button className="flex gap-2  hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-2xl hover:text-gray-600">
            <PersonOutlineOutlinedIcon className="h-5 w-5" />
            <p className="">{data.customerName}</p>
          </button>
        </Link>
      </Tooltip>
    );

    let status = (
      <p
        className={
          data.contractGroupStatusId == 14 ||
            data.contractGroupStatusId == 2 ||
            data.contractGroupStatusId == 3
            ? "bg-red-300 font-semibold text-center text-red-700 px-2 py-1 rounded-md w-[200px] mx-auto"
            :
            data.contractGroupStatusId == 5 || data.contractGroupStatusId == 6 || data.contractGroupStatusId == 1 ?
              "bg-yellow-300 font-semibold text-center text-yellow-700 px-2 py-1 rounded-md w-[200px] mx-auto" :
              "bg-blue-300 font-semibold text-center text-blue-700 px-2 py-1 rounded-md w-[200px] mx-auto"

        }
      >
        {data.contractGroupStatusId < 9
          ? data.contractGroupStatusName
          : "Hợp đồng hoàn thành"}
      </p>
    );
    let stt = page * rowsPerPage + (index + 1);
    let edit = (
      <Link to={`/Expertise/ContractGroup/ContractGroupDetail/${data.id}`}>
        <Tooltip title="Chi tiết hợp đồng">
          <IconButton>
            <AssignmentOutlinedIcon className="text-gray-400" />
          </IconButton>
        </Tooltip>
      </Link>
    );
    let rentFrom = new Date(data.rentFrom).toLocaleDateString();
    let rentTo = new Date(data.rentTo).toLocaleDateString();
    return { customer, id, sales, status, stt, edit, rentFrom, rentTo };
  }
  let series = [
    {
      name: "Tổng đơn",
      data: [200, 400, 400, 300, 1000, 1100, 1000, 300, 400, 400, 200, 200],
    },
    {
      name: "Tổng doanh thu",
      data: [100, 200, 123, 1512, 123, 123, 1231, 123, 1512, 1232, 200, 200],
    },
  ];

  const filterCarActive = CarActiveResult.cars.filter((item, index) => {
    if (item.carStatus == "Sẵn sàng để thuê") {
      return item;
    }
  });

  const data = [
    CarActiveResult.total - filterCarActive.length,
    filterCarActive.length,
  ];
  const labels = ["Xe đang hoạt động", "Xe chờ kiểm duyệt"];

  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}, {}];
  return (
    <section className="bg-gray-100">
      <div className="mt-5 mx-8 ">
        {/* <h2 className=" text-2xl  mt-2 font-mono font-bold mb-5 ">Tổng quan</h2> */}

        <div className=" mb-2 gap-2 mt-2 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400 pl-2">
          Danh sách quản lý
        </div>
        <div className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-10 mt-4">
          <Card className="flex  ">
            <div className="">
              <Link to="/Expertise/ContractGroup">
                <button className="text-white bg-gray-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <ShoppingBagOutlinedIcon className="text-teal-400 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-teal-400">{contractgroup.total}</div>
                <div className="text-sm mt-3 text-gray-500">Đơn</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">chờ kiểm duyệt</div>
              </div>
            </div>
          </Card>
          <Card className="flex   ">
            <div className="">
              <Link to="/Expertise/Customerinfo">
                <button className="text-white bg-yellow-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <SupervisorAccountOutlinedIcon className="text-yellow-400 h-12 w-12" />
                </button>
              </Link>
            </div>

            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-yellow-400">
                  {customerinfo.length}
                </div>
                <div className="text-sm mt-3 text-gray-500">Khách hàng</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đã thuê xe</div>
              </div>
            </div>
          </Card>

          <Card className="flex  ">
            <div className="">
              <Link to="/Expertise/CarManagement">
                <button className="text-white bg-green-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <PersonOutlineOutlinedIcon className="text-green-700 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-green-700">
                  {CarActiveResult.total}
                </div>
                <div className="text-sm mt-3 text-gray-500">Tất cả xe</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang hoạt động</div>
              </div>
            </div>
          </Card>
          <Card className="flex  ">
            <div className="">
              <Link to="/Expertise/Parking">
                <button className="text-white bg-blue-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <LocalParkingIcon className="text-blue-500 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-blue-500">{ParkingLot.length}</div>
                <div className="text-sm mt-3 text-gray-500">Bãi đậu xe</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang hoạt động</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="  gap-y-4 2xl:gap-x-4 gap-x-0   mt-4">
          <Card className="col-span-3 ">
            <div className=" gap-2 mt-5  font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Đơn yêu cầu thẩm định chưa duyệt</p>
            </div>
            <div className=" mx-10 my-5">
              <div className=" mt-8">
                <Paper sx={{ overflow: "hidden" }} className="">
                  <TableContainer sx={{ minHeight: 520, maxHeight: 700 }}>
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
                    rowsPerPageOptions={[8, 25, 100]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} trên ${count}`
                    }
                    component="div"
                    count={contractgroup.total}
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
  );
}
