import AddIcon from "@mui/icons-material/Add";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Tooltip,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { AlertComponent } from "../../Components/AlertComponent";
import { useAppSelector } from "../../hooks";
import { getcarMakeAsyncApi } from "../../redux/CarMakeReducer/CarMakeReducer";
import {
  getCarContractgroupReducercarAsyncApi,
  getCarContractgroupStatusReducercarAsyncApi,
  postCarContractgroupReducercarAsyncApi,
} from "../../redux/ContractgroupReducer/ContractgroupReducer";
import { DispatchType, RootState } from "../../redux/store";
import { PopupRetalcar } from "./PopupRetalcar";
import ProfileTemplate from "./ProfileTemplate";

interface Column {
  id: "stt" | "customer" | "status" | "edit";
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
  { id: "customer", label: "Người thuê", minWidth: 150 },

  {
    id: "status",
    label: "Trạng thái",
    minWidth: 200,
    align: "center",
  },
  { id: "edit", label: "Chi tiết", minWidth: 50 },
];

export default function Profile() {
  const [alert, setAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
    setMessageAlert(childData);
  };
  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);
  const dispatch: DispatchType = useDispatch();
  const { contractgroup, contractgroupstatus, loading } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const [statusContractGr, setStatusContractGr] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 11 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  let filter = {
    pagination: pagination,
    status: statusContractGr === 0 ? "" : statusContractGr,
    id: userProfile.id != null ? userProfile.id : null,
    CitizenIdentificationInfoNumber: null

  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const [open, setOpen] = useState(false);

  const rows = contractgroup.contracts.map((data: any, index: number) => {
    return createData(data, index, page);
  });
  const getContractAPi = () => {
    const actionAsync = getCarContractgroupReducercarAsyncApi(filter);
    dispatch(actionAsync);
  };
  const getContractStatusAPi = () => {
    const actionAsync = getCarContractgroupStatusReducercarAsyncApi();
    dispatch(actionAsync);
  };
  const getAllcarMake = () => {
    const actionAsync = getcarMakeAsyncApi();
    dispatch(actionAsync);
  };
  useEffect(() => {
    getContractStatusAPi();
  }, []);
  useEffect(() => {
    getContractAPi();
  }, [pagination, statusContractGr]);
  const handleClickExport = (event: any) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setAlert("error");
      setMessageAlert("Chỉ nhận file Excel thôi");
      return;
    } else {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          const bufferArray = e.target!.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          resolve(data);
        };
        fileReader.onerror = (errors) => {
          reject(errors);
        };
      });
      promise.then((data: any) => {
        const newData = data.map((item: any) => ({
          ...item,
          userId: 1,
          createDate: new Date(),
        }));
        newData.forEach(async (item: any) => {
          const actionCreateContractGroup =
            postCarContractgroupReducercarAsyncApi(item);
          dispatch(actionCreateContractGroup);
        });
      });
    }
  };

  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  const handleclickAdd = () => {
    setOpen(true);
  };
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
    let id = data.id;
    let customer = (
      <button className="flex gap-2 pointer-events-none   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <PersonOutlineOutlinedIcon className="h-5 w-5" />
        <p className="">{data.customerName}</p>
      </button>
    );
    let status = (
      <p
        className={
          data.contractGroupStatusId == 1 || data.contractGroupStatusId == 5 || data.contractGroupStatusId == 6
            ? "bg-yellow-300 font-semibold text-center text-yellow-700 px-2 py-1 rounded-md mx-auto w-[220px]"
            : data.contractGroupStatusId >= 4
              ? "bg-blue-300 font-semibold text-center text-blue-700 px-2 py-1 rounded-md mx-auto w-[220px]"
              : "bg-red-300 font-semibold text-center text-red-700 px-2 py-1 rounded-md mx-auto w-[220px]"
        }
      >
        {data.contractGroupStatusId == 1
          ? "Đang thẩm định"
          : data.contractGroupStatusId >= 7
            ? "Yêu cầu hoàn tất"
            : data.contractGroupStatusName}
      </p>
    );
    let stt = page * 11 + (index + 1);
    let edit = (
      <Tooltip title="Chi tiết hợp đồng">
        <IconButton>
          <AssignmentOutlinedIcon className="text-gray-400" />
        </IconButton>
      </Tooltip>
    );
    return { customer, id, status, stt, edit };
  }
  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}];
  return (
    <ProfileTemplate>
      <div className="ml-5 font-bold mt-2 mb-5 text-2xl">Quản lý yêu cầu</div>
      <div className="mt-2 md:mx-5 mx-2">
        <div className="lg:flex w-full ">
          <div className="flex mb-2">
            <div className="w-full ">
              <FormControl className=" lg:w-[300px] w-full">
                <InputLabel size="small">Trạng thái hợp đồng</InputLabel>
                <Select
                  size="small"
                  label={"Tình trạng hợp đồng"}
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
          <div className="ml-auto mb-2 h-10 flex justify-between  gap-5">
            <Button
              className=" text-blue-400 hover:text-blue-600  border-blue-200"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleclickAdd}
            >
              Thêm mới
            </Button>
          </div>
        </div>
        <div className=" mt-5 mb-5">
          <Paper component={"div"} sx={{ overflow: "hidden" }} className="">
            <TableContainer
              component={"div"}
              sx={{ minHeight: 580, maxHeight: 700 }}
            >
              <Table component={"div"} stickyHeader aria-label="sticky table">
                <TableHead component={"div"}>
                  <TableRow component={"div"}>
                    {columns.map((column) => (
                      <TableCell
                        component={"div"}
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
                <TableBody component={"div"}>
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
                          component={Link}
                          to={`/profiledetail/${row.id}`}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                component={"div"}
                                key={column.id}
                                align={column.align}
                                className="py-1 px-3"
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
              rowsPerPageOptions={[11, 25, 100]}
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
        <PopupRetalcar
          openRetal={open}
          parentCallback={callbackFunctionPopup}
          parentCallbackAlert={callbackFunctionAlert}
          parentCallbackMessageAlert={callbackFunctionMessageAlert}
        />
      </div>
    </ProfileTemplate>
  );
}
