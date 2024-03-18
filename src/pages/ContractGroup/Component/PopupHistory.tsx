import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  styled
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch, useSelector } from "react-redux";
import { getListHistoryAppraisalRecordReducerAsyncApi } from "../../../redux/AppraisalRecordReducer/AppraisalRecordReducer";
import { carAction } from "../../../redux/CarReducer/CarReducer";
import { getRentContractHistoryIdAsyncApi } from "../../../redux/RentContractReducer/RentContractReducer";
import { getUsertAsyncApi } from "../../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../../redux/store";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
function parseTimestampToDateString(timestampStr: string): string {
  const timestamp = new Date(timestampStr);
  const dateStr = timestamp.toLocaleDateString("en-GB");
  return dateStr;
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface Column {
  id: "Date" | "Staff" | "Result" | "Description";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "Date", label: "Thời gian", minWidth: 50 },
  { id: "Staff", label: "Nhân viên", minWidth: 250 },
  {
    id: "Result",
    label: "Kết quả",
    minWidth: 200,
  },
  {
    id: "Description",
    label: "Lý do",
    minWidth: 300,
  },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

export const PopupHistory = (props: any) => {
  const { openDad, parentCallback, data, isAppraisal } = props;
  const dispatch: DispatchType = useDispatch();

  const handleClose = () => {
    parentCallback(false);
  };
  const { AppraisalRecordListHistory } = useSelector(
    (state: RootState) => state.AppraisalRecord
  );
  const { rentContractHistory } = useSelector(
    (state: RootState) => state.rentContract
  );
  const { userList } = useSelector((state: RootState) => state.user);
  let filter = {
    pagination: { page: 1, pageSize: 100000 },
    searchName: "",
    searchEmail: "",
    searchPhoneNumber: "",
  };
  const getHistory = () => {
    const actionAsync = getListHistoryAppraisalRecordReducerAsyncApi(data);
    dispatch(actionAsync);
  };
  const getHistoryRent = () => {
    const actionAsync = getRentContractHistoryIdAsyncApi(data);
    dispatch(actionAsync);
  };
  const getUser = () => {
    const actionAsync = getUsertAsyncApi(filter);
    dispatch(actionAsync);
  };
  useEffect(() => {
    if (isAppraisal == true) {
      getHistory();
    } else if (isAppraisal == false) {
      getHistoryRent();
    }

    getUser();
  }, []);
  const haneleSelectCar = (newValue: any) => {
    dispatch(carAction.actionSelectCar(newValue));
    parentCallback(false);
  };
  function createData(data: any, index: number) {
    let Date =
      isAppraisal == true
        ? parseTimestampToDateString(data.expertiseDate)
        : parseTimestampToDateString(data.createData);
    let Staff = userList.users.map((item: any) => {
      const words: string[] = item.name.trim().split(" ");
      const lastName: string = words[words.length - 1];
      let firstCharacter = lastName.charAt(0);
      if (isAppraisal == true) {
        if (item.id == data.expertiserId)
          return (
            <button
              key={item.id}
              className="flex gap-2  hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-2xl hover:text-gray-600"
            >
              {item.cardImage == null || item.cardImage == "" ? (
                <Avatar className=" h-5 w-5" sx={{}}>
                  {firstCharacter}
                </Avatar>
              ) : (
                <img src={item.cardImage} className="h-5 w-5 rounded-full" />
              )}
              <p className="">{item.name}</p>
            </button>
          );
      } else if (isAppraisal == false) {
        if (item.id == data.representativeId)
          return (
            <button
              key={item.id}
              className="flex gap-2  hover:bg-gray-200 bg-gray-100 px-2 py-1 border-[1px] rounded-2xl hover:text-gray-600"
            >
              {item.cardImage == null || item.cardImage == "" ? (
                <Avatar className=" h-5 w-5" sx={{}}>
                  {firstCharacter}
                </Avatar>
              ) : (
                <img src={item.cardImage} className="h-5 w-5 rounded-full" />
              )}
              <p className="">{item.name}</p>
            </button>
          );
      }
    });
    let Description = (
      <TextField
        disabled
        value={
          isAppraisal == true
            ? data.resultDescription
            : data.cancelReason == null
            ? ""
            : data.cancelReason
        }
        fullWidth
        multiline
        rows={3}
      />
    );
    let Result =
      data.resultOfInfo == false
        ? "thông tin thất bại"
        : data.resultOfCar == false
        ? "Thông tin xe thất bại"
        : isAppraisal == false && data.cancelReason != null
        ? "Thất bại khi thuê xe"
        : "Hoàn thành";
    let id = index;
    return { Date, Staff, Description, Result, id };
  }
  const rows =
    isAppraisal == true
      ? AppraisalRecordListHistory.map((data: any, index: number) => {
          return createData(data, index);
        })
      : rentContractHistory.map((data: any, index: number) => {
          return createData(data, index);
        });

  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="lg"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Lịch sử
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
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
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row: any, index) => {
                        return (
                          <TableRow role="checkbox" tabIndex={-1} key={index}>
                            {columns.map((column, index) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={index} align={column.align}>
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
              </Paper>
            </DialogContent>
          </form>
        </BootstrapDialog>
      </>
    );
  };
  return <>{renderPopupUI()}</>;
};
