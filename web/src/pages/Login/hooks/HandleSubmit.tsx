import { loginUser } from "../../../api/UserSevices";

export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  username: string,
  password: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  event.preventDefault();
  setLoading(true);
  setError("");

  // Validar campos
  if (!username || !password) {
    setError("Por favor, completa todos los campos.");
    setLoading(false);
    return;
  }

  try {
    const response = await loginUser(username, password);

    if (response.message === "Invalid credentials") {
      setError("Credenciales inválidas.");
      return;
    }
    localStorage.setItem("access_token", response.data.access_token);

    localStorage.setItem("nombre", response.data.user.nombre);
    localStorage.setItem("role", response.data.user.role);

    // Retornar el resultado para manejar la navegación en el componente
    return true; // Indica que el inicio de sesión fue exitoso
  } catch (error) {
    // Manejo de errores
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Ocurrió un error desconocido.");
    }
  } finally {
    setLoading(false); // Asegúrate de resetear el loading al final
  }
};
