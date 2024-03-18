import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
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
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AlertComponent } from "../../../Components/AlertComponent";
import { useAppSelector } from "../../../hooks";
import {
  getCarContractgroupReducercarAsyncApi,
  getCarContractgroupStatusReducercarAsyncApi,
} from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import { DispatchType, RootState } from "../../../redux/store";

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

export default function ContractGroupExpertise() {
  const [alert, setAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };

  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);

  const dispatch: DispatchType = useDispatch();
  const { contractgroup, contractgroupstatus, loading } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const [statusContractGr, setStatusContractGr] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [open, setOpen] = useState(false);
  const [RetalDad, setRetalDad] = useState({});

  let filter = {
    pagination: pagination,
    status: statusContractGr === 0 ? "" : statusContractGr,
    id: null,
    CitizenIdentificationInfoNumber: null
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);

  const getContractAPi = () => {
    const actionAsync = getCarContractgroupReducercarAsyncApi(filter);
    dispatch(actionAsync);
  };
  const getContractStatusAPi = () => {
    const actionAsync = getCarContractgroupStatusReducercarAsyncApi();
    dispatch(actionAsync);
  };
  useEffect(() => {
    getContractStatusAPi();
  }, []);
  useEffect(() => {
    getContractAPi();
  }, [pagination, statusContractGr]);

  const handleclickAdd = () => { };

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
    setPagination({ page: 1, pageSize: pagination.pageSize });
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
        {data.contractGroupStatusId < 8
          ? data.contractGroupStatusName
          : "Hợp đồng hoàn thành"}
      </p>
    );
    let stt = page * rowsPerPage + (index + 1);
    const encodedId1 = btoa(data.id);
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

  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}, {}];
  return (
    <div className="mt-5 md:mx-5 mx-2">
      <div className="lg:flex w-full">
        <div className="flex ">
          <div className="w-full">
            <FormControl className=" lg:w-[300px] w-full bg-white">
              <InputLabel size="small">Trạng thái hợp đồng</InputLabel>
              <Select
                size="small"
                label={"Trạng thái hợp đồng"}
                name="requireDescriptionInfoCarBrand"
                className=" w-full "
                onChange={handleChange}
                value={statusContractGr.toString()}
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                {contractgroupstatus.length > 0
                  ? contractgroupstatus.map((model: any) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))
                  : null}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      <div className=" mt-8">
        <Paper sx={{ overflow: "hidden" }} className="">
          <TableContainer sx={{ minHeight: 700, maxHeight: 700 }}>
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
                  : (rows.length > 0 ? rows.map((row, index) => {
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
                  }) :  (
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
                      Không có kết quả nào phụ hợp với yêu cầu của bạn
                    </div>
                  </TableCell>
                </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage={"Số lượng của trang"}
            className=""
            rowsPerPageOptions={[12, 25, 100]}
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

      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>
  );
}
