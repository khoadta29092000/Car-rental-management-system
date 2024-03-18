import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../redux/store";

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
    id: "title" | "day" | "carRevenues" | "carExpenses" | "total";
    label: string;
    minWidth?: number;
    witdh?: number;
    align?: "right" | "center";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "title", label: "Lý do", minWidth: 200 },
    { id: "day", label: "Thời gian", minWidth: 100, align: "center", },
    {
        id: "carRevenues",
        label: "Doanh Thu",
        minWidth: 150, align: "center", witdh: 50
    },
    { id: "carExpenses", label: "Chi phí", minWidth: 150, align: "center", witdh: 50 },
    {
        id: "total",
        label: "tổng tiền(Vnđ)",
        minWidth: 150, align: "center",
    },
    // {
    //     id: "Description",
    //     label: "Lý do",
    //     minWidth: 300,
    // },
];

interface Data {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}

export const PopupCarDetail = (props: any) => {
    const { openDad, parentCallback, data, total } = props;
    const handleClose = () => {
        parentCallback(false);
    };
    useEffect(() => {
    }, []);
    const { contractgroup } = useAppSelector(
        (state: RootState) => state.ContractGroup
    );

    function createData(data: any, index: number) {

        let contractDay = contractgroup.contracts.find((x: any) => x.id == data.contractGroupId)
        let day = data.isExpense == true ?  new Date(data.day).toLocaleDateString() : contractDay !== undefined && contractDay.rentFrom !== null
            ? dayjs(contractDay.rentFrom).format('DD/MM/YYYY')
            : "";
        let title = data.isExpense == false ? "Từ hợp đồng" : data.title;
        let carRevenues = data.isExpense == true ? undefined : <CheckCircleOutlineIcon className="text-blue-400" />;
        let carExpenses = data.isExpense == false ? undefined : <CheckCircleOutlineIcon className="text-blue-400" />;
        let total = data.isExpense == false ? formatToVND(data.total) : formatToVND(data.amount);
        let id;
        return { title, day, carRevenues, carExpenses, total, id };
    }
    // const rows = createData(data);
    let newArray: any[] = [];
    if (data.carId != undefined) {
        const expenses = data.carExpenses?.map((expense: any) => ({ ...expense, isExpense: true }));
        const revenues = data.carRevenues?.map((revenue: any) => ({ ...revenue, isExpense: false }));
        newArray = expenses.concat(revenues);
    }
    const rows = newArray != undefined ? newArray.map((data: any, index: number) => {
        return createData(data, index);
    }) : undefined;

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
                            Doanh thu chi tiết từng xe
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                            <Paper component="div" sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer component="div" sx={{ maxHeight: 440 }}>
                                    <Table sx={{
                                        "& .MuiTableCell-root": {
                                            borderLeft: "1px solid rgba(224, 224, 224, 1)"
                                        }
                                    }} component="div" aria-label="sticky table">
                                        <TableHead component="div" >
                                            <TableRow
                                                component="div"
                                                sx={{
                                                    backgroundColor: "rgb(219 234 254)",
                                                }}
                                            >
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{ minWidth: column.minWidth, width: column.witdh }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody component="div" >
                                            <TableRow component="div" className="" style={{ height: '40px' }} >
                                                <TableCell className=" h-10 font-bold px-3 py-1  " align="right" >
                                                    Tổng doanh thu
                                                </TableCell>
                                                <TableCell className=" h-10 font-bold px-3 py-1  " align="center" >

                                                </TableCell>
                                                <TableCell className=" h-10 font-bold px-3 py-1  " align="center" >

                                                </TableCell>
                                                <TableCell className=" h-10 font-bold px-3 py-1  " align="center" >

                                                </TableCell>
                                                <TableCell className=" h-10 font-bold px-3 py-1  " align="center" >
                                                    {total}
                                                </TableCell>
                                            </TableRow>
                                            {rows == undefined ? undefined : rows.map((row: any, index: any) => {
                                                return (
                                                    <TableRow component="div" role="checkbox" tabIndex={-1} key={index}>
                                                        {columns.map((column, index) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell component="div" key={index} align={column.align}>
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
