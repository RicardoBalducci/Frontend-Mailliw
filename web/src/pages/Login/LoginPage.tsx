import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "./hooks/HandleSubmit";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const success = await handleSubmit(
      event,
      username,
      password,
      setLoading,
      setError
    );
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
      sx={{
        width: "400px",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white background
        borderRadius: "8px",
        padding: 3,
        position: "absolute", // Absolute positioning for centering
        top: "50%", // Vertical centering
        left: "50%", // Horizontal centering
        transform: "translate(-50%, -50%)", // Adjust to center completely
      }}
    >
      <img
        src="/Logo4.jpeg"
        alt=""
        style={{ width: "20%", display: "block", margin: "0 auto" }} // Size in % and centered
      />
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "16px",
        }}
      >
        Iniciar sesión
      </h1>
      <TextField
        id="outlined-basic"
        label="Nombre de usuario"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!error}
      />
      <TextField
        id="outlined-password-input"
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!error}
      />
      <Button
        variant="contained"
        fullWidth
        style={{
          marginTop: "16px",
          height: "50px",
          backgroundColor: "#5569ff", // Changed to your specified color
          color: "white", // Changed text color to white for better contrast
          fontWeight: "400",
          fontSize: "16px",
          fontFamily: "Montserrat, sans-serif",
        }}
        type="submit"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Continuar"}
      </Button>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2, marginTop: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
