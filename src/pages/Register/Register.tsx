// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useDispatch } from "react-redux";
// import { DispatchType, RootState } from "../../redux/store";
// import TextField from "@mui/material/TextField";
// import IconButton from "@mui/material/IconButton";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import InputAdornment from "@mui/material/InputAdornment";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import Visibility from "@mui/icons-material/Visibility";
// import FormControl from "@mui/material/FormControl";
// import {
//   postSignupApi,
//   SignupModel,
// } from "../../redux/SignupReducer/SignupReducer";
// import { useAppSelector } from "../../hooks";
// import { loginActions } from "../../redux/LoginReducer/LoginReducer";


// export default function Register() {
//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();
//   };
//   const dispatch: DispatchType = useDispatch();
//   const frmLogin = useFormik({
//     initialValues: {
//       name: "",
//       email: "",
//       password: "",
//       gender: true,
//       phone: "098271421",
//       confirmpassword: "",
//     },
//     validationSchema: yup.object().shape({
//       email: yup
//         .string()
//         .required("Email Không được để trống!")
//         .email("Email không hợp lệ!"),
//       password: yup.string().required("Mật khẩu Không được để trống!"),
//       confirmpassword: yup
//         .string()
//         .oneOf([yup.ref("password"), null], "Không khớp với mật khẩu"),
//     }),
//     onSubmit: (values: SignupModel) => {
//       dispatch(postSignupApi(values));
//     },
//   });

//   const { userLogin } = useAppSelector((state: RootState) => state.login);
//   const { error } = useAppSelector((state: RootState) => state.signup);

//   useEffect(() => {
//     // if isUserLoggedIn turned to true redirect to /home
//     if (userLogin) {
//       dispatch(loginActions.userLogin());
//     }
//   }, [userLogin]);
//   return (
//     <div className="relative h-[580px] flex content-center items-center justify-end">
//       <div className="bg-login-background bg-cover bg-center absolute top-0 w-full h-full" />
//       <form
//         className=" z-10  px-10 py-5 h-[540px]    mx-auto xl:mx-64  w-[400px] bg-white rounded-lg "
//         onSubmit={frmLogin.handleSubmit}
//       >
//         <div className="d-flex justify-content-center align-items-center">
//           <div className="">
//             <h3 className="text-center text-3xl font-bold w-full block">
//               ĐĂNG KÝ
//             </h3>

//             {error && (
//               <div className="text mt-1 text-center text-xl text-red-600 my-3 font-semibold">
//                 {error}
//               </div>
//             )}

//             <div className="w-full my-5">
//               <TextField
//                 id="outlined-basic"
//                 error={
//                   frmLogin.touched.email && frmLogin.errors.email
//                     ? true
//                     : undefined
//                 }
//                 className="w-full"
//                 name="email"
//                 onChange={frmLogin.handleChange}
//                 onBlur={frmLogin.handleBlur}
//                 label="Email*"
//                 variant="outlined"
//               />
//               {frmLogin.errors.email && frmLogin.touched.email && (
//                 <div className="text mt-1 text-red-600 font-semibold">
//                   {frmLogin.errors.email}
//                 </div>
//               )}
//             </div>
//             <div className="w-full mt-5 mb-1">
//               <FormControl
//                 error={
//                   frmLogin.touched.password && frmLogin.errors.password
//                     ? true
//                     : undefined
//                 }
//                 className="w-full"
//                 variant="outlined"
//               >
//                 <InputLabel htmlFor="outlined-adornment-password">
//                 Mật khẩu*
//                 </InputLabel>
//                 <OutlinedInput
//                   className="w-full"
//                   name="password"
//                   id="outlined-adornment-password"
//                   type={showPassword ? "text" : "password"}
//                   onChange={frmLogin.handleChange}
//                   onBlur={frmLogin.handleBlur}
//                   label="Mật khẩu*"
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={handleClickShowPassword}
//                         onMouseDown={handleMouseDownPassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                 />
//               </FormControl>
//               {frmLogin.errors.password && frmLogin.touched.password && (
//                 <div className="text mt-1 text-red-600 font-semibold">
//                   {frmLogin.errors.password}
//                 </div>
//               )}
//             </div>

//             <div className="w-full mt-5 mb-1">
//               <FormControl
//                 error={
//                   frmLogin.touched.confirmpassword && frmLogin.errors.confirmpassword
//                     ? true
//                     : undefined
//                 }
//                 className="w-full"
//                 variant="outlined"
//               >
//                 <InputLabel htmlFor="outlined-adornment-password">
//                 Xác thực mật khẩu*
//                 </InputLabel>
//                 <OutlinedInput
//                   className="w-full"
//                   name="confirmpassword"
//                   id="outlined-adornment-confirmpassword"
//                   type={showPassword ? "text" : "password"}
//                   onChange={frmLogin.handleChange}
//                   onBlur={frmLogin.handleBlur}
//                   label="Xác thực mật khẩu*"
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={handleClickShowPassword}
//                         onMouseDown={handleMouseDownPassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                 />
//               </FormControl>
//               {frmLogin.errors.confirmpassword && frmLogin.touched.confirmpassword && (
//                 <div className="text mt-1 text-red-600 font-semibold">
//                   {frmLogin.errors.confirmpassword}
//                 </div>
//               )}
//             </div>

//             <div className="w-full text-center pt-2 my-2">
//               <button
//                 className="px-10 py-3 bg-blue-600 w-full rounded-xl text-white"
//                 type="submit"
//               >
//                 Đăng ký
//               </button>
//             </div>
//             <div className="w-full text-center pt-2">
//               <div className=" grid grid-cols-9 text-gray-400">
//                 <hr className="col-span-4" />
//                 <div className="col-span-1 -mt-[10px] text-sm ">or</div>
//                 <hr className="col-span-4" />
//               </div>
//             </div>
//             <div className="w-full text-center  mt-2">
//               <button
//                 className=" py-3 pl-5  w-full grid rounded-xl text-black border-black border-[1px] "
//                 type="submit"
//               >
//                 <img
//                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/768px-Google_%22G%22_Logo.svg.png"
//                   className="h-8 w-8 -mt-1  absolute"
//                 />

//                 <div> Đăng nhập bằng Google </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
import React from 'react'

type Props = {}

export default function Register({}: Props) {
  return (
    <div>Register</div>
  )
}