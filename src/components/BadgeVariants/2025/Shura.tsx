'use client'
import React, { useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import useDynamicFont from "@/hooks/useDynamicFontSize";
import Image from "next/image";
export type badgeProps = {
  role: string;
  name: string;
  preview?: boolean;
};

const ROLE_MIN = 12;
const ROLE_MAX = 100;
const NAME_MIN = 12;
const NAME_MAX = 50;

function Shura({ role, name, preview }: badgeProps) {
  const roleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const roleFontSize = useDynamicFont(roleRef, [role], ROLE_MIN, ROLE_MAX);
  const nameFontSize = useDynamicFont(nameRef, [name], NAME_MIN, NAME_MAX);

  return (
    <Stack
      border={"1px solid #000"}
      mx="auto"
      width="660px"
      height="400px"
      bgcolor="white"
    >
      <Stack
        sx={{
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
              width={100}
height={100}
            />
          </Box>
          <Stack
            gap={1}
            px={2}
            mt={1}
            alignItems="center"
            position="relative"
          >
            <Typography
              color="#AF1623"
              fontFamily="'Roboto Condensed', sans-serif"
            >
              Ahmadiyya Moslim Gemeenschap
            </Typography>
            <Typography
              sx={{
                borderBottom: "2px solid #AF1623",
                lineHeight: "40px",
                mt: "6px",
                pb: "4px",
                fontFamily: "'Roboto Condensed', sans-serif",
              }}
              fontWeight={500}
              color="black"
              fontSize="3rem"
            >
              Majlis-e-Shura
            </Typography>
            <Typography
              sx={{
                textShadow: "0 0 8px rgb(0, 0, 0), 0 0 16px rgb(0, 0, 0)",
                fontWeight: 700,
                fontFamily: "'Roboto Condensed', sans-serif",
                position: "relative",
                zIndex: 5,
              }}
              mt={1}
              color="white"
              fontSize="3em"
              lineHeight={1}
            >
              2025
            </Typography>
          </Stack>
          <Stack width={150} height={75}>
            <Box width="100%" height="100%" bgcolor="#AF1623" />
            <Box width="100%" height="100%" bgcolor="#FFFF" />
            <Box width="100%" height="100%" bgcolor="#1B448C" />
          </Stack>
        </Stack>

        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box py={2} pt={1} width="100%" overflow="hidden">
            <Typography
              ref={roleRef}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
                fontFamily: "'Roboto Condensed', sans-serif",
                color: "black",
                fontSize: `${roleFontSize}px`,
                textAlign: "center",
              }}
            >
              {role}
            </Typography>
          </Box>
          <Box
            justifyContent="center"
            alignContent={"center"}
            height={"50%"}
            width="100%"
            overflow="hidden"
          >
            <Typography
              ref={nameRef}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
                fontFamily: "'Roboto Condensed', sans-serif",
                color: "black",
                fontSize: `${nameFontSize}px`,
                textAlign: "center",
              }}
            >
              {name}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Shura;
