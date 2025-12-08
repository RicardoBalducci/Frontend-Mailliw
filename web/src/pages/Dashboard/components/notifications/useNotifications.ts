"use client";

import { useEffect, useState } from "react";
import NotificacionesServices, {
  Notificacion,
  NotificacionesResponse,
} from "../../../../api/NotificacionesServices";

export function useNotifications() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarNotificaciones = async () => {
    try {
      const resp: NotificacionesResponse = await NotificacionesServices.getBajoStock();
      setNotificaciones(resp.data); // ✅ ahora sí
    } catch (error) {
      console.error("Error cargando notificaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  return { notificaciones, loading, refrescar: cargarNotificaciones };
}
