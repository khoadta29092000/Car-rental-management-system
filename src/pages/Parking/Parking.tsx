import React, { useEffect, useState } from 'react'
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Loading from '../../layouts/Layout/Loading';
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { Link } from 'react-router-dom';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import { useDispatch, useSelector } from 'react-redux';
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { MenuItem, Select, Tooltip, Menu } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { getParkingLotcarAsyncApi } from '../../redux/ParkingLotReducer/ParkingLotReducer';
import { DispatchType, RootState } from '../../redux/store';
import { PostModal } from './modal/PostModal';
import { AlertComponent } from '../../Components/AlertComponent';
import { UpdateModal } from './modal/UpdateModal';
//import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
type Props = {}
interface Column {
  id: "stt" | "parkingLotImg" | "address" | "name" | "edit";
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
  {
    id: "parkingLotImg",
    label: "Hình ảnh bãi xe",
    minWidth: 100,
    align: "left",
  },
  { id: "name", label: "Tên bãi xe", minWidth: 150 },
  { id: "address", label: "Địa chỉ bãi xe", minWidth: 150 },

  { id: "edit", label: "Chi tiết", minWidth: 50 },
];



export default function Parking({ }: Props) {
  const userString = localStorage.getItem("user");
  const userProfile = JSON.parse(userString == null ? "" : userString);
  const [isDelete, setIsDelete] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,

  });
  const [messageAlert, setMessageAlert] = useState("");
  const [userDad, setUserDad] = useState({});
  const [alert, setAlert] = useState("");
  const handleClickOpenAdd = () => {
    setOpen1(true);

  };

  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionPopup1 = (childData: any) => {
    setOpen1(childData);
  };
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };

  let firstCharacter: string = "";
  const { message, alertAction, showPopup, ParkingLot, loading } = useSelector((state: RootState) => state.ParkingLot)
  const dispatch: DispatchType = useDispatch();
  const getAllparkinglotdetail = () => {

    const actionAsync = getParkingLotcarAsyncApi()
    dispatch(actionAsync);


  }
  const handleClickOpenUpdate = (ParkingLot: object, id: string) => {
    setOpen(true);
    setUserDad(ParkingLot);
  };
  useEffect(() => {
    getAllparkinglotdetail();
    if (alertAction != "") {
      setAlert(alertAction);
    }
    if (showPopup == false) {
      setOpen(false);
    }
    if (showPopup == false) {
      setOpen1(false);
    }
    if (message != null) {
      setMessageAlert(message);
    }


  }, [alertAction]);
  const [isconvert, setIsconvert] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const rows = ParkingLot.map((data: any, index: number) => {
    return createData(data, index, page);
  });
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPagination({ page: 1, pageSize: +event.target.value });
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setPagination({ page: newPage + 1, pageSize: rowsPerPage });
  };


  function createData(data: any, index: number, page: number) {
    let name = data.name;
    let address = data.address;
    //let parkingLotImg  = <img className=' h-12 w-24 my-5' src={data.parkingLotImg} alt="parkingLotImg" />;
    let id = data.id;
    const encodedId = btoa(data.id);
    let parkingLotImg = userProfile && userProfile.role == "ExpertiseStaff" ?
      (
        <Tooltip title="Chi tiết bãi xe" >
          <Link to={`/Expertise/parking/Parkingdetail/${encodedId}`}>
            <button>
              <img className=' h-12 w-24 my-5' src={data.parkingLotImg} alt="parkingLotImg" />
            </button>
          </Link>
        </Tooltip>

      )
      : (
        <Tooltip title="Chi tiết bãi xe" >
          <Link to={`/Admin/parking/Parkingdetail/${encodedId}`}>
            <button>
              <img className=' h-12 w-24 my-5' src={data.parkingLotImg} alt="parkingLotImg" />
            </button>
          </Link>
        </Tooltip>

      );

    let stt = page * rowsPerPage + (index + 1);

    let edit = (
      <Tooltip title="Chi tiết Xe" >

        <IconButton onClick={() => handleClickOpenUpdate(data, data.id)}>
          <EditOutlinedIcon className="text-gray-400" />

        </IconButton>
        {/* <Link to={`/Admin/CarManagement/CarDetail/${data.id}`}> */}


      </Tooltip>
    );

    return { name, address, parkingLotImg, stt, id, edit };
  }
  const dataLoad = [{}, {}, {}, {}];
  const dataLoadRow = [{}, {}, {}, {}, {}];
  return (
    <div className="mt-5 mx-5">
      <div className="  xl:flex mb-5 w-fulll">
        <div className="flex mb-2">
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
          {/* <Button
        className="text-gray-600  border-gray-400 shadow-lg" 
        variant="outlined"
        startIcon={<ViewListOutlinedIcon />}
        onClick={() => setIsconvert(!isconvert)}
      >
        Trình bày
      </Button> */}
        </div>
      </div>
      {isconvert === false ?
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
        : <div
          className={
            "grid relative mx-12 mt-7 md:mx-0 grid-cols-1 mb-3 gap-5 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3  2xl:grid-cols-5   "

          }
        >
          {ParkingLot.length > 0 ? (
            ParkingLot.map((item) => {
              return (

                <div
                  key={item.id}
                  className={
                    "p-2 shadow-sm  shadow-gray-400  rounded-lg  "

                  }


                >
                  <div className='w-full relative inline-block' >

                    <img
                      className={

                        " object-cover w-full h-[180px] mx-auto  "

                      }
                      src={item?.parkingLotImg}

                      alt="..."

                    />

                  </div>
                  <div className="  ">
                    <LocalParkingIcon className="-mt-1 break-all " />
                    <span className="font-semibold  mx-2"> Bãi xe:</span>
                    {item.name}
                  </div>
                  <div className="my-4 break-all">
                    <LocationOnOutlinedIcon className="-mt-1 " />
                    <span className="font-semibold  mx-2">Địa chỉ:</span>
                    {item.address}
                  </div>

                </div>

              );
            })
          ) : (
            <div className="w-full text-center absolute text-lg mt-20">
              <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png"
                className="h-40 w-40 mx-auto " />
              <h2>Không tìm thấy kết quả nào</h2>
              <div className="text-gray-400">Hãy thử sử dụng các từ khóa chung chung hơn</div>
            </div>
          )}

        </div>
      }

      <PostModal
        openDad={open1}
        parentCallback={callbackFunctionPopup1}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
      />

      <UpdateModal
        openDad={open}
        parentCallback={callbackFunctionPopup}
        userDad={userDad}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
      />
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>

  );
}
