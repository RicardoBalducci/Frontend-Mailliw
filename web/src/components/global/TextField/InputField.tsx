import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

type InputFieldProps = TextFieldProps & {
  startIcon?: React.ReactNode;
  large?: boolean;
  onlyNumbers?: boolean;
  onlyLetters?: boolean;  // ✅ NUEVO
  errorMessage?: string;
  maxLength?: number;
  minLength?: number;
};

const InputField: React.FC<InputFieldProps> = ({
  startIcon,
  large = false,
  onlyNumbers = false,
  onlyLetters = false,   // ✅ NUEVO
  errorMessage,
  maxLength,
  minLength,
  sx,
  onInput,
  ...props
}) => {
  const hasError = Boolean(errorMessage);

  return (
    <TextField
      {...props}
      fullWidth
      margin="normal"
      error={hasError}
      helperText={errorMessage || ""}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        ...props.InputProps,
      }}
      inputProps={{
        ...(onlyNumbers
          ? {
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInput: (e: React.FormEvent<HTMLInputElement>) => {
                const target = e.currentTarget;
                target.value = target.value.replace(/\D/g, "");

                if (maxLength) {
                  target.value = target.value.slice(0, maxLength);
                }

                if (onInput) onInput(e);
              },
            }
          : {}),

        ...(onlyLetters
          ? {
              inputMode: "text",
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ ]*",
              onInput: (e: React.FormEvent<HTMLInputElement>) => {
                const target = e.currentTarget;
                target.value = target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "");

                if (maxLength) {
                  target.value = target.value.slice(0, maxLength);
                }

                if (onInput) onInput(e);
              },
            }
          : {}),

        ...(maxLength ? { maxLength } : {}),
        ...(minLength ? { minLength } : {}),
        ...props.inputProps,
      }}
      sx={{
        "& .MuiInputBase-root": {
          minHeight: large ? 58 : undefined,
        },
        ...sx,
      }}
    />
  );
};

export default InputField;
