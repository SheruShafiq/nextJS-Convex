import type { NextConfig } from "next";
import { withSerwist } from "@serwist/next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSerwist(nextConfig, {
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
