import { useState, forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent } from "notistack";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import React from "react";
import { errorProps } from "@/app/providers";

const CustomErrorSnackBar = forwardRef<HTMLDivElement, errorProps>(
  ({ id, ...props }, ref) => {
    const { userFriendlyMessage, error } = props;
    console.log("Error SnackBar", props);
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = useCallback(() => {
      setExpanded((oldExpanded) => !oldExpanded);
    }, []);

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    const highlightLine = (line: string) => {
      const regex = /at\s+([^\s]+)\s+\(([^)]+)\)/;
      const match = line.match(regex);
      if (match) {
        const prefix = line.substring(0, match.index);
        const functionName = match[1];
        const fileInfo = match[2];

        const parts = fileInfo.split(/(src\/[^:\s\?]+)/);
        const highlightedFileInfo = parts.map((part, i) =>
          /src\/[^:\s\?]+/.test(part) ? (
            <span key={i} style={{ color: "#35c2ff", fontWeight: "900" }}>
              {part}
            </span>
          ) : (
            part
          )
        );
        return (
          <>
            {prefix}at{" "}
            <span style={{ color: "#dcdc97", fontWeight: "900" }}>
              {functionName}
            </span>{" "}
            (<>{highlightedFileInfo}</>)
          </>
        );
      }
      return line;
    };
    return (
      <SnackbarContent ref={ref} key={id}>
        <Alert
          variant="outlined"
          severity="error"
          sx={{
            alignItems: "center",
            border: "1px solid #ffffff1f",
            width: expanded ? "100%" : "410px",
            transition: "width 0.5s ease-in-out",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent={"space-between"}
            pb={expanded ? 1 : 0}
            minWidth={342}
          >
            <Typography
              display={"block"}
              maxWidth={342}
              textOverflow={"ellipsis"}
              overflow={"hidden"}
            >
              {userFriendlyMessage}
            </Typography>
            <Stack direction="row" alignItems="center">
              <IconButton
                aria-label="Show more"
                size="small"
                onClick={handleExpandClick}
              >
                <ExpandMoreIcon />
              </IconButton>
              <IconButton size="small" onClick={handleDismiss}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Stack
              bgcolor={"#ffffff0d"}
              p={1}
              gap={0.5}
              borderRadius={1}
              alignItems={"flex-start"}
              textOverflow={"ellipsis"}
            >
              {error?.stack &&
                (() => {
                  const lines = error?.stack?.split("\n");
                  return (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: "secondary.main",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {`${error.message}: ${id}`}
                      </Typography>
                      {lines.length > 1 && (
                        <Stack
                          pl={2}
                          borderLeft="2px solid rgba(255,255,255,0.2)"
                          gap={0.5}
                          sx={{
                            overflowX: "auto",
                            maxHeight: "200px",
                            fontFamily: "monospace",
                            "&::-webkit-scrollbar": { display: "none" },
                            msOverflowStyle: "none",
                            scrollbarWidth: "none",
                          }}
                        >
                          {lines.slice(1).map((line, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                              }}
                            >
                              {highlightLine(line)}
                            </Typography>
                          ))}
                        </Stack>
                      )}
                    </>
                  );
                })()}
            </Stack>
          </Collapse>
        </Alert>
      </SnackbarContent>
    );
  }
);

export default CustomErrorSnackBar;
