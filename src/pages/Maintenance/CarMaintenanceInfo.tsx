import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';
import { Tooltip } from '@mui/material';
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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getneedmaintainceApi } from '../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../redux/store';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
function formatToVND(value: any) {
  if (typeof value === 'number' && !isNaN(value)) {
    const parts = value.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    return integerPart + decimalPart;
  } else {
    return value;
  }
}


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

export default function CarMaintenanceInfo({ }: Props) {
  const dispatch: DispatchType = useDispatch();
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const parkingLotId = userProfile?.parkingLotId;
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,

  });

  const { carmaitance, loading } = useSelector((state: RootState) => state.CarResult); //r
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [isconvert, setIsconvert] = useState(false);
 
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
        pageSize: 12,
      });
    }
  };
  let callbackFunctionPagination = (childData: any) => {

    if (isconvert == false) {
      setPagination({
        page: childData,
        pageSize: 10,
      })
    } else if (isconvert == true) {
      setPagination({
        page: childData,
        pageSize: 12,
      })
    }
  };
  // const getAllcarmaitance = () => {
  //   const actionAsync = getneedmaintainceApi({
  //     page: pagination.page,
  //     pageSize: pagination.pageSize,
  //   }
  //   )
  //   dispatch(actionAsync);
  // }
  let getAllcarmaitance: () => void;

  if (userProfile.role === "OperatorStaff") {
    getAllcarmaitance = () => {
      const actionAsync = getneedmaintainceApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: parkingLotId
      });
      dispatch(actionAsync);
    };
  } else if (userProfile.role === "Admin") {
    getAllcarmaitance = () => {
      const actionAsync = getneedmaintainceApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: null
      });
      dispatch(actionAsync);
    };
  }


  let firstCharacter: string = "";
  useEffect(() => {
    getAllcarmaitance()
  }, [pagination]);
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
  return (
    
    <div className="mt-8 mx-5 " >
            
      <div className="  xl:flex mb-5 w-full">
        <div className="ml-auto flex justify-between flex-wrap  gap-5 ">
        </div>
      </div>
      <div className="">
        <Paper sx={{ overflow: "hidden" }} className="">
          <TableContainer sx={{ minHeight: 740, maxHeight: 700 }}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgb(219 234 254)",
                  }}
                >
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
                    return (
                      <TableRow
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
                      <h2>Chưa có xe nào nào tới hạn bảo dưỡng trong thời gian này</h2>
                      <div className="text-gray-400">
                        Hãy quay lại sau khi có xe tới hạn bảo dưỡng
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
            rowsPerPageOptions={[11, 25, 100]}
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


  )
}