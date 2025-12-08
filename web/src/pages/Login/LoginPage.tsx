import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "./hooks/HandleSubmit";
import { keyframes } from "@emotion/react";

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

  // Animaciones
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const pulseBg = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #5569ff, #7c3aed, #3b82f6)",
        backgroundSize: "200% 200%",
        animation: `${pulseBg} 10s ease infinite`,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <Paper
        component="form"
        elevation={8}
        onSubmit={onSubmit}
        sx={{
          width: "420px",
          borderRadius: "20px",
          padding: 4,
          backgroundColor: "rgba(255,255,255,0.95)",
          textAlign: "center",
          animation: `${fadeIn} 1s ease`,
        }}
      >
        <img
          src="/Logo5.png"
          alt="Logo"
          style={{
            width: "90px",
            margin: "0 auto 20px",
            display: "block",
            animation: "scaleIn 1s ease",
          }}
        />
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "600",
            marginBottom: "24px",
            color: "#334155", // gris azulado para contraste
          }}
        >
          Iniciar sesión
        </h1>

        <TextField
          label="Nombre de usuario"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!error}
          sx={{
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#5569ff",
                boxShadow: "0 0 6px #5569ff",
              },
            },
          }}
        />

        <TextField
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
          sx={{
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#5569ff",
                boxShadow: "0 0 6px #5569ff",
              },
            },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading}
          sx={{
            mt: 3,
            height: "50px",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #5569ff, #3b82f6)",
            color: "white",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              background: "linear-gradient(90deg, #4455dd, #2563eb)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Continuar"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};