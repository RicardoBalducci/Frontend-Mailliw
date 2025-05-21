import React, { createContext, useContext, useState } from "react";

// Definimos el tipo de datos del usuario
interface User {
  username: string;
  email: string;
  id: number;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Creamos el contexto
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Proveedor del contexto
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  return useContext(UserContext);
};
