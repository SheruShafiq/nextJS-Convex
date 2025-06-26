'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  Stack,
  Button,
  Fade,
  Typography,
  LinearProgress,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled } from "@mui/material/styles";
import * as BadgeVariants from "@/components/BadgeVariants/2025/index";
import type { badgeProps } from "@/components/BadgeVariants/2025/index";
import ExcelInput, { RowData } from "@/components/ExcelInput";
import Papa from "papaparse";
import { toCanvas } from "html-to-image";
import Logo from "@/components/Logo";
import IOSLoader from "@/components/IOSLoader";
import "@/styles/BadgeMakerMain.css";
import WorkerConfig from "@/components/WorkerConfig";
import WorkerProgressDisplay from "@/components/WorkerProgressDisplay";
import { distributeWorkload } from "@/workers/pdfHelpers";

const fontCache: { css?: string } = {};

async function getInlineGoogleFontsCss(): Promise<string> {
  if (fontCache.css) return fontCache.css;

  const googleLinks = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  ).filter((l) => l.href.includes("fonts.googleapis.com"));

  let finalCss = "";

  for (const sheet of googleLinks) {
    const url = new URL(sheet.href);
    url.searchParams.set("_cb", Date.now().toString());

    const cssText = await (
      await fetch(url.toString(), { mode: "cors" })
    ).text();

    const urlRegex = /url\((https:\/\/[^\)]+)\)/g;
    let replacedCss = cssText;
    const promises: Promise<void>[] = [];

    replacedCss.replace(urlRegex, (_, remoteUrl) => {
      const p = fetch(remoteUrl, { mode: "cors" })
        .then((r) => r.arrayBuffer())
        .then((buf) => {
          const mime = remoteUrl.endsWith(".woff2")
            ? "font/woff2"
            : remoteUrl.endsWith(".woff")
              ? "font/woff"
              : "application/octet-stream";

          const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
          replacedCss = replacedCss.replace(
            remoteUrl,
            `data:${mime};base64,${b64}`
          );
        })
        .catch((err) => console.warn("Failed to inline font", remoteUrl, err));
      promises.push(p);
      return remoteUrl;
    });

    await Promise.all(promises);
    finalCss += replacedCss + "\n";
  }

  fontCache.css = finalCss;
  return finalCss;
}

type WorkerProgressEvent = { progress: number; workerIndex: number };
type WorkerCompleteEvent = { pdfBytes: ArrayBuffer; workerIndex: number };

