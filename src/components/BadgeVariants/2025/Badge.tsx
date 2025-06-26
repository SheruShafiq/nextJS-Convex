
'use client'
import React, { useRef,  useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import useDynamicFont from "@/hooks/useDynamicFontSize";
import Image from "next/image";
export type badgeProps = {
  role: string;
  name: string;
  preview?: boolean;
};

const ROLE_MIN = 12;
const ROLE_MAX = 70;
const NAME_MIN = 12;
const NAME_MAX = 30;


function Badge({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const roleFontSize = useDynamicFont(roleRef, [role], ROLE_MIN, ROLE_MAX);
  const nameFontSize = useDynamicFont(nameRef, [name], NAME_MIN, NAME_MAX);


  return (
    <Stack mx="auto" width="660px" height="350px" bgcolor="white">
      <Stack
        sx={{
          background: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(/Minara.png), url(/bgFlower.png)`,
          backgroundSize: "560px 500px, 110px 200px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% -50%, 105% 90px",
        }}
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box sx={{ width: "150px", height: "75px", backgroundColor: "red" }}>
            <Image
                width={100}
                height={100}
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={'/AhmadiyyaFlag.png'}
              alt="Ahmadiyya flag"
              loading="eager"
              decoding="sync"
            />
          </Box>
          <Stack px={2} mt={1} alignItems="center">
            <Typography color="#AF1623">
              Ahmadiyya Moslim Gemeenschap
            </Typography>
            <Typography
              sx={{
                borderBottom: "2px solid #AF1623",
                lineHeight: "40px",
                mt: "6px",
              }}
              fontWeight={500}
              color="black"
              fontSize="3rem"
            >
              JALSA SALANA
            </Typography>
            <Typography mt={1} fontWeight={200} color="black" fontSize="1em">
              43
              <sup style={{ fontSize: "9px", verticalAlign: "super" }}>
                ste
              </sup>{" "}
              JAARLIJKSE BIJEENKOMST
            </Typography>
          </Stack>
          <Stack width={150} height={75}>
            <Box width="100%" height="100%" bgcolor="#AF1623" />
            <Box width="100%" height="100%" bgcolor="#FFFF" />
            <Box width="100%" height="100%" bgcolor="#1B448C" />
          </Stack>
        </Stack>

        <Stack
          gap={2}
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box py={2} bgcolor="#fddfe094" width="100%" overflow="hidden">
            <Typography
              ref={roleRef}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "black",
                fontSize: `${roleFontSize}px`,
                textAlign: "center",
              }}
            >
              {role}
            </Typography>
          </Box>
          <Box width="100%" overflow="hidden">
            <Typography
              ref={nameRef}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "black",
                fontSize: `${nameFontSize}px`,
                textAlign: "center",
              }}
            >
              {name}
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

export default Badge;
