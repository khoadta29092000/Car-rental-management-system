import {
  SelectChangeEvent,
  Tooltip
} from "@mui/material";
import { useEffect, useState } from "react";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AlertComponent } from "../../Components/AlertComponent";
import { useAppSelector } from "../../hooks";
import { getCustomerinfoReducerAsyncApi } from "../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { DispatchType, RootState } from "../../redux/store";
interface Column {
  id:
    | "stt"
    | "customer"
    | "phoneNumber"
    | "customerAddress"
    | "customerEmail"
    | "edit";
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
  { id: "customer", label: "Tên khách hàng ", minWidth: 150 },
  { id: "phoneNumber", label: "Số điện thoại ", minWidth: 150 },
  {
    id: "customerEmail",
    label: "Địa chỉ email",
    minWidth: 50,
    align: "left",
  },
  {
    id: "customerAddress",
    label: "Địa chỉ nhà",
    minWidth: 100,
    align: "left",
  },
  { id: "edit", label: "Chi tiết", minWidth: 50 },
];

export default function Customerinfo() {
  const [alert, setAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };

  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);

  const dispatch: DispatchType = useDispatch();
  //const { contractgroup, contractgroupstatus } = useAppSelector((state: RootState) => state.ContractGroup);

  const [statusContractGr, setStatusContractGr] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 11 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(11);

  const { customerinfo, loading } = useAppSelector(
    (state: RootState) => state.customerinfo
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const rows = customerinfo.map((data: any, index: number) => {
    return createData(data, index, page);
  });

  const getcustomerinfoApi = () => {
    const actionAsync = getCustomerinfoReducerAsyncApi();
    dispatch(actionAsync);
  };
  useEffect(() => {
    getcustomerinfoApi();
  }, [pagination, statusContractGr]);

  const handleclickAdd = () => {};

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
  const handleClickOpenFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setStatusContractGr(parseInt(event.target.value as string));
  };
  function createData(data: any, index: number, page: number) {
    let id = data.citizenIdentificationInfoNumber;
    let customer = data.customerName;
    let phoneNumber = data.phoneNumber;
    let customerAddress = data.customerAddress;
    let customerEmail = data.customerEmail;
    let stt = page * rowsPerPage + (index + 1);
    let edit = <AssignmentOutlinedIcon />;
    const encodedId = btoa(data.citizenIdentificationInfoNumber);
    
    if (userProfile.role === "ExpertiseStaff") {
      edit = (
        <Tooltip title="Chi tiết đăng kiểm">
         
            <Link to={`/Expertise/Customerinfo/CustomerinfoDetail/${encodedId}`}>
              <AssignmentOutlinedIcon className="text-gray-400" />
            </Link>
         
        </Tooltip>
      );
    } else if (userProfile.role === "Admin") {
      edit = (
        <Tooltip title="Chi tiết đăng kiểm">
              <Link to={`/Admin/Customerinfo/CustomerinfoDetail/${encodedId}`}>
         
              <AssignmentOutlinedIcon className="text-gray-400" />
         
          </Link>
        </Tooltip>
      );
    }
    return {
      customer,
      id,
      phoneNumber,
      customerAddress,
      stt,
      edit,
      customerEmail,
    };
  }
  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}];
  return (
    <div className="mt-14 md:mx-5 mx-2">
      <div className="mt-5 mb-5">
        <Paper sx={{ overflow: "hidden" }} className="">
          <TableContainer sx={{ minHeight: 700, maxHeight: 700 }}>
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
                      <TableRow role="checkbox" tabIndex={-1} key={index}>
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
                      <TableRow role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
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

      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>
  );
}
