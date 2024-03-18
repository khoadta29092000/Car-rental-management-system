import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';

import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/store';
import { getCustomerinfoByCMNDReducerAsyncApi } from '../../redux/CustomerinfoReducer/CustomerinfoReducer';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import {
  Avatar,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useAppSelector } from '../../hooks';
import Tooltip from "@mui/material/Tooltip";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import { getCarContractgroupReducercarAsyncApi } from '../../redux/ContractgroupReducer/ContractgroupReducer';
type Props = {}
interface Column {
  id: "stt" | "customer" | "sales" | "rentTo" | "rentFrom";
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
  { id: "rentTo", label: "Ngày nhận xe", minWidth: 200, align: "center", },
  { id: "rentFrom", label: "Ngày giao xe", minWidth: 200, align: "center", },
];
export default function CustomerinfoDetail({ }: Props) {
  const dispatch: DispatchType = useDispatch();
  const { customerInfoDetail } = useSelector((state: RootState) => state.customerinfo); //r
  const [statusContractGr, setStatusContractGr] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const { contractgroup, loading } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );


  const rows = contractgroup.contracts.map((data: any, index: number) => {
    return createData(data, index, page);
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

  // const getContractAPi = () => {
  //   const actionAsync = getCarContractgroupReducercarAsyncApi(filter);
  //   dispatch(actionAsync);
  // };
  const param = useParams()
  const getCustomerinfById = () => {
    const decodedId = param.id ? atob(param.id) : "";

    const actionAsync = getCustomerinfoByCMNDReducerAsyncApi(decodedId);
    dispatch(actionAsync);
  }

  const getContractAPi = () => {
    if (param.id) {
    
      const CitizenIdentificationInfoNumber: string = param.id;
      const decodedId = CitizenIdentificationInfoNumber ? atob(CitizenIdentificationInfoNumber) : "";
      const actionAsync = getCarContractgroupReducercarAsyncApi({
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
        status: "",
        id: null,
        CitizenIdentificationInfoNumber: decodedId,
      });
      dispatch(actionAsync);
    }
  }
  useEffect(() => {
    getCustomerinfById()
    getContractAPi();
  }, [pagination])

  function createData(data: any, index: number, page: number) {
    let id = data.id;
    let sales = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <EmailOutlinedIcon className="h-5 w-5" />
        <p className="">{data.staffEmail}</p>
      </button>
    );
    let customer = (
      <button className="flex gap-2   bg-gray-100 px-2 py-1 border-[1px] rounded-2xl ">
        <PersonOutlineOutlinedIcon className="h-5 w-5" />
        <p className="">{data.customerName}</p>
      </button>
    );


    let stt = page * rowsPerPage + (index + 1);

    let rentFrom = new Date(data.rentFrom).toLocaleDateString();
    let rentTo = new Date(data.rentTo).toLocaleDateString();
    return { customer, id, sales, stt, rentFrom, rentTo };
  }





  const [selectedImage, setSelectedImage] = useState(null)

  let firstCharacter: string = "";
  if (customerInfoDetail?.customerName) {
    const words: string[] = customerInfoDetail?.customerName.split(" ");
    const lastName: string = words[words.length - 1];
    firstCharacter = lastName.charAt(0);
  }

  const dataLoad = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},];
  const dataLoadRow = [{}, {}, {}, {}, {},];
  return (
    <div className=" mt-2   ">
      <div className='flex justify-between '>
        {/* <div>
          <Link to="/Admin/Customerinfo" className='flex hover:text-blue-400 cursor-pointer'>
            <div className='mt-6 ml-5 -'>
              <h2 className='text-2xl'>
                <ArrowBackIosNewOutlinedIcon />
                Chi tiết
              </h2>
            </div>
          </Link>
        </div> */}
        <div className="mt-8 ml-6 ">

          <Breadcrumbs className='mx-4 ' aria-label="breadcrumb">
            <NavLink to="/Admin/Customerinfo" className="hover:underline">
              Khách hàng
            </NavLink>
            <Typography className="text-sm" color="text.primary">
              Chi tiết khách hàng
            </Typography>
          </Breadcrumbs>
        </div>
        <div className='flex '>

        </div>
      </div>
      <div className="grid grid-cols-2 relative xl:grid-cols-5  mx-5 ">

        <div className="col-span-5 xl:col-span-2   xl:grid-rows-5 xl:h-300  ">

          <div className="relative shadow-md bg-white shadow-gray-400 rounded-lg border border-gray-300 ">

            <Avatar
              className='mt-2 w-full h-[400px] object-none '
              sx={{
                marginX: "auto",
                borderRadius: "0px",
                fontSize: "100px",
              }}
            >
              {firstCharacter}
            </Avatar>
            <div className='text-center mt-4 font-bold'><h2> {customerInfoDetail?.customerName}</h2> </div>
            <div className='text-center m-4 '><h4>khách hàng</h4> </div>
          </div>
        </div>
        <div className=' col-span-2 xl:col-span-3 relative md:row-span-3 bg-white py-0 md:py-xl:py-0  '>
          <div className=' mx-12'>
            <h2 className='  font-bold  text-2xl '>  <span className="flex items-center">

              Thông tin liên hệ
            </span></h2>
            <div className="mt-2">
              <div className="flex   mx-1">
                <h3 className='font-bold  '>  <EmailOutlinedIcon className="-mt-1 " />    Email:</h3>
                <p className=" mx-1"  >{customerInfoDetail?.customerEmail}  </p>
                {/* <h3 className='font-bold '>  <LocalPhoneOutlinedIcon className="-mt-1 " /> Số điện thoại:</h3>
                <p className=" mx-1 "  > {customerInfoDetail?.phoneNumber} </p> */}
              </div>
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold  '>   <LocationOnOutlinedIcon className="-mt-1 " /> Địa chỉ:</h3>
                <p className=" mx-1"  >{customerInfoDetail?.customerAddress}</p>

              </div>

              <div className="flex mt-4  mx-1">
                <h3 className='font-bold '>  <LocalPhoneOutlinedIcon className="-mt-1 " /> Số điện thoại:</h3>
                <p className=" mx-1 "  > {customerInfoDetail?.phoneNumber} </p>
                {/* <h3 className='font-bold  '>  <EmailOutlinedIcon className="-mt-1 " />    Email:</h3>
                <p className=" mx-1"  >{customerInfoDetail?.customerEmail}  </p> */}
              </div>
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold '>   <LocalPhoneOutlinedIcon className="-mt-1 " /> Số điện thoại người thân:</h3>
                <p className=" mx-1 "  >  {customerInfoDetail?.relativeTel} </p>
              </div>
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold  '><FacebookOutlinedIcon className="-mt-1 " /> Facebook:</h3>
                <p className="mx-1">{customerInfoDetail?.customerSocialInfoFacebook || "Chưa cập nhật thông tin"}</p>
              </div>
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold  '><QuestionAnswerOutlinedIcon className="-mt-1 " />Zalo:</h3>
                <p className="mx-1">{customerInfoDetail?.customerSocialInfoZalo || "Chưa cập nhật thông tin"}</p>
              </div>


            </div>
            <hr className='mt-6  border-black' />
            <h2 className='  font-bold  text-2xl mt-4 '>  <span className="flex items-center">

              GIẤY TỜ TUỲ THÂN
            </span></h2>
            <div >
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold  '><BrandingWatermarkOutlinedIcon className="-mt-1 " />CMND/CCCD:</h3>
                <p className=" mx-1"  >{customerInfoDetail?.citizenIdentificationInfoNumber}</p>
              </div>
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold  '>  <LocationOnOutlinedIcon className="-mt-1 " />Nơi cấp:</h3>
                <p className=" mx-1"  >{customerInfoDetail?.citizenIdentificationInfoAddress}</p>
              </div>
              <div className="flex mt-4  mx-1">
                <h3 className='font-bold'><RestoreOutlinedIcon className="-mt-1" /> Ngày cấp:</h3>
                <p className="mx-1">
                  {customerInfoDetail?.citizenIdentificationInfoDateReceive &&
                    new Date(customerInfoDetail.citizenIdentificationInfoDateReceive).toLocaleDateString("vi-VN")}
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
      <h2 className="mx-1  font-bold text-[#2c2c2c] text-2xl mt-5 ml-2 ">
        <span className=" border-[1px] rounded-lg lg:w-auto bg-blue-200 mx-2 m-5 py-2 px-2 ">Số lần thuê  : {contractgroup.total} </span>
      </h2>
      <div className=" mb-5">
        <div className='p-5'>
          <Paper sx={{ overflow: "hidden" }} className="">
            <TableContainer sx={{ minHeight: 600, maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        sx={{
                          backgroundColor: "rgb(219 234 254)",
                        }}
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

                          key={index}
                          component="tr"
                          role="checkbox"
                          tabIndex={-1}
                        >
                          {dataLoadRow.map((column, index) => {
                            return (
                              <TableCell key={index} component="td">
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
                          key={index}
                          component="tr"
                          role="checkbox"
                          tabIndex={-1}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                className="py-[6px] px-3"
                                component="td"
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
              rowsPerPageOptions={[10, 25, 100]}
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
    </div>
  )
}