type WorkerStatus = {
  id: number;
  progress: number;
  active: boolean;
  completed: boolean;
  imageCount: number;
};
type badgesData = {
  role: string;
  name: string;
}
function Home() {
  const [csvFile, setCSV] = useState<FileList | null>(null);
  const [badgesData, setBadgesData] = useState<badgeProps[]>([]);
  const [rows, setRows] = useState<RowData[]>([{ col1: "", col2: "" }]);
  const [generate, setGenerate] = useState(false);
  const [dataInputMode, setDataInputMode] = useState<"csv" | "manual">(
    "manual"
  );
  const [pagesRendered, setPagesRendered] = useState(0);
  const prevPageCountRef = useRef<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [workerStatuses, setWorkerStatuses] = useState<WorkerStatus[]>([]);
  const [activeWorkers, setActiveWorkers] = useState(0);
  const [configOpen, setConfigOpen] = useState(false);
  const [showWorkerStatus, setShowWorkerStatus] = useState(false);
  const [exportFinished, setExportFinished] = useState(false);

  const workerStatusesRef = useRef<WorkerStatus[]>([]);
  const activeWorkersRef = useRef(0);

  useEffect(() => {
    workerStatusesRef.current = workerStatuses;
  }, [workerStatuses]);

  useEffect(() => {
    activeWorkersRef.current = activeWorkers;
  }, [activeWorkers]);

  const [badgeVariant, setBadgeVariant] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  const variantComponents: React.ComponentType<badgeProps>[] = Object.values(
    BadgeVariants
  ) as React.ComponentType<badgeProps>[];

  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;

  const variantDimensions = [
    { width: 660, height: 350 },
    { width: 660, height: 350 },
    { width: 660, height: 400 },
  ];

  useEffect(() => {
    if (!csvFile) return setBadgesData([]);

    Papa.parse(csvFile[0], {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      complete: ({ data }: { data: badgeProps[] }) =>
        setBadgesData(
          (data as badgeProps[]).map((r) => ({
            role: r["role"] || r["role"] || "",
            name: r["name"] || r["name"] || "",
          }))
        ),
      error: console.error,
    });
  }, [csvFile]);

  useEffect(() => {
    if (!generate) return;

    const batch = 20;
    setVisibleCount(0);

    const step = () =>
      setVisibleCount((prev) => {
        const next = Math.min(prev + batch, badgesData.length);
        if (next < badgesData.length) requestAnimationFrame(step);
        return next;
      });

    step();
  }, [generate, badgesData]);

  useEffect(() => {
    if (isExporting) {
      setShowWorkerStatus(true);
    }
  }, [isExporting]);

  useEffect(() => {
    const totalBadges = badgesData.length;
    if (totalBadges === 0) return;
    const workPortion = 70;
    const startOffset = 15;
    const frac = pagesRendered / totalBadges;
    const pct = Math.min(1, Math.max(0, frac));
    setExportProgress(Math.round(startOffset + pct * workPortion));
  }, [pagesRendered, badgesData.length]);

  const MAX_WORKERS = typeof window !== "undefined"
    ? Math.min(
        Number(
          window.localStorage?.getItem("badge.workers") ||
            navigator.hardwareConcurrency ||
            4
        ),
        8
      )
    : 4;

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setPdfBlobUrl(null);
    setWorkerStatuses([]);
    setActiveWorkers(0);
    setShowWorkerStatus(true);
    setExportFinished(false);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }

    try {
      await document.fonts.ready;
      const inlineCss = await getInlineGoogleFontsCss();
      const { width, height } =
        variantDimensions[badgeVariant - 1] || variantDimensions[0];

      const indices = exportRefs.current
        .map((_, i) => i)
        .filter((i) => exportRefs.current[i] != null);
      const batches = distributeWorkload(indices, MAX_WORKERS);

      const initialStatuses: WorkerStatus[] = batches.map((batch, idx) => ({
        id: idx,
        progress: 0,
        active: true,
        completed: false,
        imageCount: batch.length,
      }));
      setWorkerStatuses(initialStatuses);
      setActiveWorkers(batches.length);
      prevPageCountRef.current = new Array(batches.length).fill(0);
      setPagesRendered(0);

      await new Promise<void>((r) => setTimeout(r, 0));

      const totalImages = indices.length;
      let capturedCount = 0;

      const workerPromises = batches.map((batch, workerIndex) => {
        return new Promise<ArrayBuffer>(async (resolve, reject) => {
          const w = new Worker(
            new URL("@/workers/pdfChunkWorker.ts", import.meta.url),
            { type: "module" }
          );

          w.onmessage = (
            e: MessageEvent<WorkerProgressEvent | WorkerCompleteEvent>
          ) => {
            if ("progress" in e.data) {
              const prog = e.data.progress;

              setWorkerStatuses((prev) =>
                prev.map((st) =>
                  st.id === workerIndex ? { ...st, progress: prog } : st
                )
              );

              setPagesRendered((prev) => {
                const prevPages = prevPageCountRef.current[workerIndex];
                const pageCount = Math.round((prog / 100) * batch.length);
                const delta = pageCount - prevPages;
                prevPageCountRef.current[workerIndex] = pageCount;
                return prev + delta;
              });
            } else {
              setWorkerStatuses((prevStatuses) =>
                prevStatuses.map((st) =>
                  st.id === workerIndex
                    ? { ...st, progress: 100, completed: true, active: false }
                    : st
                )
              );
              setActiveWorkers((n) => n - 1);
              resolve(e.data.pdfBytes);
            }
          };
          w.onerror = (err) => {
            setWorkerStatuses((s) =>
              s.map((st) =>
                st.id === workerIndex
                  ? { ...st, active: false, completed: false }
                  : st
              )
            );
            setActiveWorkers((n) => n - 1);
            reject(err);
          };

          const images: string[] = [];
          for (const i of batch) {
            const node = exportRefs.current[i]!;
            const canvas = await toCanvas(node, {
              pixelRatio: 2,
              width,
              height,
              cacheBust: true,
              backgroundColor: "#ffffff",
              fontEmbedCSS: inlineCss,
              fetchRequestInit: { cache: "force-cache" },
            });
            images.push(canvas.toDataURL("image/jpeg", 1));

            capturedCount++;
            const capturePct = Math.round((capturedCount / totalImages) * 15);
            setExportProgress(capturePct);

            await new Promise<void>((r) => setTimeout(r, 0));
          }

          w.postMessage({
            images,
            width,
            height,
            orientation: isDesktop ? "landscape" : "portrait",
            workerIndex,
          });
        });
      });

      const partials = await Promise.all(workerPromises);
      setExportProgress(85);

      await new Promise<void>((res, rej) => {
        const m = new Worker(
          new URL("@/workers/pdfMergeWorker.ts", import.meta.url),
          { type: "module" }
        );
        m.onmessage = (e: MessageEvent<{ blob: Blob }>) => {
          setPdfBlobUrl(URL.createObjectURL(e.data.blob));
          setExportProgress(100);
          setExportFinished(true);
          m.terminate();
          res();
        };
        m.onerror = rej;
        m.postMessage(partials, partials as any);
      });
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Export failed: " + (err as Error).message);
    } finally {
      setIsExporting(false);
      setShowWorkerStatus(true);
    }
  };

  const handleChange = (_: any, newMode: "csv" | "manual") => {
    setDataInputMode(newMode);
  };
  const variantNames = Object.keys(BadgeVariants);
  const variantLabels = [
    {
      col1: "License Number",
      col2: "Pass Level",
      placeholder1: "XTCAS-ASD1A",
      placeholder2: "1 | 2",
    },
    {
      col1: "Role",
      col2: "Name",
      placeholder1: "Nazim Jalsa Food",
      placeholder2: "John Doom",
    },
    {
      col1: "Role",
      col2: "Name",
      placeholder1: "Sadar Jamat Utrecht",
      placeholder2: "John Elden",
    },
  ];
  return (
    <Stack
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Stack
        width="100%"
        gap={2}
        alignItems="center"
        mt={generate ? "2vh" : "25vh"}
        sx={{ transition: "all .3s ease-in-out" }}
      >
        <Stack
          direction="row"
          width="100%"
          maxWidth="600px"
          justifyContent={generate ? "space-between" : "center"}
          alignItems="center"
        >
          <Fade in={generate}>
            <Button
              color="primary"
              onClick={() => {
                setBadgesData([]);
                setGenerate(false);
                setCSV(null);
                setExportProgress(0);
                setPdfBlobUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              sx={{
                display: generate ? "flex" : "none",
              }}
            >
              Reset
            </Button>
          </Fade>

          <Logo logoName="Badge" URL="/sheru/appLibrary/BadgeMaker" />

          <Stack direction="row">
            <IconButton
              size="small"
              onClick={() => setConfigOpen(true)}
              sx={{ mr: generate ? 2 : 0 }}
              color="primary"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>

            <Fade in={generate}>
              <Button
                loading={isExporting}
                loadingIndicator={<IOSLoader />}
                color="secondary"
                onClick={async () => {
                  if (!pdfBlobUrl) {
                    await handleExportPDF();
                  } else {
                    const link = document.createElement("a");
                    link.href = pdfBlobUrl;
                    link.download = "badges.pdf";
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }
                }}
                sx={{
                  display: generate ? "flex" : "none",
                }}
              >
                {isExporting
                  ? "Processing..."
                  : pdfBlobUrl
                    ? "Download PDF"
                    : "Export PDF"}
              </Button>
            </Fade>
          </Stack>
        </Stack>

        <Fade in={isExporting || showWorkerStatus}>
          <Stack width="80%" maxWidth="600px">
            <Typography align="center">
              {isExporting
                ? `Exporting ${exportProgress}%`
                : "Export Complete!"}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={exportProgress}
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor: exportFinished
                    ? "success.main"
                    : "primary.main",
                },
              }}
            />
            <WorkerProgressDisplay
              workerStatuses={workerStatuses}
              activeWorkers={activeWorkers}
              isExporting={isExporting}
              exportFinished={exportFinished}
              setShowWorkerStatus={setShowWorkerStatus}
            />
          </Stack>
        </Fade>

        {generate && (
          <Fade in={generate}>
            <Box
              sx={{
                width: "fit-content",
                display: generate ? "flex" : "none",
              }}
              px={1}
              className="APP_BadgeMaker"
            >
              <Stack gap={2} alignItems="center">
                {badgesData.slice(0, visibleCount).map((item, index) => {
                  if (!item.role || !item.name) return null;
                  if (item.role === "" || item.name === "") return null;
                  const Variant =
                    variantComponents[badgeVariant - 1] || variantComponents[0];
                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        exportRefs.current[index] = el;
                      }}
                      style={{
                        transform: "none",
                        transformOrigin: "top left",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      className="badge-export-container"
                    >
                      <Variant
                        role={item.role}
                        name={item.name}
                        preview={false}
                      />
                    </div>
                  );
                })}
              </Stack>
            </Box>
          </Fade>
        )}

        <Fade in={!generate}>
          <Stack gap={2}>
            <ToggleButtonGroup
              color="primary"
              value={dataInputMode}
              exclusive
              onChange={handleChange}
              aria-label="inputMode"
              sx={{
                display: generate ? "none" : "flex",
              }}
            >
              <ToggleButton value="csv">Upload CSV</ToggleButton>
              <ToggleButton value="manual">Manual Data</ToggleButton>
            </ToggleButtonGroup>

            <FormControl fullWidth>
              <InputLabel>Badge Variant</InputLabel>
              <Select
                size="small"
                value={badgeVariant}
                label="Badge Variant"
                onChange={(e) => {
                  setBadgeVariant(Number(e.target.value));
                }}
              >
                {variantNames.map((variantName, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {variantName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Fade>
      </Stack>

      <Fade in={!generate}>
        <Stack
          gap={2}
          maxWidth="600px"
          sx={{
            display: generate ? "none" : "flex",
          }}
        >
          {dataInputMode === "manual" && (
            <ExcelInput
              rows={rows}
              setRows={setRows}
              labels={variantLabels[badgeVariant - 1] || variantLabels[0]}
            />
          )}
          {dataInputMode === "csv" && (
            <Stack gap={2}>
              <Typography variant="h6" align="center">
                <strong>Upload a CSV file</strong>
              </Typography>
              {badgeVariant === 2 ? (
                <Typography
                  sx={{
                    backgroundColor: "background.paper",
                    padding: "1rem",
                    borderRadius: "4px",
                    fontWeight: 200,
                  }}
                  variant="h6"
                >
                  Role,Name
                  <br />
                  Manager,John Doe
                  <br />
                  Developer,Jane Smith
                  <br />
                  Designer,Emily Johnson
                </Typography>
              ) : (
                <Typography
                  sx={{
                    backgroundColor: "background.paper",
                    padding: "1rem",
                    borderRadius: "4px",
                    fontWeight: 200,
                  }}
                  variant="h6"
                >
                  CarNumber,PassLevel
                  <br />
                  XTC-ASDASD-12,1
                  <br />
                  XTC-ASDASD,2
                  <br />
                  <strong>Note!</strong>
                  <br />1 = Standard Entry
                  <br />2 = Complete Access
                </Typography>
              )}

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload CSV
                <VisuallyHiddenInput
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setCSV(e.target.files)}
                />
              </Button>
            </Stack>
          )}

          <Button
            color="secondary"
            disabled={
              dataInputMode === "csv"
                ? !csvFile
                : rows[0].col1 === "" && rows[0].col2 === ""
            }
            onClick={() => {
              if (csvFile) {
                setGenerate(true);
              } else {
                setBadgesData(
                  rows.slice(0, -1).map((r) => ({ role: r.col1, name: r.col2 }))
                );
                setGenerate(true);
              }
            }}
          >
            Generate Badges
          </Button>
        </Stack>
      </Fade>

      <WorkerConfig open={configOpen} onClose={() => setConfigOpen(false)} />
    </Stack>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  width: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
});

export default Home;
