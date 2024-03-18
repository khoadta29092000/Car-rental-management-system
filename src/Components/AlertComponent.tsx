import { Alert, Snackbar } from "@mui/material";
import React from "react";
export const AlertComponent = (props: any) => {
  let { message, alert, parentCallback } = props;
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    parentCallback("");
  };
  return (
    <>
      <Snackbar
        open={alert === "" ? false : true}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        className="float-left w-screen"
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert === "" ? "success" : alert}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
