import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { DispatchType, RootState } from "../../redux/store";
import { ACCESS_TOKEN, USER_LOGIN, history, settings } from "../../util/config";

import { ChangePassword } from "../../pages/ChangePassword/ChangePassword";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  let callbackFunctionPopup = (childData: any) => {
    setOpen(childData);
  };
  const [alert, setAlert] = useState("");
  let callbackFunctionAlert = (childData: any) => {
    setAlert(childData);
  };
  const [open1, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const open = Boolean(anchorEl);
  const handleClickDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openMenu, setOpenMenu] = useState(false);
  const handleClick = () => {
    setOpenMenu(!openMenu);
  };
  const dispatch: DispatchType = useDispatch();
  const { userLogin } = useSelector((state: RootState) => state.login);

  const userString =
    localStorage.getItem("user") && localStorage.getItem("user");
  const userProfile =
    localStorage.getItem("user") &&
    JSON.parse(userString == null ? "" : userString);
  const userName = userProfile ? userProfile.name : "";
  const renderLoginUI = () => {
    if (userLogin) {
      return (
        <>
          <Stack direction="row">
            <Avatar
              alt="Remy Sharp"  
              src={userProfile && userProfile.cardImage}
            />
            <div className="mt-0 ml-2 text-center flex">
              <div>
                {userLogin && (
                  <p className="text-lg">{userProfile && userProfile.name}</p>
                )}
                {userLogin && userProfile && (
                  <p className="-mt-[6px] text-gray-600 text-xs">
                    (
                    {userProfile.role == "Admin"
                      ? "Admin"
                      : userProfile.role == "SaleStaff"
                        ? "Sale"
                        : userProfile.role == "ExpertiseStaff"
                          ? "Nhân viên thẩm định"
                          : "Nhân viên điều hành"}{" "}
                    )
                  </p>
                )}
              </div>
            </div>
          </Stack>
        </>
      );
    }
    return (
      <>
        {/* <NavLink
          style={({ isActive }) =>
            isActive ? { color: "#60a5fa" } : undefined
          }
          to="/"
          className=" hover:text-blue-400 text-black px-3 py-2 rounded-md text-base font-medium"
        >
          Đăng nhập
        </NavLink> */}
      </>
    );
  };
  const renderLoginUIMobi = () => {
    if (userLogin) {
      return (
        <>
          {/* <NavLink
            to="/Admin/Admindashboard"
            className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
          >
            <ManageAccountsIcon className="mr-4 -mt-1" />
            Quản trị
          </NavLink> */}
          <NavLink
            to="/"
            className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
          >
            <Diversity3Icon className="mr-4 -mt-1" />
            Quản lý hồ sơ
          </NavLink>
          <NavLink
            to="/profile"
            className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
          >
            <PersonIcon className="mr-4 -mt-1" />
            Hồ sơ cá nhân
          </NavLink>
          <div
            onClick={() => {
              //Đăng xuất
              settings.eraseCookie(ACCESS_TOKEN);
              settings.eraseCookie(USER_LOGIN);
              settings.clearStorage(ACCESS_TOKEN);
              settings.clearStorage(USER_LOGIN);
              sessionStorage.clear();
              history.push("/");
              window.location.reload();
            }}
            className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
          >
            <LogoutIcon className="mr-4 -mt-1" />
            Đăng xuất
          </div>
        </>
      );
    }
    return (
      <>
        <NavLink
          style={({ isActive }) =>
            isActive ? { color: "#60a5fa" } : undefined
          }
          to="/"
          className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
        >
          <LoginIcon className="mr-4 -mt-1" />
          Đăng nhập
        </NavLink>
      </>
    );
  };

  const renderUserUI = () => {
    if (userLogin) {
      return (
        <>
          {/* <NavLink
            style={({ isActive }) =>
              isActive ? { color: "#60a5fa" } : undefined
            }
            to="/Admin/Admindashboard"
            className=" hover:text-blue-400 text-black px-3 py-2 rounded-md text-base font-medium"
          >
            Quản trị
          </NavLink> */}

          <div
            onClick={handleClickDropDown}
            className=" hover:text-blue-400 text-black px-3 py-2 rounded-md text-base font-medium"
          >
            Quản lý
            <ArrowDropDownIcon />
          </div>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem onClick={handleClose}>Quản lý đơn hàng</MenuItem>
            {/* <MenuItem onClick={handleClose}>Quản lý hợp đồng</MenuItem> */}
            <MenuItem onClick={handleClose}>
              <NavLink to="/profile">Hồ sơ cá nhân</NavLink>
            </MenuItem>
            <hr />
            <MenuItem onClick={handleOpen}>
              <NavLink to="/profile"> Đổi mật khẩu</NavLink>
            </MenuItem>
            <MenuItem
              onClick={() => {
                //Đăng xuất
                settings.eraseCookie(ACCESS_TOKEN);
                settings.eraseCookie(USER_LOGIN);
                settings.clearStorage(ACCESS_TOKEN);
                settings.clearStorage(USER_LOGIN);
                sessionStorage.clear();
                history.push("/");
                window.location.reload();
              }}
            >
              Đăng xuất
            </MenuItem>
          </Menu>
        </>
      );
    } else {
      return (
        <>
          {/* <NavLink
            style={({ isActive }) =>
              isActive ? { color: "#60a5fa" } : undefined
            }
            to="/retalcar"
            className=" hover:text-blue-400 text-black px-3 py-2 rounded-md text-base font-medium"
          >
            Thuê xe
          </NavLink> */}
        </>
      );
    }
  };
  return (
    <div>
      <nav className="bg-white border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md ">
        <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto">
          <Link to="/" className="flex items-center">
            <img
              className="w-[180]"
              src="https://amazingtech.vn/Content/amazingtech/assets/img/logo-color.png"
              alt="Workflow"
            />
          </Link>
          <button
            onClick={handleClick}
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full lg:block md:w-auto" id="navbar-default">
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {renderUserUI()}
              {/* <NavLink
                style={({ isActive }) =>
                  isActive ? { color: "#60a5fa" } : undefined
                }
                to="/3"
                className=" hover:text-blue-400 text-blue-400 px-5 py-2 rounded-md text-base font-medium border-2 border-blue-400 "
              >
                <LocalPhoneIcon className="mr-2" />
                Liên hệ
              </NavLink> */}
              {renderLoginUI()}
            </ul>
          </div>
        </div>
        <div
          className={
            openMenu === true
              ? "visible lg:hidden"
              : "invisible lg:hidden hidden"
          } 
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/Retalcar"
              style={({ isActive }) =>
                isActive ? { color: "#60a5fa" } : undefined
              }
              className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              <DirectionsCarIcon className="mr-4 -mt-1" />
              Thuê xe
            </NavLink>
            {/* <NavLink
              to="/"
              className=" hover:text-blue-400 text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              <LocalPhoneIcon className="mr-4 -mt-1" />
              Liên hệ
            </NavLink> */}
            {renderLoginUIMobi()}

          </div>
        </div>
      </nav>
      <ChangePassword openDad={open1} parentCallback={callbackFunctionPopup} />
    </div>
  );
}
