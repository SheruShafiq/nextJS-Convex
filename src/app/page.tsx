'use client';
import { Button, Fade, Stack } from "@mui/material";
import { lazy, Suspense, useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { useRouter } from 'next/navigation'
const CyberpunkStoreFront = lazy(
  () => import("@/components/3D Renderers/CyberpunkStoreFront")
);
import { Loader } from "@react-three/drei";
import IOSLoader from "@/components/IOSLoader";
import dynamic from "next/dynamic";


function Home() {
  const [ready, setReady] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(false);  useEffect(() => {
    const windowWithIdleCallback = window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    
    const handle = windowWithIdleCallback.requestIdleCallback
      ? windowWithIdleCallback.requestIdleCallback(() => setReady(true))
      : window.setTimeout(() => setReady(true), 200);
    const timer = setTimeout(() => {
      setShouldDisplay(true);
    }, 2000);
    return () => {
      if (windowWithIdleCallback.cancelIdleCallback) {
        windowWithIdleCallback.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle as number);
        clearTimeout(timer);
      }
    };
  }, []);
   const router = useRouter()
  return (
    <>
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "52%",
          left: "50%",
        }}
      >
        <Loader
          containerStyles={{
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          dataStyles={{
            color: "#000",
            visibility: "hidden",
          }}
          innerStyles={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          barStyles={{
            borderRadius: "12px",
            width: "20vw",
            boxShadow:
              " 0 0 0.1vw 1px #ffffff, 0 0 0.4rem 2px #da4983, 0 0 1rem 4px #ff0066",
          }}
          dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
          initialState={(active) => active}
        />
      </div>
      <Suspense fallback={<IOSLoader />}>
        <Fade in={true} timeout={3000} mountOnEnter>
          <div
            style={{
              position: "absolute",
              transition: "opacity 2s ease-in-out",
              opacity: shouldDisplay ? 1 : 0,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
            }}
          >
            <CyberpunkStoreFront />
          </div>
        </Fade>
      </Suspense>

      <Stack
        minHeight={"100vh"}
        minWidth={"100vw"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
        zIndex={2}
      >
        <Logo
          logoName={"Sheru"}
          URL={"/"}
          additionalClassName={"homePageTitleDrop"}
        />
        <Stack direction={"row"} gap={1}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => router.push("/sheru/appLibrary/badgeMaker")}
          >
            Badge Maker{" "}
          </Button>

          <Button
            size="large"
            variant="outlined"
            onClick={() => router.push("/sauce")}
          >
            {" "}
            Sauce{" "}
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => router.push("/cv")}
          >
            CV
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => router.push("/familyGuySleepClient")}
          >
            Sleep App
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
