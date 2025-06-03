import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sheru's App Library",
    short_name: "Sheru Apps",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#611A37",
    icons: [
      {
        src: "/logo.ico",
        sizes: "192x192",
        type: "image/x-icon"
      },
      {
        src: "/AppLogo.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
}
