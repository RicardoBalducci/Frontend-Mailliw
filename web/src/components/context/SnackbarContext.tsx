import React, { createContext, useContext, useState } from "react";
import GlobalSnackbar from "../global/GlobalSnackbar";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showSnackbar = (
    msg: string,
    sev: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <GlobalSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar debe usarse dentro de un SnackbarProvider");
  }
  return context;
};
