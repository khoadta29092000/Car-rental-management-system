import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  styled,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import QRCode from "qrcode.react";
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

export const QRcodeModal = (props: any) => {
  const { openDad, userDad, parentCallback } = props;
  const handleClose = () => {
    parentCallback(false);
  };

  const renderuUpdateModalUI = () => {
    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="xs"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <DialogContent dividers>
            {userDad && <QRCode value={userDad} className="mx-auto w-64 h-64 my-[77px]"/>}
          </DialogContent>
        </BootstrapDialog>
      </>
    );
  };

  return <>{renderuUpdateModalUI()}</>;
};
