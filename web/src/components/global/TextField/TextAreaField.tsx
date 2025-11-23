import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

type TextAreaFieldProps = TextFieldProps & {
  startIcon?: React.ReactNode;
  rows?: number;
  errorMessage?: string; // ✅ Nuevo: muestra mensaje de error
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  startIcon,
  rows = 5,
  sx,
  errorMessage,
  ...props
}) => {
  const hasError = Boolean(errorMessage);

  return (
    <TextField
      {...props}
      fullWidth
      margin="normal"
      multiline
      rows={rows}
      error={hasError}
      helperText={errorMessage || ""}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        ...props.InputProps,
      }}
      sx={{
        "& .MuiInputBase-root": {
          minHeight: rows >= 5 ? 100 : undefined, // opcional: da un poco más de altura
        },
        ...sx,
      }}
    />
  );
};

export default TextAreaField;
