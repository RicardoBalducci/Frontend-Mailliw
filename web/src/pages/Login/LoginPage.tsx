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
  const navigate = useNavigate(); // Asegúrate de importar useNavigate desde react-router-dom

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
      onSubmit={onSubmit} // Manejar el envío del formulario
      sx={{
        width: "400px",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo blanco semi-transparente
        borderRadius: "8px",
        padding: 3,
        position: "absolute", // Posicionamiento absoluto para centrar
        top: "50%", // Centrado vertical
        left: "50%", // Centrado horizontal
        transform: "translate(-50%, -50%)", // Ajuste para centrar completamente
      }}
    >
      <img
        src="/Logo.png"
        alt=""
        style={{ width: "20%", display: "block", margin: "0 auto" }} // Tamaño en % y centrado
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
        value={username} // Vincular el valor del campo
        onChange={(e) => setUsername(e.target.value)} // Actualizar el estado
        error={!!error} // Establecer el campo en rojo si hay un error
      />
      <TextField
        id="outlined-password-input"
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        fullWidth
        margin="normal"
        value={password} // Vincular el valor del campo
        onChange={(e) => setPassword(e.target.value)} // Actualizar el estado
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!error} // Establecer el campo en rojo si hay un error
      />
      <Button
        variant="contained"
        fullWidth
        style={{
          marginTop: "16px",
          height: "50px",
          backgroundColor: "#FFBB3C", // Color dorado
          color: "black",
          fontWeight: "400",
          fontSize: "16px",
          fontFamily: "Montserrat, sans-serif",
        }} // Color dorado
        type="submit" // Establecer el tipo de botón como "submit"
        disabled={loading} // Deshabilitar el botón si está cargando
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
