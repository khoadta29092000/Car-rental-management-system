import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import {
  getProfileAsyncApi,
  userAction,
} from "../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../redux/store";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import { AlertComponent } from "../../Components/AlertComponent";
import { PopupUser } from "../../Components/PopupUser";
import Loading from "../../layouts/Layout/Loading";
import { getByIdCarContractgroupReducercarAsyncApi } from "../../redux/ContractgroupReducer/ContractgroupReducer";

//popup

export default function ProfileTemplate(props: any) {
  const { id } = useParams();
  const [alert, setAlert] = useState("");
  const { userLogin } = useAppSelector((state: RootState) => state.login);
  const { user, loading, Profile, error } = useAppSelector(
    (state: RootState) => state.user
  );
  const [messageAlert, setMessageAlert] = useState("");
  const dispatch: DispatchType = useDispatch();
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const [open, setOpen] = React.useState(false);
  const getContractByIdAPi = () => {
    if (id != undefined) {
      const actionAsync = getByIdCarContractgroupReducercarAsyncApi(
        parseInt(id)
      );
      dispatch(actionAsync).then((response) => {
        if (response.payload != undefined) {
        }
      });
    }
  };
  const getProfileAPI = () => {
    dispatch(getProfileAsyncApi(userProfile.id));
  };

  useEffect(() => {
    getContractByIdAPi();
  }, []);
  useEffect(() => {
    //call api
    if (userLogin === null) {
      dispatch(userAction.userLogin());
    } else {
    }
  }, []);

  const handleClickOpen = (user: any) => {
    setOpen(true);
    dispatch(userAction.showPopup());
    //frmUser.setValues(user);
  };

  let firstCharacter: string = "";
  if (user?.name) {
    const words: string[] = user.name.split(" ");
    const lastName: string = words[words.length - 1];
    firstCharacter = lastName.charAt(0);
  }

  function formatDate(date: any) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  let callbackFunctionMessageAlert = (childData: any) => {
    setMessageAlert(childData);
  };
  return loading === true ? (
    <Loading />
  ) : (
    <div className="max-w-[1500px] mx-auto  ">
      <div className="grid  grid-cols-2 relative  xl:grid-cols-7 gap-5 mx-5 ">
        <div className="col-span-5 t-5 xl:col-span-2   grid md:grid-cols-2 xl:grid-cols-1  grid-rows-1 xl:grid-rows-5   xl:h-[800px]   gap-5 ">
          <div className="row-span-3 relative shadow-md bg-white  shadow-gray-400 border-[1px] rounded-lg border-gray-300">
            {userProfile?.cardImage === null ||
            userProfile?.cardImage === "" ? (
              <Avatar
                sx={{
                  height: "200px",
                  width: "280px",
                  marginX: "auto",
                  borderRadius: "0px",
                  marginY: "8px",
                  fontSize: "100px",
                }}
              >
                {firstCharacter}
              </Avatar>
            ) : (
              <img
                className="p-2  h-[220px] w-[280px]  mx-auto  z-0 object-cover "
                src={userProfile?.cardImage}
              />
            )}
            <div
              onClick={() => handleClickOpen(userProfile)}
              className="z-10 absolute right-5  top-[220px] pb-[4px] px-[4px]  cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
            >
              <EditOutlinedIcon
                fontSize="small"
                className="hover:text-blue-400"
              />
            </div>
            <h2 className="text-center text-xl font-bold">
              {userProfile?.name}
            </h2>
            <div className="mx-4 mt-5">
              <div className="my-4 break-all">
                <LocalPhoneOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Số điện thoại :</span>
                {userProfile?.phoneNumber}
              </div>
              <div className="my-4 break-all">
                <EmailOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Email :</span>
                {userProfile?.email}
              </div>
              <div className="my-4 break-all">
                <WorkOutlineOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Chức vụ:</span>
                {userProfile.role == "Admin"
                  ? "Admin"
                  : userProfile.role == "SaleStaff"
                  ? "Sale"
                  : userProfile.role == "ExpertiseStaff"
                  ? "Nhân viên thẩm định"
                  : "Nhân viên điều hành"}
              </div>
              <div className="my-4 break-all">
                <LocationOnOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Địa chỉ : </span>
                {userProfile?.currentAddress}
              </div>
            </div>
          </div>
          <div className="row-span-2 relative md:row-span-3 md:py-16 xl:py-0  shadow-md bg-white shadow-gray-400 border-[1px] rounded-lg border-gray-300  ">
            <div
              onClick={() => handleClickOpen(userProfile)}
              className="z-10 absolute right-5  top-2 pb-[4px] px-[4px]  cursor-pointer hover:bg-gray-100 shadow-md  shadow-gray-400 border-[1px] bg-white border-gray-400 rounded-md  text-black"
            >
              <EditOutlinedIcon
                fontSize="small"
                className="hover:text-blue-400"
              />
            </div>
            <div className=" p-5 ">
              <span className="my-4 break-all block">
                <BrandingWatermarkOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">CMND/CCCD :</span>
                {userProfile?.citizenIdentificationInfoNumber}
              </span>
              <span className="my-4 break-all block">
                <LocationOnOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Nơi cấp :</span>
                {userProfile?.citizenIdentificationInfoAddress}
              </span>
              <span className="my-4 break-all block">
                <RestoreOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Ngày cấp :</span>
                {formatDate(userProfile?.citizenIdentificationInfoDateReceive)}
              </span>

              <span className="my-4 break-all block">
                <BrandingWatermarkOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Hộ chiếu :</span>
                {userProfile?.passportInfoNumber}
              </span>
              <span className="my-4 break-all block">
                <LocationOnOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Nơi cấp :</span>
                {userProfile?.passportInfoAddress}
                {
                  //post?.title.length <= 20 ? post?.title : post?.title.slice(0, 20).concat("...")
                }
              </span>
              <span className="my-4 break-all block">
                <RestoreOutlinedIcon className="-mt-1 " />
                <span className="font-semibold  mx-2">Ngày cấp :</span>
                {userProfile?.passportInfoDateReceive === null
                  ? userProfile?.passportInfoDateReceive
                  : formatDate(userProfile?.passportInfoDateReceive)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-5 shadow-md bg-white shadow-gray-400 border-[1px]  rounded-lg border-gray-300">
          {props.children}
        </div>
      </div>
      <PopupUser
        openDad={open}
        parentCallback={callbackFunctionPopup}
        parentCallbackAlert={callbackFunctionAlert}
        parentCallbackMessageAlert={callbackFunctionMessageAlert}
        userDad={userProfile}
        isAdd={false}
        isProfile={true}
        error={error}
      />
      <AlertComponent
        message={messageAlert}
        alert={alert}
        parentCallback={callbackFunctionAlert}
      />
    </div>
  );
}
