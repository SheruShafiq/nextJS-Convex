'use client';
import React, { useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { badgeProps } from "./Badge";
import useDynamicFont from "@/hooks/useDynamicFontSize";
import Image from "next/image";

const ROLE_MIN = 12;
const ROLE_MAX = 120;
const NAME_MIN = 12;
const NAME_MAX = 30;

function CarPass({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const roleFontSize = useDynamicFont(roleRef, [role], ROLE_MIN, ROLE_MAX);
  const nameFontSize = useDynamicFont(nameRef, [name], NAME_MIN, NAME_MAX);
  return (
    <Stack mx="auto" width="660px" height="350px" bgcolor="white">
      <Stack
        bgcolor={Number(name) === 2 ? "#ff000054" : "yellow"}
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          my={2}
          px={1}
        >
          <Box sx={{ width: "100px", height: "100px" }}>
            <Image
width={100}
height={100}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={'/minaraLogo.png'}
              crossOrigin="anonymous"
              alt="Ahmadiyya flag"
            />
          </Box>
          <Stack
            alignItems="center"
            sx={{
              placeContent: "center",
              width: "160px",
              height: "160px",
              border: "8px solid rgb(255, 0, 21)",
              borderRadius: "100%",
            }}
          >
            <Typography lineHeight={0} fontSize={150} color="rgb(255, 0, 21)">
              P
            </Typography>
          </Stack>
          <Box sx={{ width: "100px", height: "100px" }}>
            <Image
width={100}
height={100}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                WebkitFilter: "drop-shadow(5px 5px 5px #222)",
                filter: "drop-shadow(5px 5px 5px #222)",
              }}
              src={'/JalsaLogo.png'}
              alt="Ahmadiyya flag"
              crossOrigin="anonymous"
            />
          </Box>
        </Stack>

        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box width="100%" overflow="hidden"></Box>
          <Box width="100%" overflow="hidden">
            <Typography
              ref={roleRef}
              sx={{
                lineHeight: 1,
                whiteSpace: "nowrap",
                fontWeight: 800,
                color: "black",
                fontSize: `${name}px`,
                textAlign: "center",
              }}
            >
              {role}
            </Typography>
          </Box>
        </Stack>
        <Stack
          boxSizing="border-box"
          pb={0.5}
          px={1}
          direction="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="black"
          >
            <CalendarMonthIcon sx={{ pb: 0.2 }} fontSize="small" /> 2,3,4 Mei
            2025
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="black"
          >
            <LocationOnIcon sx={{ pb: 0.2 }} fontSize="small" /> &apos;t Frusselt 30,
            8076 RE Vierhouten, Nederland
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CarPass;
