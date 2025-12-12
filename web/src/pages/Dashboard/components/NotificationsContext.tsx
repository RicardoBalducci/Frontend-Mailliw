"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import NotificacionesServices, { Notificacion, NotificacionesResponse } from "../../../api/NotificacionesServices";

interface NotificationsContextProps {
  notificaciones: Notificacion[];
  loading: boolean;
  refrescarNotificaciones: () => Promise<void>; // 🔹 Renombrado
}

export const NotificationsContext = createContext<NotificationsContextProps>({
  notificaciones: [],
  loading: true,
  refrescarNotificaciones: async () => {},
});

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Función que actualiza completamente las notificaciones
  const refrescarNotificaciones = async () => {
    setLoading(true);
    try {
      const resp: NotificacionesResponse = await NotificacionesServices.getBajoStock();
      setNotificaciones(resp.data);
    } catch (err) {
      console.error("Error cargando notificaciones", err);
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    refrescarNotificaciones();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notificaciones, loading, refrescarNotificaciones }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook conveniente
export const useNotifications = () => useContext(NotificationsContext);
