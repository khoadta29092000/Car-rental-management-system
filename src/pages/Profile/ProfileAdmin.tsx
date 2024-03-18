import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { Avatar } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

type Props = {}
 
export default function ProfileAdmin({}: Props) {
  
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
   let firstCharacter: string = "";
  return (
    <div  className="pt-2 md:mx-5 mx-2">
      <div>
      <Breadcrumbs aria-label="breadcrumb">
          <NavLink to="/Admin/Admindashboard" className="hover:underline">
            Tổng quát
          </NavLink>
          <Typography className="text-sm" color="text.primary">
            Hồ sơ cá nhân
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="pt-2 py-5 md:mx-5 mx-2">
  <div className="gap-5">
    <div className="relative shadow-md bg-white  shadow-gray-400 border-[1px] rounded-lg border-gray-300">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-1/3 text-center">
          {userProfile?.cardImage === null || userProfile?.cardImage === "" ? (
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
            <img className="p-2  h-[240px] w-[280px]  mx-auto  z-0 object-cover " 
            src={userProfile?.cardImage}/>
          )}
        </div>
        <div className="md:w-2/3 mx-4 mt-5 text-center md:text-left">
          <h2 className=" font-bold font-roboto text-4xl">{userProfile?.name}</h2>
          <div className="my-4 break-all flex items-center">
            <EmailOutlinedIcon className="-mt-1 " />
            <span className="font-semibold  mx-2">Email :</span>
            {userProfile?.email}
          </div>
          <div className="my-4 break-all flex items-center">
            <LocalPhoneOutlinedIcon className="-mt-1 " />
            <span className="font-semibold   mx-2">Số điện thoại :</span>
            {userProfile?.phoneNumber}
          </div>
          <div className="my-4 break-all flex items-center">
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
          <div className="my-4 break-all flex items-center">
            <LocationOnOutlinedIcon className="-mt-1 " />
            <span className="font-semibold  mx-2">Địa chỉ : </span>
            {userProfile?.currentAddress}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}