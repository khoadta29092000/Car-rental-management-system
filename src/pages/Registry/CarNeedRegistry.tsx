import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
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
import { getCarNeedRegistryApi } from '../../redux/CarReducer/CarReducer';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { DispatchType, RootState } from '../../redux/store';
type Props = {}
interface Column {
  id: "stt" | "modelName" | "carColor" | "carLicensePlates" | "registrationDeadline" | "edit";
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
    align: "left",
  },
  { id: "modelName", label: "Tên xe", minWidth: 150 },
  { id: "carColor", label: "Màu xe", minWidth: 150 },
  {
    id: "carLicensePlates",
    label: "Biển số xe",
    minWidth: 100,
    align: "left",
  },
  {
    id: "registrationDeadline",
    label: "Hạn cuối đăng kiểm ",
    minWidth: 200,
    align: "center",
  },
  { id: "edit", label: "Chi tiết", minWidth: 100 },
];

export default function CarNeedRegistry({ }: Props) {
  const { CarNeedRegistry, loading } = useSelector((state: RootState) => state.CarResult);

  const [rowsPerPage, setRowsPerPage] = useState(13);
  const [page, setPage] = useState(0);
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const parkingLotId = userProfile?.parkingLotId;
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 13,

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

  const dispatch: DispatchType = useDispatch();

  let getAllcarmaitance: () => void;

  if (userProfile.role === "OperatorStaff") {
    getAllcarmaitance = () => {
      const actionAsync = getCarNeedRegistryApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: parkingLotId
      });
      dispatch(actionAsync);
    };
  } else if (userProfile.role === "Admin") {
    getAllcarmaitance = () => {
      const actionAsync = getCarNeedRegistryApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: null
      });
      dispatch(actionAsync);
    };
  }

  useEffect(() => {
    getAllcarmaitance();
  }, [pagination]);


  const rows = CarNeedRegistry.cars.map((data: any, index: number) => {
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
    let carColor = (<button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
      <ColorLensOutlinedIcon className="h-6 w-6" />
      <p className="">{data.carColor}</p>
    </button>)
    //let registrationDeadline = data.registrationDeadline;
    let formattedSregistrationDeadline = new Date(data.registrationDeadline).toLocaleDateString();

    let carLicensePlates = (

      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-xl ">
        <PaymentOutlinedIcon className="h-6 w-6" />
        <p className="">{data.carLicensePlates.slice(0, 3) + '-' + data.carLicensePlates.slice(3)}</p>
      </button>)
    let id = data.id;
    let stt = page * rowsPerPage + (index + 1);

    let edit;
    if (userProfile.role === "OperatorStaff") {
      edit = (
        <Tooltip title="Chi tiết đăng kiểm">
          <IconButton>
            <Link to={`/Operator/CarNeedRegistry/CarNeedRegistryDetail/${encodedId}`}>
              <EditOutlinedIcon className="text-gray-400" />
            </Link>
          </IconButton>
        </Tooltip>
      );
    } else if (userProfile.role === "Admin") {
      edit = (
        <Tooltip title="Chi tiết đăng kiểm">
          <Link to={`/Admin/CarNeedRegistry/CarNeedRegistryDetail/${encodedId}`}>
            <IconButton>
              <EditOutlinedIcon className="text-gray-400" />
            </IconButton>
          </Link>
        </Tooltip>
      );
    }

    return { modelName, stt, edit, carLicensePlates, id, carColor, registrationDeadline: formattedSregistrationDeadline };
  }
  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}];
  return (
    <div className=" mx-5 mb-5 mt-10 ">
      <Paper sx={{ overflow: "hidden" }} className="">
        <TableContainer sx={{ minHeight: 750, maxHeight: 700 }}>
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
          rowsPerPageOptions={[13, 25, 100]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count}`
          }
          component="div"
          count={CarNeedRegistry.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}