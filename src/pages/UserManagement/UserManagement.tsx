import AddIcon from "@mui/icons-material/Add";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PublicOffOutlinedIcon from "@mui/icons-material/PublicOffOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
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
import { AlertComponent } from "../../Components/AlertComponent";
import { PopupUser } from "../../Components/PopupUser";
import { useAppSelector } from "../../hooks";
import Pagination from "../../layouts/Layout/Paginaton";
import {
  deleteProfileAsyncApi,
  getUsertAsyncApi,
  userAction,
} from "../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../redux/store";

interface Column {
  id:
  | "stt"
  | "email"
  | "name"
  | "sdt"
  | "parkingLot"
  | "role"
  | "status"
  | "edit";
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
  { id: "email", label: "Email", minWidth: 150 },
  { id: "name", label: "Họ và tên", minWidth: 200 },
  {
    id: "sdt",
    label: "Số điện thoại",
    minWidth: 150,
    align: "right",
  },

  {
    id: "role",
    label: "Vị trí",
    minWidth: 100,
    align: "left",
  },
  {
    id: "parkingLot",
    label: "Nơi làm việc",
    minWidth: 150,
    align: "right",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 120,
    align: "center",
  },
  { id: "edit", label: "Thao tác", minWidth: 100, align: "center" },
];
export default function UserManagement() {

  const [isPresent, setIsPresent] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [open, setOpen] = useState(false);

  // const [openFilter, setOpenFilter] = useState(false);
  const [alert, setAlert] = useState("");
  const [userDad, setUserDad] = useState({});
  const [messageAlert, setMessageAlert] = useState("");

  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  // let callbackFunctionFilter = (childData: any) => {
  //   setOpenFilter(childData);
  // };

  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  const dispatch: DispatchType = useDispatch();
  const { alertAction, error, message, userList, showPopup, loading } =
    useAppSelector((state: RootState) => state.user);

  const [valueRadio, setValueRadio] = useState(1);
  const [search, setSearh] = useState("");

  const [pagination, setPagination] = useState({ page: 1, pageSize: 12 });
  let filter = {
    pagination: pagination,
    searchName: valueRadio === 1 ? search : "",
    searchEmail: valueRadio === 2 ? search : "",
    searchPhoneNumber: valueRadio === 3 ? search : "",
  };
  let callbackFunctionPagination = (childData: any) => {
    if (isPresent === false) {
      setPagination({
        page: childData,
        pageSize: 12,
      });
    } else if (isPresent === true) {
      setPagination({
        page: childData,
        pageSize: 10,
      });
    }
  };
  const [isSearch, setIsSearch] = useState(false);
  const getUserAPi = () => {
    const actionAsync = getUsertAsyncApi(filter);
    dispatch(actionAsync);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsSearch(!isSearch);
    }
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  const { ParkingLot } = useAppSelector((state: RootState) => state.ParkingLot);
  useEffect(() => {
    getUserAPi();
  }, [pagination, isSearch]);

  const handleClickOpenUpdate = (user: object) => {
    setOpen(true);
    setUserDad(user);
    dispatch(userAction.showPopup());
    setIsAdd(false);
    //frmUser.setValues(user);
  };
  const handleClickOpenAdd = () => {
    setOpen(true);
    dispatch(userAction.showPopup());
    setUserDad("{}");
    setIsAdd(true);
    //frmUser.setValues(user);
  };

  const handleClickOpenDelete = (id: number) => {
    const actionAsyncLogin = deleteProfileAsyncApi(id);
    dispatch(actionAsyncLogin);
  };
  let firstCharacter: string = "";
  const handleClickChangePosition = () => {
    setIsPresent(!isPresent);
    if (!isPresent === false) {
      setPagination({
        page: 1,
        pageSize: 12,
      });
    } else {
      setPagination({
        page: 1,
        pageSize: 10,
      });
    }
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setPagination({ page: newPage + 1, pageSize: rowsPerPage });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const handleClickDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  const open2 = Boolean(anchorEl);
  const open1 = Boolean(anchorEl1);
  const handleClickOpenFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPagination({ page: 1, pageSize: +event.target.value });
    setPage(0);
  };
  const rows = userList.users.map((data: any, index: number) => {
    return createData(data, index, page);
  });

  function createData(data: any, index: number, page: number) {
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
    let role =
      data.role == "Admin"
        ? "Admin"
        : data.role == "ExpertiseStaff"
          ? "Thẩm Định"
          : data.role == "OperatorStaff"
            ? "Điều Hành"
            : "Sale";
    let status = (
      <>
        <div onClick={() => handleClickOpenDelete(data.id)}>
          {data.isDeleted == false ? (
            <Tooltip title="Đang hoạt động">
              <IconButton>
                <PublicOutlinedIcon className="text-blue-400" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Tạm ngưng">
              <IconButton>
                <PublicOffOutlinedIcon className="text-red-400" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </>
    );
    let stt = page * rowsPerPage + (index + 1);
    let edit = (
      <>
        <Tooltip onClick={() => handleClickOpenUpdate(data)} title="Chi tiết">
          <IconButton>
            <EditOutlinedIcon className="text-gray-700" />
          </IconButton>
        </Tooltip>
      </>
    );

    let parkingLot = data.role === "OperatorStaff"
      ? ParkingLot.find(item => item.id === data.parkingLotId)?.name ?? "Đang cập nhật"
      : "Atshare";
    let email = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <EmailOutlinedIcon className="h-5 w-5" />
        <p className="">{data.email}</p>
      </button>
    );
    let id = data.id;
    return { parkingLot, name, sdt, status, stt, edit, role, email, id };
  }
  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}, {}, {}, {}];
  return (
    <div className="mt-5 md:mx-5 mx-2">
      <div className="  lg:flex w-full">
        <div className="flex mb-3">
          <FormControl
            className=" lg:w-auto w-full bg-white  shadow-lg "
            variant="outlined"
          >
            <InputLabel size="small" htmlFor="outlined-adornment-password">
              {valueRadio === 1
                ? "Tìm kiếm theo tên..."
                : valueRadio === 2
                  ? "Tìm kiếm theo email..."
                  : "Tìm kiếm theo số điện thoại..."}
            </InputLabel>
            <OutlinedInput
              onKeyDown={handleKeyDown}
              name="password"
              value={search}
              onChange={(e) => setSearh(e.target.value)}
              id="outlined-adornment-password"
              label={
                valueRadio === 1
                  ? "Tìm kiếm theo tên..."
                  : valueRadio === 2
                    ? "Tìm kiếm theo email..."
                    : "Tìm kiếm theo số điện thoại..."
              }
              size="small"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={() => setIsSearch(!isSearch)}
                  >
                    <SearchOutlinedIcon className="" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Tooltip
            title="Bộ lọc tìm kiếm"
            onClick={handleClickOpenFilter}
            className=" ml-auto md:ml-5 cursor-pointer rounded-full hover:bg-gray-100 p-2 "
          >
            <IconButton>
              <TuneOutlinedIcon className="text-gray-400" />
            </IconButton>
          </Tooltip>

          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open2}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "31ch",
              },
            }}
          >
            <RadioGroup row value={valueRadio}>
              <MenuItem className="w-full">
                <FormControlLabel
                  value={1}
                  onChange={() => {
                    setValueRadio(1);
                    setSearh("");
                    setIsSearch(!isSearch);
                    setAnchorEl(null);
                  }}
                  control={<Radio />}
                  label="Tìm kiếm theo tên"
                />
              </MenuItem>
              <MenuItem className="w-full">
                <FormControlLabel
                  value={2}
                  onChange={() => {
                    setValueRadio(2);
                    setSearh("");
                    setIsSearch(!isSearch);
                    setAnchorEl(null);
                  }}
                  control={<Radio />}
                  label="Tìm kiếm theo Email"
                />
              </MenuItem>
              <MenuItem className="w-full">
                <FormControlLabel
                  value={3}
                  onChange={() => {
                    setValueRadio(3);
                    setSearh("");
                    setIsSearch(!isSearch);
                    setAnchorEl(null);
                  }}
                  control={<Radio />}
                  label="Tìm kiếm theo số điện thoại"
                />
              </MenuItem>
            </RadioGroup>
          </Menu>
        </div>
        <div className="ml-auto mb-2 h-10 flex justify-between  gap-5">
          <Button
            className="text-gray-600 hover:text-green-400  border-gray-400 shadow-lg"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpenAdd}
          >
            Thêm mới
          </Button>

          <Button
            className="text-gray-600  border-gray-400 hover:text-purple-400  shadow-lg"
            variant="outlined"
            startIcon={<ViewListOutlinedIcon />}
            onClick={handleClickChangePosition}
          >
            Trình bày
          </Button>
        </div>
      </div>

      {isPresent === false ? (
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
              rowsPerPageOptions={[12, 25, 100]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} trên ${count}`
              }
              component="div"
              count={userList.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      ) : (
        <div className="grid relative mx-12  md:mx-0 grid-cols-1 mb-3 gap-5 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3  2xl:grid-cols-5 ">
          {userList.users.length > 0 ? (
            userList.users.map((item, index) => {
              if (item?.name) {
                const words: string[] = item.name.trim().split(" ");
                const lastName: string = words[words.length - 1];
                firstCharacter = lastName.charAt(0);
              }
              return (
                <div
                  key={item.id}
                  className={"p-2 shadow-sm  shadow-gray-400  rounded-lg  "}
                >
                  <div className=" w-full relative inline-block ">
                    {item?.cardImage == null || item?.cardImage == "" ? (
                      <Avatar
                        className={" w-full h-[180px]"}
                        sx={{
                          marginX: "auto",
                          borderRadius: "0px",

                          fontSize: "100px",
                        }}
                      >
                        {firstCharacter}
                      </Avatar>
                    ) : (
                      <img
                        className={" object-cover w-full h-[180px] mx-auto "}
                        src={item?.cardImage}
                      />
                    )}
                    <div>
                      {isDelete === true ? (
                        <DeleteOutlinedIcon
                          onClick={() => handleClickOpenDelete(item.id)}
                          className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-red-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px]  border-gray-400 rounded-md  text-black"
                        />
                      ) : (
                        <DriveFileRenameOutlineOutlinedIcon
                          onClick={() => handleClickOpenUpdate(item)}
                          className="bs  absolute top-0 right-0  mt-2 mx-2 items-start flex-nowrap    m-2 hover:text-blue-400 cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px]  border-gray-400 rounded-md  text-black"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="  ">
                      <PersonOutlineOutlinedIcon className="-mt-1 break-all " />
                      <span className="font-semibold  mx-2">Họ và Tên :</span>
                      {item.name}
                    </div>
                    <div className="my-4 break-all">
                      <LocalPhoneOutlinedIcon className="-mt-1 " />
                      <span className="font-semibold  mx-2">
                        Số điện thoại :
                      </span>
                      {item.phoneNumber}
                    </div>
                    <div className="my-4 break-all ">
                      <EmailOutlinedIcon className="-mt-1 " />
                      <span className="font-semibold  mx-2">Email :</span>
                      {item.email}
                    </div>
                    <div className="my-4 break-all">
                      <BadgeOutlinedIcon className="-mt-1 " />
                      <span className="font-semibold  mx-2">Vị trí :</span>
                      {item.role}
                    </div>
                  </div>

                </div>
              );
            })

          ) : (
            <div className="w-full text-center absolute text-lg mt-20">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Fdownload.svg2561bc28-0cfc-4d75-b183-00387dc91474?alt=media&token=cc09aed8-ccd7-4d8a-ba3c-0b4ace899f40"
                className="h-40 w-40 mx-auto "
              />
              <h2>Không tìm thấy kết quả nào</h2>
              <div className="text-gray-400">
                Hãy thử sử dụng các từ khóa chung chung hơn
              </div>
            </div>
          )}

        </div>
      )}

      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
      {userList.users.length > 0 && isPresent == true ? (
        <Pagination
          className=""
          pagination={pagination}
          total={userList.total}
          onPageChange={callbackFunctionPagination}
        />
      ) : undefined}
      <PopupUser
        openDad={open}
        userDad={userDad}
        isAdd={isAdd}
        isProfile={false}
        error={error}
        parentCallback={callbackFunctionPopup}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
      />
    </div>
  );
}
