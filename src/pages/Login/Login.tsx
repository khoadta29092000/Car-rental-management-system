import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppSelector } from '../../hooks';
import { loginActions, loginAsyncApi } from '../../redux/LoginReducer/LoginReducer';
import { getProfileByEmailAsyncApi } from '../../redux/UserReducer/userReducer';
import { DispatchType, RootState } from '../../redux/store';
import { history } from '../../util/config';


const styleLabel = {
  fontSize: '14px',
  lineHeight: '22px',
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: 'Roboto',
};

const styleTitle = {
  color: '#000000D9',
  fontFamily: 'Roboto',
  fontWeight: '500',
  fontSize: '30px',
  lineHeight: '40px',
};

const styleBtnTitle = {
  ...styleLabel,
  color: '#fff',
};

const styleDivLogin = {
  top: '0',
  right: '0',
  left: '0',
  bottom: '0',
  width: '100%',
  height: '100%',
  margin: 'auto',
};

export type UserLoginModel = {
  userName: string,
  password: string
}

export default function Login() {

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  const dispatch: DispatchType = useDispatch();
  const navigate = useNavigate();
  const { userLogin, error } = useAppSelector((state: RootState) => state.login);
  
  useEffect(() => {
    if (userLogin && userLogin !== null) {
      const role = userLogin.role;
      let url = '/';
      switch (role) {
        case 'Admin':
          url = '/Admin/Admindashboard';
          break;
        case 'SaleStaff':
          url = '/profile';
          break;
        case 'OperatorStaff':
          url = '/Operator/Operatordashboard';
          break;
        case 'ExpertiseStaff':
          url = '/Expertise/Expertisedashboard';
          break;
        default:
          url = '/';
          break;
      }
      navigate(url);
    
    }
  }, [userLogin, navigate]);
  const frmLogin = useFormik<UserLoginModel>({
    initialValues: {
      userName: '',
      password: ''
    },
    validationSchema: yup.object().shape({

      userName: yup.string().required("Email không được để trống!").email('Email không hợp lệ!'),
      password: yup.string().required("Mật khẩu không được để trống!")

    }),
    onSubmit: (values: UserLoginModel) => {
      const actionAsyncLogin = loginAsyncApi(values);
      dispatch(actionAsyncLogin)
      .then((response) => {
        if (response.payload != undefined) {
          dispatch(getProfileByEmailAsyncApi(response.meta.arg.userName)).then((response) => {
            if (response.payload != undefined) {       
              localStorage.setItem('user', JSON.stringify(response.payload));
              // Redirect to the dashboard page after login
              const role = (response.payload as { role: string }).role;
              let url = '/';
              switch (role) {
                case 'Admin':
                  url = '/Admin/Admindashboard';
                  break;
                case 'SaleStaff':
                  url = '/profile';
                  break;
                case 'OperatorStaff':
                  url = '/Operator/Operatordashboard';
                  break;
                case 'ExpertiseStaff':
                  url = '/Expertise/Expertisedashboard';
                  break;
                default:
                  url = '/';
                  break;
              }
              history.push(url);
            }
          });
        }
      }).catch((error) => {
        // Handle failure case


      });;

    }
  })


  return (

<div className="min-h-screen flex">
  {/* Background image */}
  <div className="w-1/2 bg-cover bg-center relative" style={{backgroundImage: `url('https://parking-cms.hcm.unicloud.ai/images/png/bg-screen-login-v1.jpg')`}}>
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <img className="h-240 w-240" src="https://amazingtech.vn/Content/amazingtech/assets/img/logo-color.png" alt="Logo" />
    <h3 className="text-white text-4xl font-bold mt-6 mx-12">ATSHARE</h3>
  </div>
</div>
  {/* Login form */}
  <div className="w-1/2 flex items-center justify-center">
  <form className=' z-10 px-10 py-5 h-[540px] w-[400px] bg-white rounded-lg' onSubmit={frmLogin.handleSubmit}>
          <div className='text-center'>
            <h3 className='text-3xl font-bold'>ĐĂNG NHẬP</h3>
          </div>
          <div className='my-5'>
            {error && <div className='text mt-1 text-center text-xl text-red-600 my-3 font-semibold'>{error}</div>}
            <TextField id="outlined-basic" error={frmLogin.touched.userName && frmLogin.errors.userName ? true : undefined}
              className='w-full' name="userName" onChange={frmLogin.handleChange} onBlur={frmLogin.handleBlur} label="Email" variant="outlined" />
            {frmLogin.errors.userName && frmLogin.touched.userName && <div className='text mt-1 text-red-600 font-semibold'>{frmLogin.errors.userName}</div>}
          </div>
          <div className='mt-5 mb-1'>
            <FormControl error={frmLogin.touched.password && frmLogin.errors.password ? true : undefined} className="w-full" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                className='w-full'
                name="password"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                onChange={frmLogin.handleChange} onBlur={frmLogin.handleBlur} label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {frmLogin.errors.password && frmLogin.touched.password && <div className='text mt-1 text-red-600 font-semibold'>{frmLogin.errors.password}</div>}
          </div>
          <div className='text-center pt-2 mt-2'>
            <button className='px-10 py-3 bg-blue-600 w-full rounded-xl text-white' type='submit'>Đăng nhập</button>
          </div>
          {/* <Link to='/forgetpassword' className='text-sm text-gray-400 mt-3 block text-center'>Quên mật khẩu?</Link> */}
        </form>
  </div>
</div>

  )
}