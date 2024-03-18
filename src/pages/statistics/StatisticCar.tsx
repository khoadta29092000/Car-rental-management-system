import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import {
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { useAppSelector } from "../../hooks";
import { getCarContractgroupReducercarAsyncApi } from "../../redux/ContractgroupReducer/ContractgroupReducer";
import { carExpensesResult, carRevenuesResult, getStatisticCar, getStatisticContractGr } from "../../redux/StatisticReducer/StatisticReducer";
import { DispatchType, RootState } from "../../redux/store";
import { PopupCarDetail } from "./PopupCarDetail";
import moment from 'moment';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  id:
  "Day"
  | "contractGroupId"
  | "etcmoneyUsing"
  | "fuelMoneyUsing"
  | "extraTimeMoney"
  | "extraKmMoney"
  | "paymentAmount"
  | "total";
  label: string;
  minWidth?: number;
  align?: "left" | "center";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  {
    id: "Day",
    label: "stt",
    minWidth: 100,
    align: "center",
  },
  {
    id: "contractGroupId",
    label: "Xe",
    minWidth: 120,
    align: "center",
  },
  {
    id: "etcmoneyUsing",
    label: "Tiền ETC(Vnđ)",
    minWidth: 150,
    align: "center",
  },
  {
    id: "fuelMoneyUsing",
    label: "Tiền xăng(Vnđ)",
    minWidth: 150,
    align: "center",
  },
  {
    id: "extraTimeMoney",
    label: "Tiền quá giờ(Vnđ)",
    minWidth: 200,
    align: "center",
  },
  {
    id: "extraKmMoney",
    label: "Tiền quá Km(Vnđ)",
    minWidth: 200,
    align: "center",
  },
  {
    id: "paymentAmount",
    label: "Tiền thuê xe(Vnđ)",
    minWidth: 200,
    align: "center",
  },
  { id: "total", label: "Tổng tiền(Vnđ)", minWidth: 200, align: "center" },
];

interface ColumnCar {
  id:
  "stt"
  | "Car"
  | "carExpenses"
  | "carRevenues"
  | "carTotal"
  | "action";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center";
  format?: (value: number) => string;
}
const columnsCar: readonly ColumnCar[] = [
  {
    maxWidth: 50,
    id: "stt",
    label: "#",
    minWidth: 50,
    align: "center",
  },
  {
    maxWidth: 150,
    id: "Car",
    label: "Xe",
    minWidth: 150,
    align: "center",
  },
  {
    id: "carRevenues",
    label: "Doanh thu(Vnđ)",
    minWidth: 150,
    align: "center",
  },
  {
    id: "carExpenses",
    label: "Chi phí(Vnđ)",
    minWidth: 150,
    align: "center",
  },
  {
    id: "carTotal",
    label: "Lợi nhuận(Vnđ)",
    minWidth: 150,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 100,
    align: "center",
    maxWidth: 100,
  },
];


