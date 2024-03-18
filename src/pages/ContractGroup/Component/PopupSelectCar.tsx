import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch, useSelector } from "react-redux";
import PopupImage from "../../../Components/PopupImage";
import { useAppSelector } from "../../../hooks";
import { getcarMakeAsyncApi } from "../../../redux/CarMakeReducer/CarMakeReducer";
import { carAction, getcaractiveAsyncApi } from "../../../redux/CarReducer/CarReducer";
import { DispatchType, RootState } from "../../../redux/store";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
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
export const PopupSelectCar = (props: any) => {
  const {
    openDad,
    parentCallback,
    data,
    parentCallbackMessageAlert,
    parentCallbackAlert,
    setCarId,
  } = props;
  const dataSeatNumber = [4, 5, 7];
  const dataColor = ["Đỏ", "Xanh", "Tím", "Vàng", "Trắng", "Xám", "Xanh lá"];
  const dataTrim = ["Số tự động  ", "Số sàn"];
  const [seatNumber, SetSeatNumber] = useState(
    data.requireDescriptionInfoSeatNumber
  );
  const [carMakeID, setCarMakeID] = useState(
    data.requireDescriptionInfoCarBrand
  );

  const [color, setColor] = useState(data.requireDescriptionInfoCarColor);
  const [gearBox, setGearBox] = useState(data.requireDescriptionInfoGearBox);
  const [DateStart, setDateStart] = useState(data.rentFrom);
  const [DateEnd, setDateEnd] = useState(data.rentTo);
  const [checkedSeat, setCheckedSeat] = useState(true);
  const [checkedCarMake, setCheckedCarMake] = useState(true);
  const [checkedColor, setCheckedColor] = useState(true);
  const [checkedGearBox, setCheckedGearBox] = useState(true);
  const dispatch: DispatchType = useDispatch();
  const { carMake } = useSelector((state: RootState) => state.carMake);
  const getAllcarMake = () => {
    const actionAsync = getcarMakeAsyncApi();
    dispatch(actionAsync);
  };
  useEffect(() => {
    getAllcarMake();
  }, []);
  useEffect(() => {
    dispatch(
      getcaractiveAsyncApi({
        page: 1,
        pageSize: 1000,
        carStatusId: 2,
        seatNumber: seatNumber,
        carColor: color,
        DateStart: DateStart,
        DateEnd: DateEnd,
        carMakeName: carMakeID,
      })
    );
  }, [seatNumber, color, carMakeID]);

  const { CarActiveResult } = useAppSelector((state: RootState) => state.CarResult);
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const handleClose = () => {
    parentCallback(false);
  };
  let CloseImg = (childData: any) => {
    setOpenImg(childData);
  };
  const handleClear = () => {
    parentCallback(false);
  };
  const haneleClickOpenImg = (newValue: any) => {
    setImgSrc(newValue);
    setOpenImg(true);
  };
  const haneleSelectCar = (newValue: any) => {
    dispatch(carAction.actionSelectCar(newValue));
    parentCallback(false);
    setCarId(newValue.id);
  };

  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form>
            <PopupImage src={imgSrc} CloseImg={CloseImg} openImg={openImg} />
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Chọn xe khả dụng
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <div className="grid md:grid-cols-2 grid-cols-1 mb-5 gap-5">
                <div className="flex gap-2">
                  <Checkbox
                    checked={checkedSeat}
                    onChange={(e) => setCheckedSeat(!checkedSeat)}
                    {...label}
                    size="small"
                  />
                  <FormControl className="w-full">
                    <InputLabel size="small">Loại xe</InputLabel>
                    <Select
                      size="small"
                      disabled={checkedSeat == true ? true : false}
                      value={seatNumber}
                      onChange={(e) => SetSeatNumber(e.target.value)}
                      label={"Loại xe"}
                    >
                      {dataSeatNumber.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    checked={checkedCarMake}
                    onChange={(e) => setCheckedCarMake(!checkedCarMake)}
                    {...label}
                    size="small"
                  />
                  <FormControl className="w-full">
                    <InputLabel size="small">Hãng xe</InputLabel>
                    <Select
                      disabled={checkedCarMake == true ? true : false}
                      size="small"
                      value={carMakeID}
                      onChange={(e) => setCarMakeID(e.target.value)}
                      label={"Hãng xe"}
                    >
                      <MenuItem value="">Tùy chọn hãng xe</MenuItem>
                      {carMake.map((model: any) => (
                        <MenuItem key={model.id} value={model.name}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    checked={checkedColor}
                    onChange={(e) => setCheckedColor(!checkedColor)}
                    {...label}
                    size="small"
                  />
                  <FormControl className="w-full">
                    <InputLabel size="small">Màu xe</InputLabel>
                    <Select
                      disabled={checkedColor == true ? true : false}
                      size="small"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      label={"Màu xe"}
                    >
                      <MenuItem value="">Tùy chọn màu xe</MenuItem>
                      {dataColor.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    checked={checkedGearBox}
                    onChange={(e) => setCheckedGearBox(!checkedGearBox)}
                    {...label}
                    size="small"
                  />
                  <FormControl className="w-full">
                    <InputLabel size="small">Truyền động</InputLabel>
                    <Select
                      disabled={checkedGearBox == true ? true : false}
                      size="small"
                      value={gearBox}
                      onChange={(e) => setGearBox(e.target.value)}
                      label={"Truyền động"}
                    >
                      <MenuItem value="">Tùy chọn truyền động</MenuItem>
                      {dataTrim.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {CarActiveResult.cars.map((model, index) => (
                <div
                  key={index}
                  className=" md:flex grid md:mx-0 justify-center items-center  gap-5  w-full text-center border-b-[1px] pb-2 mb-2 "
                >
                  <img
                    onClick={() => haneleClickOpenImg(model?.frontImg)}
                    className="h-44 w-40"
                    src={model.frontImg}
                  />
                  <div className="grid md:grid-cols-3">
                    <div className="col-span-2">
                      <div className="flex gap-2">
                        <div className="font-semibold">Biển số xe: </div>
                        <div>{model.carLicensePlates}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="font-semibold">Hãng xe: </div>
                        <div>{model.makeName}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="font-semibold">Tên xe: </div>
                        <div>{model.modelName}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="font-semibold">Số chỗ: </div>
                        <div>{model.seatNumber}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="font-semibold">Màu xe: </div>
                        <div>{model.carColor}</div>
                      </div>
                      {/* <div className="flex gap-2">
                        <div className="font-semibold">
                          Giá tiền theo tháng:{" "}
                        </div>
                        <div>{model.priceForNormalDay}</div>
                      </div> */}
                      <div className="flex gap-2">
                        <div className="font-semibold">Tình trạng xe: </div>
                        <div>{model.carStatus}</div>
                      </div>
                    </div>
                    <div className="md:mt-[145px] mt-2">
                      <Button
                        onClick={() => haneleSelectCar(model)}
                        size="small"
                        className="btn-choose-car "
                        variant="contained"
                        color="success"
                      >
                        Chọn xe
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </DialogContent>
          </form>
        </BootstrapDialog>
      </>
    );
  };
  return <>{renderPopupUI()}</>;
};
