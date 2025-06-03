import * as React from "react";
import { Button, Collapse, Fade, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
// import { loginUser, createUser } from "../APICalls";
import { useGlitch } from "react-powerglitch";
import { TextGlitchEffect } from "@/components/TextGlitchEffect";
import { enqueueSnackbar } from "notistack";
import { errorProps } from "@/app/providers";
import SaveIcon from "@mui/icons-material/Save";
import IOSLoader from "@/components/IOSLoader";
import LoginIcon from "@mui/icons-material/Login";

export type SignupProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserID: (userID: string) => void;
  setUserData: (userData: any) => void; //TODO: Replace with user type
}


function SignUpAndLogin({
  isOpen,
  setOpen,
  setIsLoggedIn,
  setUserID,
  setUserData,
}: SignupProps) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [creatingOrLoggingIn, setCreatingOrLoggingIn] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 1000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.1,
    },
    playMode: "click",
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "login") {
      setCreatingOrLoggingIn(true);
      // loginUser({
      //   username,
      //   password,
      //   onSuccess: (user: any) => { //replace with User type
      //     document.cookie = `userID=${user.id}; path=/;`;
      //     setUserID(user.id);
      //     setUserData(user);
      //     setIsLoggedIn(true);
      //     handleClose();
      //     setCreatingOrLoggingIn(false);
      //   },
      //   onError: (error: any) => {
      //     const err: errorProps = {
      //       id: "user login error",
      //       userFriendlyMessage: "Either username or password is incorrect.",
      //       errorMessage:
      //         error instanceof Error ? error.message : "Unknown error",
      //       error: error instanceof Error ? error : new Error("Unknown error"),
      //     };
      //     enqueueSnackbar({ variant: "error", ...err });
      //     setCreatingOrLoggingIn(false);
      //   },
      // }); // TODO: Uncomment this when you have the loginUser function implemented
    } else {
      setCreatingOrLoggingIn(true);
      // createUser({
      //   username,
      //   password,
      //   displayName,
      //   onSuccess: (user: User) => {
      //     setUserData(user);
      //     enqueueSnackbar("Account created successfully", {
      //       variant: "success",
      //     });
      //     setUserID(user.id);
      //     setIsLoggedIn(true);
      //     document.cookie = `userID=${user.id}; path=/;`;
      //     setOpen(false);
      //     setCreatingOrLoggingIn(false);
      //   },
      //   onError: (error: any) => {
      //     const err: errorProps = {
      //       id: "creating user error",
      //       userFriendlyMessage:
      //         "Failed to create an account, try again later.",
      //       errorMessage:
      //         error instanceof Error ? error.message : "Unknown error",
      //       error: error instanceof Error ? error : new Error("Unknown error"),
      //     };
      //     enqueueSnackbar({ variant: "error", ...err });
      //     setCreatingOrLoggingIn(false);
      //   },
      // }); TODO: Uncomment this when you have the createUser function implemented
    }
  };
  return (
    <Dialog
      open={isOpen}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle>
        <TextGlitchEffect
          text={mode === "login" ? "Login" : "Signup"}
          speed={40}
          letterCase="lowercase"
          className={"loginModalTitle"}
        />
      </DialogTitle>
      <DialogContent
        sx={{
          overflowX: "hidden",
        }}
      >
        <DialogContentText>
          <span
            style={{
              maxWidth: "400px",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            ref={glitch?.ref}
          >
            {mode === "login" ? (
              <>
                <img
                  src="/noBitches.png"
                  alt="emoji"
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "2px",
                  }}
                />
                No account?
                <Button
                  variant="text"
                  onClick={() => setMode("signup")}
                  sx={{
                    textTransform: "none",
                    ml: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Signup
                </Button>
              </>
            ) : (
              <>
                Been already browsing sauce?{" "}
                <Button
                  variant="text"
                  onClick={() => setMode("login")}
                  sx={{
                    textTransform: "none",
                    ml: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </span>
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          fullWidth
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Collapse in={mode === "signup"} unmountOnExit>
          <Fade in={mode === "signup"}>
            <TextField
              required
              margin="dense"
              name="displayName"
              label="Display Name"
              type="text"
              fullWidth
              variant="standard"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Fade>
        </Collapse>
        <TextField
          required
          margin="dense"
          name="password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={
            mode === "login"
              ? !username || !password
              : !username || !password || !displayName
          }
          type="submit"
          color="secondary"
          variant="text"
          className="secondaryButtonHoverStyles"
          startIcon={
            creatingOrLoggingIn ? (
              <IOSLoader size={18} />
            ) : mode === "signup" ? (
              <SaveIcon />
            ) : (
              <LoginIcon />
            )
          }
        >
          <span style={{ pointerEvents: "none" }}>
            <TextGlitchEffect
              text={mode === "login" ? "Login" : "Signup"}
              speed={40}
              letterCase="lowercase"
              className={"loginButtonText"}
            />
          </span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SignUpAndLogin;
