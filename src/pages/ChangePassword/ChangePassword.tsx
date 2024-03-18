import CloseIcon from "@mui/icons-material/Close";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  TextField,
  styled
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from "yup";
import { useAppSelector } from '../../hooks';
import { Changepass, putchangepassAsyncApi } from '../../redux/UserReducer/userReducer';
import { DispatchType, RootState } from '../../redux/store';
import { USER_LOGIN } from '../../util/config';

type Props = {}
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
export const ChangePassword = (props: any) => {
  const { openDad, parentCallback, error,  } = props;
  const { userLogin } = useSelector((state: RootState) => state.login);
  const { showPopup } = useAppSelector((state: RootState) => state.user);
  const today = dayjs();
  const moment = require("moment");
  const dispatch: DispatchType  = useDispatch();

  

  const initialValues = {
    userName: USER_LOGIN && userLogin ? userLogin.email : "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
  };
  const frmUser = useFormik<Changepass>({
    initialValues: initialValues,
    validationSchema: yup.object().shape({
      userName: yup.string().required("Tài khoản không được để trống"),
     oldPassword: yup.mixed().required("mật khẩu không được để trống!"),
     newPassword:yup.string()
     .required("Password không được để trống!!"),
  
     confirmPassword: yup.string()
    .required("Xác nhận mật khẩu không được bỏ trống")
    .oneOf([yup.ref('newPassword')], "Xác nhận mật khẩu không khớp với mật khẩu"),
    }),
    onSubmit: (values:Changepass) => {
    
      
        const actionAsyncChangepass = putchangepassAsyncApi(values);
        dispatch(actionAsyncChangepass).then(() => {
          window.location.reload();
        });
    }
});
 
const [showPassword, setShowPassword] = React.useState(false);
const [showPassword1, setShowPassword1] = React.useState(false);
const [showPassword2, setShowPassword2] = React.useState(false);
const handleClickShowPassword = () => setShowPassword((show) => !show);
const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};
  const handleClose = () => {
    parentCallback(false);
    frmUser.setValues(initialValues);
    frmUser.setTouched({});
  };
  useEffect(() => {
    if (showPopup === false) {
      frmUser.setValues(initialValues);
      frmUser.setTouched({});
    }
  }, [openDad, showPopup]);



  const renderPopupUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form onSubmit={frmUser.handleSubmit}>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
            Đổi mật khẩu 
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=' my-5'>
  { error && <div className='text mt-1 text-center text-xl text-red-600 my-3 font-semibold'>{error}</div>}
  <TextField
    id="outlined-basic"
    error={frmUser.touched.userName && frmUser.errors.userName ? true : undefined}
    className='w-full'
    name="userName"
    disabled
    onChange={frmUser.handleChange}
    onBlur={frmUser.handleBlur}
    label="Email"
    variant="outlined"
    value={initialValues.userName}
  />
</div>
            <div className='w-full mt-5 mb-1'>
              <FormControl error={frmUser.touched.oldPassword && frmUser.errors.oldPassword ? true : undefined} className="w-full" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                <OutlinedInput

                  className='w-full'
                  name="oldPassword"
                  id="outlined-adornment-password 1"
                  type={showPassword ? 'text' : 'password'}
                  onChange={frmUser.handleChange} onBlur={frmUser.handleBlur} label="Old Password"
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
              {frmUser.errors.oldPassword && frmUser.touched.oldPassword && <div className='text mt-1 text-red-600 font-semibold'>{frmUser.errors.oldPassword}</div>}
            </div>
            <div className='w-full mt-5 mb-1'>
              <FormControl error={frmUser.touched.newPassword && frmUser.errors.newPassword ? true : undefined} className="w-full" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                <OutlinedInput

                  className='w-full'
                  name="newPassword"
                  id="outlined-adornment-password 2"
                  type={showPassword1 ? 'text' : 'password'}
                  onChange={frmUser.handleChange} onBlur={frmUser.handleBlur} label="New Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword1 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }

                />
              </FormControl>
              {frmUser.errors.newPassword && frmUser.touched.newPassword && <div className='text mt-1 text-red-600 font-semibold'>{frmUser.errors.newPassword}</div>}
            </div>
            <div className='w-full mt-5 mb-1'>
              <FormControl error={frmUser.touched.confirmPassword && frmUser.errors.confirmPassword ? true : undefined} className="w-full" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput

                  className='w-full'
                  name="confirmPassword"
                  id="outlined-adornment-password 3"
                  type={showPassword2 ? 'text' : 'password'}
                  onChange={frmUser.handleChange} onBlur={frmUser.handleBlur} label="Confirm Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }

                />
              </FormControl>
              {frmUser.errors.confirmPassword && frmUser.touched.confirmPassword && <div className='text mt-1 text-red-600 font-semibold'>{frmUser.errors.confirmPassword}</div>}
            </div>
              
            </DialogContent>
            <DialogActions>
              <Button type="submit">Đổi password</Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
        
      </>
    );
  };
  
  return <>{renderPopupUI()}</>;
};