export default function StatisticCar() {
  const dispatch: DispatchType = useDispatch();
  const { Statistic, loading, StatisticCar } = useSelector(
    (state: RootState) => state.Statistic
  );
  const carExpenses = StatisticCar.reduce((acc: any, curr: any) => {
    if (curr.carExpenses.length > 0) {
      return acc.concat(curr.carExpenses);
    }
    return acc;
  }, []);
  const carRevenues = StatisticCar.reduce((acc: any, curr: any) => {
    if (curr.carRevenues.length > 0) {
      return acc.concat(curr.carRevenues);
    }
    return acc;
  }, []);
  type ExpensesByMonth = {
    [month: string]: {
      count: number;
      total: number;
    };
  }
  const expensesByMonth: ExpensesByMonth = {};
  carExpenses.forEach((obj: any) => {
    const month = moment(obj.day).format('YYYY-MM');
    if (expensesByMonth[month]) {
      expensesByMonth[month].count += 1;
      expensesByMonth[month].total += obj.amount;
    } else {
      expensesByMonth[month] = {
        count: 1,
        total: obj.amount,
      };
    }
  });
 

  let date = new Date();
  const [value, setValue] = React.useState(0);
  const today = dayjs();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [pageCar, setPageCar] = useState(0);
  const [rowsPerPageCar, setRowsPerPageCar] = useState(12);
  const [year, setYear] = useState((date.getFullYear() - 1).toString());
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
  const [openPopup, setOpenPopup] = useState(false);
  const [carPopup, setCarPopup] = useState({});
  const [carTotalPopup, setCarTotalPopup] = useState("");
  let callbackFunctionCar = (childData: any) => {
    setOpenPopup(childData);
    setCarPopup({});
    setCarTotalPopup("");
  };

  function hanleClickDetail(newValue: any, carTotal: string) {
    setOpenPopup(true);
    setCarPopup(newValue);
    setCarTotalPopup(carTotal);
  };
  function handleClickExcel() {
    let dataExcel = value == 0 ? Statistic.map(item => {
      let contractDay = contractgroup.contracts.find((x: any) => x.id == item.contractGroupId)
      let contractDayFormatted = contractDay ? dayjs(contractDay.rentFrom).format('DD/MM/YYYY') : "Không tìm thấy thông tin hợp đồng";
      return (
        {
          "Ngày": contractDayFormatted, "Hợp đồng": item.contractGroupId, "Tiền ETC(Vnđ)": formatToVND(item.etcmoneyUsing), "Tiền xăng(Vnđ)": formatToVND(item.fuelMoneyUsing),
          "Tiền quá giờ(Vnđ)": formatToVND(item.extraTimeMoney), "Tiền quá Km(Vnđ)": formatToVND(item.extraKmMoney), "Tiền thuê xe(Vnđ)": formatToVND(item.paymentAmount)
          , "Tổng tiền(Vnđ)": formatToVND(item.total),
        }
      )
    }) : StatisticCar.map(item => {

      const carExpenses: carExpensesResult[] = item.carExpenses.map(item => ({
        id: item.id,
        carId: item.carId,
        title: item.title,
        day: item.day,
        amount: item.amount,
      }))
      const carRevenues: carRevenuesResult[] = item.carRevenues.map(item => ({
        id: item.id,
        contractGroupId: item.contractGroupId,
        total: item.total,
      }))
    
      // const carExpensesTotal = item.carExpenses.reduce((total: number, expense: any) => total + expense.amount, 0)
      const carExpensesTotal = carExpenses.reduce((total: number, expense: carExpensesResult) => total + expense.amount, 0);
      let carExpensesTotalne = formatToVND(carExpensesTotal);
      const carRevenuesTotal = carRevenues.reduce((total: number, expense: carRevenuesResult) => total + expense.total, 0);
      let carRevenuesTotalne = formatToVND(carRevenuesTotal);
      // const carRevenuesTotal = item.carRevenues.reduce((total: any, revenue: any) => total + revenue.total, 0)
      // let carRevenues = formatToVND(carRevenuesTotal);
      let carTotal = formatToVND(carRevenuesTotal - carExpensesTotal);
      return (
        {
          "Xe": item.carLicensePlates, "Doanh thu": carRevenuesTotalne, "Chi phí": carExpensesTotalne, "Lợi nhuận": carTotal,
        }
      )
    })
    let lastData = value == 0 ? [...dataExcel, {
      "Ngày": "Tổng Doanh thu", "Hợp đồng": "", "Tiền ETC(Vnđ)": formatToVND(etcmoneyUsingSum), "Tiền xăng(Vnđ)": formatToVND(fuelMoneyUsingUsingSum),
      "Tiền quá giờ(Vnđ)": formatToVND(extraTimeMoneyUsingSum), "Tiền quá Km(Vnđ)": formatToVND(extraKmMoneyUsingSum), "Tiền thuê xe(Vnđ)": formatToVND(paymentAmountUsingSum)
      , "Tổng tiền(Vnđ)": formatToVND(totalUsingSum),
    }] : [...dataExcel, {
      "Xe": "Tổng Doanh thu", "Doanh thu": formatToVND(carRevenuesTotal), "Chi phí": formatToVND(carExpensesTotal), "Lợi nhuận": formatToVND(carRevenuesTotal - carExpensesTotal),
    }];

    const worksheet = XLSX.utils.json_to_sheet(lastData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert workbook to array buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save the file with file name
    const fileName = `Thống kê  ${value == 0 ? "hợp đồng" : "xe"} từ ${dayjs(filter.from).format('DD/MM/YYYY')} đến ${dayjs(filter.to).format('DD/MM/YYYY')}.xlsx`;
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
  const { contractgroup } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10000 })
  let filterContract = {
    pagination: pagination,
    status: "",
    id: null,
    CitizenIdentificationInfoNumber: null,
  };
  const getContractAPi = () => {
    const actionAsync = getCarContractgroupReducercarAsyncApi(filterContract);
    dispatch(actionAsync);
  };
  useEffect(() => {
    getContractAPi();
  }, []);
  const myDate = dayjs('2000-09-29');

  const [filter, setFilter] = React.useState({
    from: myDate,
    to: today,
  });
  const handleChangeStartDay = (newValue: any) => {
    setFilter({ from: newValue, to: filter.to });
  };
  const handleChangeEndDay = (newValue: any) => {
    setFilter({ from: filter.from, to: newValue });
  };
  const getAPIStatisticContractGr = () => {
    const actionAsync = getStatisticContractGr(filter);
    dispatch(actionAsync);
  };
  const getAPIStatisticCar = () => {
    const actionAsync = getStatisticCar(filter);
    dispatch(actionAsync);
  };
  useEffect(() => {
    getAPIStatisticContractGr();
    getAPIStatisticCar();
    return () => { };
  }, [filter]);
  const rowsCar = StatisticCar.map((data: any, index: number) => {
    return createDataCar(data, index);
  });
  function createDataCar(data: any, index: number) {
    let stt = index + 1;
    let Car = (
      <button className="flex gap-2 mx-auto w-[130px] text-center  hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-xl hover:text-gray-600">
        <PaymentOutlinedIcon className="h-6 w-6" />
        <p className="">
          {data.carLicensePlates.slice(0, 3) +
            "-" +
            data.carLicensePlates.slice(3)}
        </p>
      </button>
    );
    const carExpensesTotal = data.carExpenses.reduce((total: any, expense: any) => total + expense.amount, 0)
    let carExpenses = formatToVND(carExpensesTotal);
    const carRevenuesTotal = data.carRevenues.reduce((total: any, revenue: any) => total + revenue.total, 0)
    let carRevenues = formatToVND(carRevenuesTotal);

    let carTotal = formatToVND(carRevenuesTotal - carExpensesTotal);
    // let Day;
    let action =
      (
        <Tooltip onClick={() => hanleClickDetail(data, carTotal)} title="Chi tiết">
          <IconButton>
            <RemoveRedEyeOutlinedIcon className="" />
          </IconButton>
        </Tooltip>
      );
    return {
      stt,
      Car,
      carExpenses,
      carRevenues,
      carTotal,
      action,
    };
  }

  const rows = Statistic.map((data: any, index: number) => {
    return createData(data, index);
  });
  function createData(data: any, index: number) {
    let id = data.id;
    let contractGroupId = data.contractGroupId;
    let etcmoneyUsing = formatToVND(data.etcmoneyUsing);
    let fuelMoneyUsing = formatToVND(data.fuelMoneyUsing);
    let extraTimeMoney = formatToVND(data.extraTimeMoney);
    let extraKmMoney = formatToVND(data.extraKmMoney);
    let paymentAmount = formatToVND(data.paymentAmount);
    let total = formatToVND(data.total);
    let contractDay = contractgroup.contracts.find((x: any) => x.id == data.contractGroupId)

    let Day: string = contractDay !== undefined && contractDay.rentFrom !== null
      ? dayjs(contractDay.rentFrom).format('DD/MM/YYYY')
      : "";
    // let Day;
    return {
      Day,
      contractGroupId,
      etcmoneyUsing,
      fuelMoneyUsing,
      extraTimeMoney,
      extraKmMoney,
      paymentAmount,
      total,
      id,
    };
  }
  let carExpensesTotal = 0;
  let carRevenuesTotal = 0;
  StatisticCar.forEach((car: any) => {
    carExpensesTotal += car.carExpenses.reduce((total: any, expense: any) => total + expense.amount, 0);
    carRevenuesTotal += car.carRevenues.reduce((total: any, revenue: any) => total + revenue.total, 0);
  });
  let etcmoneyUsingSum: number = 0;
  let fuelMoneyUsingUsingSum: number = 0;
  let extraTimeMoneyUsingSum: number = 0;
  let extraKmMoneyUsingSum: number = 0;
  let paymentAmountUsingSum: number = 0;
  let totalUsingSum: number = 0;
  for (let i = 0; i < Statistic.length; i++) {
    etcmoneyUsingSum += Statistic[i].etcmoneyUsing;
    fuelMoneyUsingUsingSum += Statistic[i].fuelMoneyUsing;
    extraTimeMoneyUsingSum += Statistic[i].extraTimeMoney;
    extraKmMoneyUsingSum += Statistic[i].extraKmMoney;
    paymentAmountUsingSum += Statistic[i].paymentAmount;
    totalUsingSum += Statistic[i].total;
  }
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
  const handleChangePageCar = (event: unknown, newPage: number) => {
    setPageCar(newPage);
    // setPagination({ page: newPage + 1, pageSize: rowsPerPage });
  };
  const handleChangeRowsPerPageCar = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPageCar(+event.target.value);
    // setPagination({ page: 1, pageSize: +event.target.value });
    setPageCar(0);
  };
  const dataLoad = [{}, {}, {}, {},];
  const dataLoadCar = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}];
  const dataLoadRowCar = [{}, {}, {}, {}, {}, {}];

  const buttonView = () => (
    <div className="lg:flex gap-5">


      <div className="ml-auto">
        <Button
          className="text-gray-600 h-10 border-gray-400 hover:text-green-700"
          variant="outlined"
          startIcon={<SystemUpdateAltIcon />}
          component="label"
          onClick={handleClickExcel}
        >
          Xuất Excel
        </Button>
      </div>
    </div>
  );

  return (

    <div className='m-5'>
      <Card className='p-5'>
        <div className="">
          <h2 className="uppercase text-xl text-[#2c2c2c] font-medium mb-2">Doanh thu chi tiết</h2>
          <Paper sx={{ overflow: "hidden" }} className="">
            <TableContainer sx={{ minHeight: 700 }}>
              <Table sx={{
                "& .MuiTableCell-root": {
                  borderLeft: "1px solid rgba(224, 224, 224, 1)"
                }
              }} component="div" aria-label="sticky table">
                <TableHead component="div">
                  <TableRow
                    sx={{
                      backgroundColor: "rgb(219 234 254)",
                    }}
                    component="div"
                  >
                    {columnsCar.map((column) => (
                      <TableCell
                        component="div"
                        key={column.id} // <-- unique key prop
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        className="font-bold py-1"
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      backgroundColor: "rgb(219 234 254)",
                    }}
                    component="div"
                  >
                    <TableCell
                      component="div"
                      className="font-bold py-1 text-center"
                    >
                      [1]
                    </TableCell>
                    <TableCell
                      component="div"
                      className="font-bold py-1 text-center"
                    >
                      [2]
                    </TableCell>
                    <TableCell
                      component="div"
                      className="font-bold py-1 text-center"
                    >
                      [3]
                    </TableCell>
                    <TableCell
                      component="div"
                      className="font-bold py-1 text-center"
                    >
                      [4]
                    </TableCell>
                    <TableCell
                      component="div"
                      className="font-bold py-1 text-center"
                    >
                      [5=3-4]
                    </TableCell>
                    <TableCell
                      component="div"
                      className="font-bold py-1 text-center"
                    >
                      [6]
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody component="div">
                  {loading == true ? (
                    dataLoadCar.map((row, index) => {
                      return (
                        <TableRow
                          component="div"
                          role="checkbox"
                          tabIndex={-1}
                          key={index} // <-- unique key prop
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
                  ) : (
                    <>
                      <TableRow component="div" className="" style={{ height: '40px' }} >
                        <TableCell className=" h-10 font-bold px-3 py-1  " align="right" colSpan={2}>
                          <div className="">
                            Tổng doanh thu
                          </div>
                        </TableCell>
                        <TableCell component="div" align="center" className=" h-10 font-bold py-1 " colSpan={1}>
                          {formatToVND(carRevenuesTotal)}
                        </TableCell>
                        <TableCell component="div" align="center" className=" h-10 font-bold py-1" colSpan={1}>
                          {formatToVND(carExpensesTotal)}
                        </TableCell>
                        <TableCell component="div" align="center" className=" h-10 font-bold py-1" colSpan={1}>
                          {formatToVND(carRevenuesTotal - carExpensesTotal)}
                        </TableCell>
                        <TableCell component="div" align="center" className=" h-10 font-bold py-1" colSpan={1}>

                        </TableCell>

                      </TableRow>
                      {((rowsPerPage > 0
                        ? rowsCar.slice(pageCar * rowsPerPageCar, pageCar * rowsPerPageCar + rowsPerPageCar)
                        : rowsCar
                      )).map((row, index) => {
                        return (
                          <>
                            <TableRow
                              component="div"
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                            >
                              {columnsCar.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    component="div"
                                    key={column.id}
                                    align={column.align}
                                    className="h-10 py-1 px-3"

                                  >
                                    {column.format &&
                                      typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          </>
                        );
                      })}
                    </>
                  )}
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
              count={Statistic.length}
              rowsPerPage={rowsPerPageCar}
              page={page}
              onPageChange={handleChangePageCar}
              onRowsPerPageChange={handleChangeRowsPerPageCar}
            />
          </Paper>
        </div>
        <PopupCarDetail
          openDad={openPopup}
          parentCallback={callbackFunctionCar}
          data={carPopup}
          total={carTotalPopup}
        />
      </Card>
    </div >
  );
}
