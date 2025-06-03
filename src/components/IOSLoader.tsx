import React from "react";
import "@/styles/IOSLoader.css";

interface IOSLoaderProps {
  size?: number;
  theme?: "dark" | "light";
}

function IOSLoader({ size = 20, theme = "dark" }: IOSLoaderProps) {
  const themeClass = theme === "dark" ? "spinner dark" : "spinner light";
  const style: React.CSSProperties = {
    width: size,
    height: size,
  };
  return (
    <div
      className={themeClass}
      style={style}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {[...Array(9)].map((_, i) => (
        <div key={i} className="segment"></div>
      ))}
    </div>
  );
}

export default IOSLoader;
