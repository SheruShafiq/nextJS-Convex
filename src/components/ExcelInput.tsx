import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
export type RowData = { col1: string; col2: string };
export type ExcelInputProps = {
  rows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  labels: {
    col1: string;
    col2: string;
    placeholder1: string;
    placeholder2: string;
  };
};

const ExcelLikeTable: React.FC<ExcelInputProps> = ({
  rows,
  setRows,
  labels,
}) => {
  const handlePaste = (
    e: React.ClipboardEvent,
    startIndex: number
  ) => {
    const clipboard = e.clipboardData.getData("text");
    if (!clipboard) return;
    const lines = clipboard.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length === 0) return;
    e.preventDefault();
    const newRows = [...rows];
    lines.forEach((line, i) => {
      const cols = line.split(/\t|,/);
      const rowIndex = startIndex + i;
      if (!newRows[rowIndex]) newRows[rowIndex] = { col1: "", col2: "" };
      if (cols[0] !== undefined) newRows[rowIndex].col1 = cols[0];
      if (cols[1] !== undefined) newRows[rowIndex].col2 = cols[1];
    });
    if (
      newRows[newRows.length - 1].col1 !== "" ||
      newRows[newRows.length - 1].col2 !== ""
    ) {
      newRows.push({ col1: "", col2: "" });
    }
    setRows(newRows);
  };

  const handleInputChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    if (
      index === rows.length - 1 &&
      (newRows[index].col1.trim() !== "" || newRows[index].col2.trim() !== "")
    ) {
      setRows([...newRows, { col1: "", col2: "" }]);
    }
  };

  useEffect(() => {
    const validRows = rows.filter(
      (r) => r.col1.trim() !== "" || r.col2.trim() !== ""
    );
    if (validRows.length === 0) return;
    const timer = setTimeout(() => {
      //TODO: Convex function
      // logExcelInput(validRows, () => {}, () => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [rows]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" fontWeight={600}>
                {labels.col1}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" fontWeight={600}>
                {labels.col2}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              sx={{
                border: "none",
              }}
              key={index}
            >
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  size="small"
                  value={row.col1}
                  onChange={(e) =>
                    handleInputChange(index, "col1", e.target.value)
                  }
                  onPaste={(e) => handlePaste(e, index)}
                  fullWidth
                  variant="standard"
                  placeholder={labels.placeholder1}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }}>
                <TextField
                  size="small"
                  value={row.col2}
                  onChange={(e) =>
                    handleInputChange(index, "col2", e.target.value)
                  }
                  onPaste={(e) => handlePaste(e, index)}
                  fullWidth
                  variant="standard"
                  placeholder={labels.placeholder2}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExcelLikeTable;
