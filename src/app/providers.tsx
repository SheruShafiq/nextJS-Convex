'use client';
import React, { useState, createRef } from "react";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider, alpha, createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomErrorSnackBar from "@/components/CustomErrorSnackBar";
import SignUpAndLogin from "@/components/SignUpAndLogin";



declare module "notistack" {
  interface VariantOverrides {
    login: true;
  }
}
export type errorProps = {
  id: string;
  userFriendlyMessage: string;
  errorMessage: string;
  error: Error;
};

const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: { main: "rgb(255 0 105)" },
    primary:   { main: "#ffffff" },
    success:   { main: "rgb(137 255 137)" },
    error:     { main: "rgb(230 109 109)" },
    warning:   { main: "rgb(248 190 82)" },
    info:      { main: "rgb(255 0 105)" },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: "500px",
          width: "100%",
          minWidth: "280px",
          background: "#000",
          border: "1px solid #ffffff1f",
          borderRadius: "10px",
        },
        container: {
          background: "#00000096",
          alignItems: isDesktop ? "center" : "flex-start",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: alpha("#000", 0.5),
          color: "#fff",
          "&:focus": { backgroundColor: alpha("#000", 0.5) },
        },
        icon: { color: "#fff" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { backgroundColor: alpha("#000", 0.5), color: "#fff" },
      },
    },
    MuiList: {
      styleOverrides: {
        root: { backgroundColor: "black", color: "#fff" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { backgroundColor: alpha("#000", 1) },
      },
    },
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginDialogue, setLogInDialogue] = useState(false);
  const notistackRef = createRef<SnackbarProvider>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState();
  const [userID, setUserID] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    const cookieUserID = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="))
      ?.split("=")[1];
    setUserID(cookieUserID);
  }, []);
  return (
    <>
      <SpeedInsights />
      <ConvexClientProvider>
        <ThemeProvider theme={darkTheme}>
          <SnackbarProvider
            disableWindowBlurListener={true}
            maxSnack={3}
            autoHideDuration={3000}
            ref={notistackRef}
            Components={{
              error:   (props) => <CustomErrorSnackBar {...props} />,
              login:   (props) => (
                <CustomSnackbar
                  {...props}
                  severity="info"
                  login
                  handleLogin={() => setLogInDialogue(true)}
                />
              ),
              success: (props) => (
                <CustomSnackbar
                  {...props}
                  severity="success"
                  handleLogin={() => setLogInDialogue(true)}
                />
              ),
              warning: (props) => (
                <CustomSnackbar
                  {...props}
                  severity="warning"
                  handleLogin={() => setLogInDialogue(true)}
                />
              ),
              info:    (props) => (
                <CustomSnackbar
                  {...props}
                  severity="info"
                  handleLogin={() => setLogInDialogue(true)}
                />
              ),
            }}
          >
            <SignUpAndLogin
          isOpen={loginDialogue}
          setOpen={setLogInDialogue}
          setIsLoggedIn={setIsLoggedIn}
          setUserID={setUserID}
          setUserData={setUserData}
        />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </ConvexClientProvider>
    </>
  );
}
