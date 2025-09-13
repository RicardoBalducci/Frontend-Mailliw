"use client";

import { styled, alpha } from "@mui/material/styles";
import { Paper, Button, TextField, Alert } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(15px)",
  border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  letterSpacing: "0.02em",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.9),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 12,
  backdropFilter: "blur(10px)",
  border: "1px solid",
  fontWeight: 500,
  "& .MuiAlert-icon": {
    fontSize: "1.2rem",
  },
  "&.MuiAlert-standardInfo": {
    backgroundColor: alpha(theme.palette.info.main, 0.1),
    borderColor: alpha(theme.palette.info.main, 0.2),
    color: theme.palette.info.dark,
  },
  "&.MuiAlert-standardError": {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    borderColor: alpha(theme.palette.error.main, 0.2),
    color: theme.palette.error.dark,
  },
  "&.MuiAlert-standardSuccess": {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    borderColor: alpha(theme.palette.success.main, 0.2),
    color: theme.palette.success.dark,
  },
}));
