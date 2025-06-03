import React from "react";
import { SnackbarContent } from "notistack";
import { Alert } from "@mui/material";
import Button from "@mui/material/Button";

const CustomSnackbar = React.forwardRef((props, ref) => {
  const { severity, login, handleLogin } = props;

  return (
    <SnackbarContent ref={ref}>
      <Alert
        severity={severity}
        sx={{
          alignItems: "center",
          backgroundColor: "black",
          border: "1px solid #ffffff1f",
        }}
        action={
          login && (
            <Button
              variant="outlined"
              onClick={handleLogin}
              sx={{
                color: "white",
                border: "1px solid white",
              }}
            >
              Log In
            </Button>
          )
        }
      >
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});

export default CustomSnackbar;
