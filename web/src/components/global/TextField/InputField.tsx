import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

type InputFieldProps = TextFieldProps & {
  startIcon?: React.ReactNode;
  large?: boolean;
  onlyNumbers?: boolean;
  errorMessage?: string; // ✅ nuevo: muestra mensaje de error en rojo
};

const InputField: React.FC<InputFieldProps> = ({
  startIcon,
  large = false,
  onlyNumbers = false,
  errorMessage,
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
      error={hasError} // activa el estilo rojo
      helperText={errorMessage || ""} // muestra el texto de error debajo
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
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/\D/g, ""); // elimina todo lo que no sea número
                if (onInput) onInput(e);
              },
            }
          : {}),
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
