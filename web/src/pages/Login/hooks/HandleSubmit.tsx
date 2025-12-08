import DolarServices from "../../../api/DolarServices";
import UserServices from "../../../api/UserSevices";

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

  if (!username || !password) {
    setError("Por favor, completa todos los campos.");
    setLoading(false);
    return;
  }

  try {
    const response = await UserServices.loginUser(username, password);

    if (response.message === "Invalid credentials") {
      setError("Credenciales inválidas.");
      return;
    }

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("nombre", response.data.user.nombre);
    localStorage.setItem("apellido", response.data.user.apellido);
    localStorage.setItem("role", response.data.user.role);

    // 👇 Llamada al método estático
    try {
      const dolarResponse = await DolarServices.getDolarToday();
      if (dolarResponse?.dollar_oficial) {
        localStorage.setItem(
          "dollar_oficial",
          dolarResponse.dollar_oficial.toString()
        );
      }
    } catch (error) {
      console.error("Error al obtener el dólar oficial:", error);
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Ocurrió un error desconocido.");
    }
  } finally {
    setLoading(false);
  }
};
