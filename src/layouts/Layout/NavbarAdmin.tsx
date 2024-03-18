import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { userAction } from "../../redux/UserReducer/userReducer";
import { DispatchType, RootState } from "../../redux/store";
import MenuIcon from '@mui/icons-material/Menu';
import {
  ACCESS_TOKEN,
  USER,
  USER_LOGIN,
  history,
  settings,
} from "../../util/config";
export default function NavbarAdmin(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick = () => {
    setOpenMenu(!openMenu);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openMenuCar, setOpenMenuCar] = React.useState(false);

  const handleClickOpenMenuCar = () => {
    setOpenMenuCar(!openMenuCar);
  };
  const [openMenuStatistic, setOpenMenuStatistic] = React.useState(false);
  const handleClickOpenMenuStatistic = () => {
    setOpenMenuStatistic(!openMenuStatistic);
  };

  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const [openMenu, setOpenMenu] = useState(false);
  const { userLogin } = useSelector((state: RootState) => state.login);

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch: DispatchType = useDispatch();
  useEffect(() => {
    //call api
   
    if (userLogin === null) {
      dispatch(userAction.userLogin());
    } else {
    }
  }, []);

  let view;
  if (userProfile && userProfile.role === "Admin") {
    view = (
      <>
        <div
          className={
            openMenu === true
              ? "h-screen w-screen md:bg-white md:hidden  bg-gray-600 fixed bg-opacity-50  z-10 block md:w-64  overflow-auto "
              : "hidden"
          }
        >
          <div className="bg-white  bg-opacity-100">
            <nav className=" border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md shadow-gray-400">
              <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto"></div>
            </nav>

            <div className="mt-[70px]">
              <ul>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/Admindashboard"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <GridViewOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Tổng quan</div>
                  </div>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/ContractGroup"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <AssignmentOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Hợp đồng</div>
                  </div>
                </NavLink>
                <ListItemButton
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={handleClickOpenMenuCar}
                >
                  <div className="flex mx-auto md:mx-0">
                    <FormatListBulletedOutlinedIcon
                      className="h-6 w-6 mt-[5px] mr-2 text-center"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <ListItemText
                      style={{ marginTop: "6px" }}
                      primary="Quản lý xe"
                    />
                  </div>

                  {openMenuCar ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openMenuCar} timeout="auto" unmountOnExit>
                  <NavLink
                    onClick={() => setOpenMenu(!openMenu)}
                    style={({ isActive }) =>
                      isActive
                        ? {
                          color: "rgb(96 165 250)",
                          background: "rgb(219 234 254)",
                        }
                        : undefined
                    }
                    className="mt-4 text-center  mx-10 flex  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                    to="/Admin/CarManagement"
                  >
                    <List
                      className=" md:hover:text-blue-400 w-full md:hover:bg-blue-100 text-center"
                      component="div"
                      disablePadding
                    >
                      <ListItemButton>
                        <div className="flex mx-auto md:mx-0">
                          <DirectionsCarFilledOutlinedIcon
                            className="h-6 w-6 mt-[2px] mr-2"
                            style={{ color: "rgb(156 163 175)" }}
                          />
                          <ListItemText
                            style={{ marginTop: "6px" }}
                            primary="Tất cả xe"
                          />
                        </div>
                      </ListItemButton>
                    </List>
                  </NavLink>
                  <NavLink
                    onClick={() => setOpenMenu(!openMenu)}
                    style={({ isActive }) =>
                      isActive
                        ? {
                          color: "rgb(96 165 250)",
                          background: "rgb(219 234 254)",
                        }
                        : undefined
                    }
                    className="mt-4 text-center  mx-10 flex  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                    to="/Admin/CarMaintenanceInfo"
                  >
                    <List
                      className=" md:hover:text-blue-400 w-full md:hover:bg-blue-100 text-center"
                      component="div"
                      disablePadding
                    >
                      <ListItemButton>
                        <div className="flex mx-auto md:mx-0">
                          <EngineeringOutlinedIcon
                            className="h-6 w-6 mt-[1px] mr-2"
                            style={{ color: "rgb(156 163 175)" }}
                          />
                          <ListItemText
                            style={{ marginTop: "6px" }}
                            primary="Bảo dưỡng"
                          />
                        </div>
                      </ListItemButton>
                    </List>
                  </NavLink>
                  <NavLink
                    onClick={() => setOpenMenu(!openMenu)}
                    style={({ isActive }) =>
                      isActive
                        ? {
                          color: "rgb(96 165 250)",
                          background: "rgb(219 234 254)",
                        }
                        : undefined
                    }
                    className="mt-4 text-center  mx-10 flex  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                    to="/Admin/CarNeedRegistry"
                  >
                    <List
                      className=" md:hover:text-blue-400 w-full md:hover:bg-blue-100 text-center"
                      component="div"
                      disablePadding
                    >
                      <ListItemButton>
                        <div className="flex mx-auto md:mx-0">
                          <NoCrashOutlinedIcon
                            className="h-6 w-6 mt-[2px] mr-2"
                            style={{ color: "rgb(156 163 175)" }}
                          />
                          <ListItemText
                            style={{ marginTop: "6px" }}
                            primary="Đăng kiểm"
                          />
                        </div>
                      </ListItemButton>
                    </List>
                  </NavLink>
                </Collapse>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/UserManagement"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <PersonOutlineIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Nhân viên</div>
                  </div>
                </NavLink>
                <NavLink
                  // to="/Admin/Calendar"

                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/Calendar"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400 "
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <CalendarMonthOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Lịch Thuê xe</div>
                  </div>
                </NavLink>
                <ListItemButton
                  className="items-center mt-4  mx-5 flex flex-row  h-[41px]  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={handleClickOpenMenuStatistic}
                >
                  <div className="flex mx-auto md:mx-0">
                    <MenuIcon
                      className="h-6 w-6 mt-[5px] mr-2 text-center mx-auto"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <ListItemText
                      style={{ marginTop: "6px" }}
                      primary="Thống kê"
                    />
                  </div>
                  {openMenuStatistic ? <ExpandLess /> : <ExpandMore />}

                </ListItemButton>
                <Collapse in={openMenuStatistic} timeout="auto" unmountOnExit>
                  <NavLink
                    onClick={() => setOpenMenu(!openMenu)}
                    style={({ isActive }) =>
                      isActive
                        ? {
                          color: "rgb(96 165 250)",
                          background: "rgb(219 234 254)",
                        }
                        : undefined
                    }
                    className="mt-4 text-center  mx-10 flex  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                    to="/Admin/Statistic/Time"
                  >
                    <List
                      className=" md:hover:text-blue-400 w-full md:hover:bg-blue-100 text-center"
                      component="div"
                      disablePadding
                    >
                      <ListItemButton>
                        <div className="flex mx-auto md:mx-0">
                          <StackedLineChartIcon
                            className="h-6 w-6 mt-[5px] mr-2"
                            style={{ color: "rgb(156 163 175)" }}
                          />
                          <ListItemText
                            style={{ marginTop: "6px" }}
                            primary="Thời gian"
                          />
                        </div>
                      </ListItemButton>
                    </List>
                  </NavLink>
                  <NavLink
                    onClick={() => setOpenMenu(!openMenu)}
                    style={({ isActive }) =>
                      isActive
                        ? {
                          color: "rgb(96 165 250)",
                          background: "rgb(219 234 254)",
                        }
                        : undefined
                    }
                    className="mt-4 text-center  mx-10 flex  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                    to="/Admin/Statistic/Car"
                  >
                    <List
                      className=" md:hover:text-blue-400 w-full md:hover:bg-blue-100 text-center"
                      component="div"
                      disablePadding
                    >
                      <ListItemButton>
                        <div className="flex mx-auto md:mx-0">
                          <DirectionsCarFilledOutlinedIcon
                            className="h-6 w-6 mt-[5px] mr-2"
                            style={{ color: "rgb(156 163 175)" }}
                          />
                          <ListItemText
                            style={{ marginTop: "6px" }}
                            primary="Thời gian"
                          />
                        </div>
                      </ListItemButton>
                    </List>
                  </NavLink>
                </Collapse>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/Customerinfo"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <SupervisorAccountOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Khách Hàng</div>
                  </div>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/parking"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <LocalParkingIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Bãi đậu xe</div>
                  </div>
                </NavLink>
              </ul>
            </div>
          </div>
        </div >
        <div className="h-screen w-screen md:block bg-#003F87 fixed overflow-y-auto bg-opacity-50 hidden  md:z-[15] border-r-[1px] md:w-64 ">
          <nav className=" border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md shadow-gray-400">
            <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto"></div>
          </nav>

          <div className="mt-[76px]">
            <ul>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/Admindashboard"
                className="items-center mt-4  mx-5 flex flex-row   px-5 py-2 rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <GridViewOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1">Tổng quan</div>
                </div>
              </NavLink>

              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/ContractGroup"
                className="items-center mt-4  mx-5 flex flex-row    px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <AssignmentOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Hợp đồng</div>
                </div>
              </NavLink>
              <ListItemButton
                className="items-center mt-4  mx-5 flex flex-row  h-[41px]  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={handleClickOpenMenuCar}
              >
                <FormatListBulletedOutlinedIcon
                  className="h-6 w-6 mt-[1px] mr-2"
                  style={{ color: "rgb(156 163 175)" }}
                />
                <ListItemText
                  style={{ marginTop: "6px" }}
                  primary="Quản lý xe"
                />
                {openMenuCar ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenuCar} timeout="auto" unmountOnExit>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  className="mt-4  mx-10 flex h-[41px]  flex-row   px-5 py-2 rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                  to="/Admin/CarManagement"
                >
                  <List className="" component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <DirectionsCarFilledOutlinedIcon
                        className="h-6 w-6  mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Tất cả xe" />
                    </div>
                  </List>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  to="/Admin/CarMaintenanceInfo"
                  className="mt-4  mx-10 h-[41px] flex flex-row   px-5 py-2   rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                >
                  <List component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <EngineeringOutlinedIcon
                        className="h-6 w-6 mt-[1px] mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Bảo dưỡng" />
                    </div>
                  </List>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  to="/Admin/CarNeedRegistry"
                  className="mt-4  mx-10 h-[41px] flex flex-row   px-5 py-2   rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                >
                  <List component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <NoCrashOutlinedIcon
                        className="h-6 w-6 mt-[1px] mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Đăng kiểm" />
                    </div>
                  </List>
                </NavLink>
              </Collapse>

              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/UserManagement"
                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <PersonOutlineIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Nhân viên</div>
                </div>
              </NavLink>
              <NavLink
                to="/Admin/Calendar"
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                // to="/Admin/CarManagement"

                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <CalendarMonthOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Lịch Thuê xe</div>
                </div>
              </NavLink>
              <ListItemButton
                className="items-center mt-4  mx-5 flex flex-row  h-[41px]  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={handleClickOpenMenuStatistic}
              >
                <MenuIcon
                  className="h-6 w-6 mt-[1px] mr-2"
                  style={{ color: "rgb(156 163 175)" }}
                />
                <ListItemText
                  style={{ marginTop: "6px" }}
                  primary="Thống kê"
                />
                {openMenuStatistic ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenuStatistic} timeout="auto" unmountOnExit>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  className="mt-4  mx-10 flex h-[41px]  flex-row   px-5 py-2 rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                  to="/Admin/Statistic/Time"
                >
                  <List className="" component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <StackedLineChartIcon
                        className="h-6 w-6  mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Thời gian" />
                    </div>
                  </List>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  to="/Admin/Statistic/Car"
                  className="mt-4  mx-10 h-[41px] flex flex-row   px-5 py-2   rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                >
                  <List component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <DirectionsCarFilledOutlinedIcon
                        className="h-6 w-6 mt-[1px] mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Xe" />
                    </div>
                  </List>
                </NavLink>
              </Collapse>
              {/* <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/Statistic"
                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <StackedLineChartIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Thống Kê</div>
                </div>
              </NavLink> */}
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/Customerinfo"
                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <div className="flex mx-auto md:mx-0">
                  <SupervisorAccountOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  "> Khách hàng </div>
                </div>
              </NavLink>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/Parking"
                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <div className="flex mx-auto md:mx-0">
                  <LocalParkingIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />

                  <div className="ml-2  mt-1  ">Bãi đậu xe</div>
                </div>
              </NavLink>
            </ul>
          </div>
        </div>
      </>
    );

  }
  else if (userProfile && userProfile.role == "ExpertiseStaff") {
    view = (
      <>
        <div
          className={
            openMenu === true
              ? "h-screen w-screen md:bg-white md:hidden  bg-gray-600 fixed bg-opacity-50  z-10 block md:w-64  overflow-auto "
              : "hidden"
          }
        >
          <div className="bg-white  bg-opacity-100">
            <nav className=" border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md shadow-gray-400">
              <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto"></div>
            </nav>

            <div className="mt-[70px]">
              <ul>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Expertise/Expertisedashboard"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <GridViewOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Tổng quan</div>
                  </div>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Expertise/ContractGroup"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <AssignmentOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Hợp đồng</div>
                  </div>
                </NavLink>
                <NavLink
                  onClick={() => setOpenMenu(!openMenu)}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  to="/Expertise/CarManagement"
                >
                  <div className="flex mx-auto md:mx-0">
                    <DirectionsCarFilledOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Quản lý xe</div>
                  </div>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Expertise/Customerinfo"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <SupervisorAccountOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Khách Hàng</div>
                  </div>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Expertise/parking"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <LocalParkingIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Bãi đậu xe</div>
                  </div>
                </NavLink>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-screen w-screen md:block bg-#003F87 fixed overflow-y-auto bg-opacity-50 hidden  md:z-[15] border-r-[1px] md:w-64 ">
          <nav className=" border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md shadow-gray-400">
            <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto"></div>
          </nav>

          <div className="mt-[76px]">
            <ul>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Expertise/Expertisedashboard"
                className="items-center mt-4  mx-5 flex flex-row   px-5 py-2 rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <GridViewOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1">Tổng quan</div>
                </div>
              </NavLink>

              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Expertise/ContractGroup"
                className="items-center mt-4  mx-5 flex flex-row    px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <AssignmentOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Hợp đồng</div>
                </div>
              </NavLink>

              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                onClick={() => setOpenMenu(!openMenu)}
                className="items-center mt-4  mx-5 flex flex-row    px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                to="/Expertise/CarManagement"
              >
                <div className="flex mx-auto md:mx-0">
                  <DirectionsCarFilledOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Quản lý xe</div>
                </div>
              </NavLink>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Expertise/Customerinfo"
                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <div className="flex mx-auto md:mx-0">
                  <SupervisorAccountOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  "> Khách hàng </div>
                </div>
              </NavLink>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Expertise/Parking"
                className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <div className="flex mx-auto md:mx-0">
                  <LocalParkingIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />

                  <div className="ml-2  mt-1  ">Bãi đậu xe</div>
                </div>
              </NavLink>
            </ul>
          </div>
        </div>
      </>
    );
  }
  else if (userProfile && userProfile.role == "OperatorStaff") {
    view = (
      <>
        <div
          className={
            openMenu === true
              ? "h-screen w-screen md:bg-white md:hidden  bg-gray-600 fixed bg-opacity-50  z-10 block md:w-64  overflow-auto "
              : "hidden"
          }
        >
          <div className="bg-white  bg-opacity-100">
            <nav className=" border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md shadow-gray-400">
              <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto"></div>
            </nav>

            <div className="mt-[70px]">
              <ul>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Operator/Operatordashboard"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <GridViewOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Tổng quan</div>
                  </div>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/ContractGroup"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <AssignmentOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Hợp đồng</div>
                  </div>
                </NavLink>
                <NavLink
                  onClick={() => setOpenMenu(!openMenu)}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  to="/Operator/CarActiveManagement"
                >

                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Admin/Customerinfo"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
                  onClick={() => setOpenMenu(!openMenu)}
                >

                </NavLink>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-screen w-screen md:block bg-#003F87 fixed overflow-y-auto bg-opacity-50 hidden  md:z-[15] border-r-[1px] md:w-64 ">
          <nav className=" border-gray-200 px-2 sm:px-4  rounded dark:bg-gray-900 shadow-md shadow-gray-400">
            <div className="max-w-[1500px] flex flex-wrap items-center justify-between mx-auto"></div>
          </nav>

          <div className="mt-[76px]">
            <ul>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Operator/Operatordashboard"
                className="items-center mt-4  mx-5 flex flex-row   px-5 py-2 rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <GridViewOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1">Tổng quan</div>
                </div>
              </NavLink>
              <NavLink
                style={({ isActive }) =>
                  isActive
                    ? {
                      color: "rgb(96 165 250)",
                      background: "rgb(219 234 254)",
                    }
                    : undefined
                }
                to="/Admin/ContractGroup"
                className="items-center mt-4  mx-5 flex flex-row    px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400"
              >
                <div className="flex mx-auto md:mx-0">
                  <AssignmentOutlinedIcon
                    className="h-6 w-6 mt-[1px]"
                    style={{ color: "rgb(156 163 175)" }}
                  />
                  <div className="ml-2  mt-1  ">Hợp đồng</div>
                </div>


              </NavLink>

              <ListItemButton
                className="items-center mt-4  mx-5 flex flex-row  h-[41px]  rounded-md md:hover:bg-blue-100 md:hover:text-blue-400"
                onClick={handleClickOpenMenuCar}
              >
                <FormatListBulletedOutlinedIcon
                  className="h-6 w-6 mt-[1px] mr-2"
                  style={{ color: "rgb(156 163 175)" }}
                />
                <ListItemText
                  style={{ marginTop: "6px" }}
                  primary="Quản lý xe"
                />
                {openMenuCar ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenuCar} timeout="auto" unmountOnExit>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  className="mt-4  mx-10 flex h-[41px]  flex-row   px-5 py-2 rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                  to="/Operator/CarActiveManagement"
                >
                  <List className="" component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <DirectionsCarFilledOutlinedIcon
                        className="h-6 w-6  mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Tất cả xe" />
                    </div>
                  </List>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  to="/Operator/CarMaintenanceInfo"
                  className="mt-4  mx-10 h-[41px] flex flex-row   px-5 py-2   rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                >
                  <List component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <EngineeringOutlinedIcon
                        className="h-6 w-6 mt-[1px] mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Bảo dưỡng" />
                    </div>
                  </List>
                </NavLink>
                <NavLink
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                  to="/Operator/CarNeedRegistry"
                  className="mt-4  mx-10 h-[41px] flex flex-row   px-5 py-2   rounded-md md:hover:bg-blue-100 md:hover:text-blue-400 "
                >
                  <List component="div" disablePadding>
                    <div className="flex  mx-auto md:mx-0">
                      <NoCrashOutlinedIcon
                        className="h-6 w-6 mt-[1px] mr-2"
                        style={{ color: "rgb(156 163 175)" }}
                      />
                      <ListItemText primary="Đăng kiểm" />
                    </div>
                  </List>
                </NavLink>
              </Collapse>
              <NavLink
                  // to="/Admin/Calendar"

                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "rgb(96 165 250)",
                        background: "rgb(219 234 254)",
                      }
                      : undefined
                  }
                  to="/Operator/Calendar"
                  className="items-center mt-4 mx-5 flex flex-row   px-5 py-2 rounded-md  md:hover:bg-blue-100 md:hover:text-blue-400 "
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <div className="flex mx-auto md:mx-0">
                    <CalendarMonthOutlinedIcon
                      className="h-6 w-6 mt-[1px]"
                      style={{ color: "rgb(156 163 175)" }}
                    />
                    <div className="ml-2  mt-1  ">Lịch Thuê xe</div>
                  </div>
                </NavLink>



            </ul>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {/* header */}
      <nav className=" border-b-[1px] w-screen fixed md:z-1 h-[60px]   z-[100] bg-white   ">
        <div className=" h-[60px] flex justify-between  mx-auto">
          <button
            onClick={handleClick}
            data-collapse-toggle="navbar-default"
            type="button"
            className="   p-2  text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          <div className="">
            <img
              className=" md:ml-10 opacity-100 bg-opacity-100 h-14 w-44 object-cover mx-auto "
              src="https://amazingtech.vn/Content/amazingtech/assets/img/logo-color.png"
              alt=""
            />
          </div>
          <ul className=" md:ml-auto  md:mr-5  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <div
              onClick={handleClickDropDown}
              className=" hover:text-blue-400 hover:opacity-90 px-3 py-2 rounded-md "
            >
              <Stack direction="row">
                {/* <<<<<<< HEAD
                <Avatar alt="Remy Sharp" src={userLogin ? userLogin.cardImage == null ? "" : userLogin.cardImage : ""} />
                <div className="mt-0 ml-2 text-center flex">
                  <div>
                    {userLogin && <p className="text-lg">{userLogin.name}</p>}
                    {userLogin && (
======= */}
                <Avatar
                  alt="Remy Sharp"
                  src={userProfile && userProfile.cardImage}
                />
                <div className="mt-0 ml-2 text-center flex">
                  <div>
                    {userLogin && (
                      <p className="text-lg">
                        {userProfile && userProfile.name}
                      </p>
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
                              : userProfile.role == "OperatorStaff" ?
                                "Nhân viên điều hành" : "..."}
                        )
                      </p>
                    )}
                  </div>
                  <ArrowDropDownIcon className="mt-[2px]" />
                </div>
              </Stack>
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
              <MenuItem onClick={handleClose}>
                <NavLink to="/Admin/Profile">Hồ sơ cá nhân</NavLink>
              </MenuItem>
              <hr />
              <MenuItem
                onClick={() => {
                  //Đăng xuất
                  settings.eraseCookie(ACCESS_TOKEN);
                  settings.eraseCookie(USER_LOGIN);
                  settings.clearStorage(ACCESS_TOKEN);
                  settings.clearStorage(USER_LOGIN);
                  settings.clearStorage(USER);
                  sessionStorage.clear();
                  history.push("/");
                  window.location.reload();
                }}
              >
                Đăng xuất
              </MenuItem>
            </Menu>
          </ul>
        </div>
      </nav>
      {/* navbar */}
      {view}
    </>
  );
}
