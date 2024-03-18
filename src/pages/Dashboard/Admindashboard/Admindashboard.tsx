import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import TimeToLeaveOutlinedIcon from "@mui/icons-material/TimeToLeaveOutlined";
import {
  Card,
  MenuItem,
  Select
} from "@mui/material";
import moment from 'moment';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import dayjs from "dayjs";
import {
  getCarNeedRegistryApi,
  getcarAsyncApi,
  getcaractiveAsyncApi,
  getneedmaintainceApi,
} from "../../../redux/CarReducer/CarReducer";
import { getCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { getCustomerinfoReducerAsyncApi } from "../../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { getParkingLotcarAsyncApi } from "../../../redux/ParkingLotReducer/ParkingLotReducer";
import { getUsertAsyncApi } from "../../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../../redux/store";
import LineChart from "./ChartComponent";
import DonutChartComponent from "./DonutChartComponent";
import { getStatisticContractGr } from "../../../redux/StatisticReducer/StatisticReducer";
type Props = {};
function formatToVND(value: any) {
  if (typeof value === "number" && !isNaN(value)) {
    const parts = value.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";
    return integerPart + decimalPart;
  } else {
    return "";
  }
}
export default function Admindashboard() {
  const dataRole = [
    { name: "Sales", id: "SaleStaff" },
    { name: "Thẩm định", id: "ExpertiseStaff" },
    { name: "Điều hành", id: "OperatorStaff" },
    { name: "Admin", id: "Admin" },
  ];
  const [pagination, setPagination] = useState({ page: 1, pageSize: 1 });
  const [statusContractGr, setStatusContractGr] = useState(0);
  let filter = {
    pagination: pagination,
    status: statusContractGr === 0 ? "" : statusContractGr,
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
  const { contractgroup } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { Statistic, loading, StatisticCar } = useSelector(
    (state: RootState) => state.Statistic
  );
  let date = new Date();
  const [month, setMonth] = useState((date.getMonth() + 1).toString());
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
  const [year, setYear] = useState((date.getFullYear()).toString());
  const today = dayjs();
  const myDate = dayjs(`${year}-01-01`);
  const [filterDay, setFilterDay] = useState({
    from: myDate,
    to: today,
  });

  const getAPIStatisticContractGr = () => {
    const actionAsync = getStatisticContractGr(filterDay);
    dispatch(actionAsync);
  };
  useEffect(() => {
    getAPIStatisticContractGr();
    return () => { };
  }, [filterDay]);

  type ExpensesByMonth = {
    [month: string]: {
      count: number;
      total: number;
    };
  }
  const expensesByMonthRef = useRef<ExpensesByMonth>({});



  const [series, setSeries] = useState([
    {
      name: "Tổng đơn",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Tổng doanh thu",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ]);
  const updateSeries = (ExpensesByMonth: ExpensesByMonth) => {
    const newSeries = [...series];
    for (const [key, value] of Object.entries(ExpensesByMonth)) {
      const index = Number(key.slice(5, 7)) - 1;
      newSeries[0].data[index] = value.count;
      newSeries[1].data[index] = value.total;
    }
    setSeries(newSeries);
  }
  useEffect(() => {
    expensesByMonthRef.current = {};
    Statistic.forEach((obj: any) => {
      const month = moment(obj.createdDate).format('YYYY-MM');
      if (expensesByMonthRef.current[month]) {
        expensesByMonthRef.current[month].count += 1;
        expensesByMonthRef.current[month].total += obj.total;
      } else {
        expensesByMonthRef.current[month] = {
          count: 1,
          total: obj.total,
        };
      }
    });
    updateSeries(expensesByMonthRef.current);
  }, [Statistic]);
  // useEffect(() => {
  //   if (expensesByMonthRef) {
  //     updateSeries(expensesByMonthRef);
  //   }
  // }, []);
 

  let etcmoneyUsingSum: number = 0;
  let fuelMoneyUsingUsingSum: number = 0;
  let extraTimeMoneyUsingSum: number = 0;
  let extraKmMoneyUsingSum: number = 0;
  let paymentAmountUsingSum: number = 0;
  let insuranceMoneySum: number = 0;
  let violationMoneySum: number = 0;
  let totalUsingSum: number = 0;

  for (let i = 0; i < Statistic.length; i++) {
    etcmoneyUsingSum += Statistic[i].etcmoneyUsing;
    fuelMoneyUsingUsingSum += Statistic[i].fuelMoneyUsing;
    extraTimeMoneyUsingSum += Statistic[i].extraTimeMoney;
    extraKmMoneyUsingSum += Statistic[i].extraKmMoney;
    paymentAmountUsingSum += Statistic[i].paymentAmount;
    insuranceMoneySum += Statistic[i].insuranceMoney;
    violationMoneySum += Statistic[i].violationMoney;
    totalUsingSum += Statistic[i].total;
  }

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


  function handleChangeYear(value: string) {
    setYear(value);
  }
  function handleChangeMonth(value: string) {
    setMonth(value);
  }
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
              <Link to="/Admin/ContractGroup">
                <button className="text-white bg-gray-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <ShoppingBagOutlinedIcon className="text-teal-400 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-teal-400">
                  {contractgroup.total}
                </div>
                <div className="text-sm mt-3 text-gray-500">Đơn</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang trên hệ thống</div>
              </div>
            </div>
          </Card>
          <Card className="flex   ">
            <div className="">
              <Link to="/Admin/Customerinfo">
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
              <Link to="/Admin/UserManagement">
                <button className="text-white bg-green-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <PersonOutlineOutlinedIcon className="text-green-700 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-green-700">
                  {userList.total}
                </div>
                <div className="text-sm mt-3 text-gray-500">Nhân viên</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang trên hệ thống</div>
              </div>
            </div>
          </Card>
          <Card className="flex  ">
            <div className="">
              <Link to="/Admin/Parking">
                <button className="text-white bg-blue-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <LocalParkingIcon className="text-blue-500 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-blue-500">
                  {ParkingLot.length}
                </div>
                <div className="text-sm mt-3 text-gray-500">Bãi đậu xe</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang hoạt động</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-5  gap-y-4 2xl:gap-x-4 gap-x-0   mt-4">
          <Card className="col-span-3 ">
            <div className=" gap-2 mt-5  font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Chi tiết xe</p>
            </div>
            <div className="grid gap-10 grid-cols-1 lg:grid-cols-2 mx-10 my-5">
              <Card className=" bg-blue-50 flex gap-5">
                <Link to="/Admin/CarManagement">
                  <button className="text-white bg-blue-500 rounded-lg  ml-5 my-[10px] h-20 w-20">
                    <TimeToLeaveOutlinedIcon className="text-white h-12 w-12" />
                  </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400 font-light">Tất cả xe</p>
                  <p className="text-blue-500 text-lg mt-2 font-bold">
                    {CarActiveResult.total}
                  </p>
                </div>
              </Card>
              <Card className=" bg-yellow-50 flex gap-5">
                <Link to="/Admin/CarMaintenanceInfo">
                  <button className="text-white bg-yellow-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                    <EngineeringOutlinedIcon className="text-white h-12 w-12" />
                  </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe tới hạn bảo dưỡng</p>
                  <p className="text-yellow-400 text-lg mt-2 font-bold">
                    {carmaitance.total}
                  </p>
                </div>
              </Card>
              <Card className=" bg-indigo-100 flex gap-5">
                <Link to="/Admin/CarNeedRegistry">
                  <button className="text-white bg-indigo-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                    <NoCrashOutlinedIcon className="text-white h-12 w-12" />
                  </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe tới hạn đăng kiểm</p>
                  <p className="text-indigo-400 text-lg mt-2 font-bold">
                    {CarNeedRegistry.total}
                  </p>
                </div>
              </Card>
            </div>
          </Card>

          <Card className="col-span-2 w-full">
            <div className=" gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Xe</p>
            </div>
            <DonutChartComponent data={data} labels={labels} />
          </Card>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2  gap-5  mt-4 pb-5">
          <Card>
            <div className="  gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-1">Hợp đồng của năm</p>
              <Select
                displayEmpty
                value={year}
                onChange={(e) => handleChangeYear(e.target.value)}
                className="w-24  h-6 outline-none"
                size="small"
                id="outlined-basic"
                variant="outlined"
                name="depositItemAsset"
              >
                {dataYear.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
              <p> theo từng tháng</p>
            </div>

            <div className=" mt-4 text-center">
              <LineChart data={series} />
            </div>
          </Card>
          <Card className="mt-5 xl:mt-0">
            <div className=" gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400 ">
              <p className="ml-1">Tổng doanh thu của tháng</p>
              <Select
                displayEmpty
                value={month}
                onChange={(e) => handleChangeMonth(e.target.value)}
                className="w-16  h-6 outline-none"
                size="small"
                id="outlined-basic"
                variant="outlined"
                name="depositItemAsset"
              >
                {dataMonth.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
              <p>trong năm {year}</p>
            </div>
            <div className=" my-4 ">
              <table className="w-full  mx-5">
                <tbody>
                  <tr className=" bg-blue-500 text-white h-10">
                    <th className="text-right    px-4  ">Chi tiết</th>
                    <th className="  text-left     px-4 ">Đơn vị</th>
                  </tr>
                  <tr className="h-10">
                    <td className=" flex justify-end   px-4 py-2 font-bold">
                      Tổng doanh thu trong tháng
                    </td>
                    <td className="  px-4 py-2 mx-12">{formatToVND(totalUsingSum)} Vnđ</td>
                  </tr>
                  <tr className="h-10 bg-gray-100">
                    <td className=" flex justify-end  px-4 py-2 font-bold">
                      Tổng số đơn hàng trong tháng
                    </td>
                    <td className="  px-4 py-2">{Statistic.length}</td>
                  </tr>
                  <tr className="h-10 ">
                    <td className="flex justify-end   px-4 py-2 font-bold">
                      Tổng tiền phí ETC(Vnđ)
                    </td>
                    <td className="  px-4 py-2">{formatToVND(etcmoneyUsingSum)} Vnđ</td>
                  </tr>
                  <tr className="h-10 bg-gray-100">
                    <td className="flex justify-end   px-4 py-2 font-bold">
                      Tổng tiền phí xăng(Vnđ)
                    </td>
                    <td className="  px-4 py-2">{formatToVND(fuelMoneyUsingUsingSum)} Vnđ</td>
                  </tr>
                  <tr className="h-10">
                    <td className=" flex justify-end  px-4 py-2 font-bold">
                      Tổng tiền quá giờ(Vnđ)
                    </td>
                    <td className="  px-4 py-2">{formatToVND(extraTimeMoneyUsingSum)} Vnđ</td>
                  </tr>
                  <tr className="h-10 bg-gray-100">
                    <td className="flex justify-end   px-4 py-2 font-bold">
                      Tổng tiền quá km(vnđ)
                    </td>
                    <td className="  px-4 py-2">{formatToVND(extraKmMoneyUsingSum)} Vnđ</td>
                  </tr>
                  <tr className="h-10">
                    <td className=" flex justify-end  px-4 py-2 font-bold">
                      Tổng tiền bảo hiểm(vnđ)
                    </td>
                    <td className="  px-4 py-2">{formatToVND(insuranceMoneySum)} Vnđ</td>
                  </tr>
                  <tr className="h-10 bg-gray-100">
                    <td className="flex justify-end   px-4 py-2 font-bold">
                      Tổng tiền vi phạm(vnđ)
                    </td>
                    <td className="  px-4 py-2">{formatToVND(violationMoneySum)} Vnđ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
