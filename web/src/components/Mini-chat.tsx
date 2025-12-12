import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  IconButton, 
  Typography,
  List,
  ListItem,
  Divider,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { handleProductoOption, ProductosModule } from "./chat/Productos";
import { ClientesModule, handleClienteOption } from "./chat/ClientesModule";
import { handleProveedorOption, ProveedoresModule } from "./chat/ProveedoresModule";
import { handleTecnicoOption, TecnicosModule } from "./chat/TecnicosModule";
import { handleVentasOption, VentasModule } from "./chat/VentaModule";
import { ComprasModule, handleComprasOption } from "./chat/CompraModule";
import { handleServicioOption, ServiciosModule } from "./chat/ServicioModule";
import { handleMaterialOption, MaterialesModule } from "./chat/MaterialModule";
import { GastosModule, handleGastoOption } from "./chat/GastoModule";

interface MiniChatProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  sender: "user" | "assistant";
  text: string;
  options?: { label: string; value: string }[];
}

const MiniChat: React.FC<MiniChatProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState("initial");

  // Auto scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mensaje de bienvenida al abrir el chat
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        sendAssistantMessage(
          "¡Hola! Soy el asistente virtual del sistema. ¿Sobre qué módulo deseas consultar?",
          [
            { label: "Productos", value: "productos" },
            { label: "Clientes", value: "clientes" },
            { label: "Proveedores", value: "proveedores" },
            { label: "Técnicos", value: "tecnicos" },
            { label: "Ventas", value: "ventas" },
            { label: "Compra", value: "compra" },
            { label: "Servicios", value: "servicio" },
            { label: "Material", value: "material" },
            { label: "Gastos", value: "gastos" },
            // Puedes habilitar otras secciones si las implementas
          ]
        );
        setStage("initial");
      }, 700);
    }
  }, [open]);

  // -------------------------------
  // Envío de mensajes
  // -------------------------------
  const sendUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text }]);
  };

  const sendAssistantMessage = (
    text: string,
    options?: { label: string; value: string }[]
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "assistant", text, options },
      ]);
      setIsTyping(false);
    }, 600);
  };

  // -------------------------------
  // Secciones principales
  // -------------------------------
  const sections: Record<
    string,
    { message: string; options: { label: string; value: string }[] }
  > = {
    productos: ProductosModule(),
    clientes: ClientesModule(),
    proveedores: ProveedoresModule(),
    tecnicos: TecnicosModule(),
    ventas: VentasModule(),
    compra: ComprasModule(),
    servicio: ServiciosModule(),
    material: MaterialesModule(),
    gastos: GastosModule(),
  };

  // -------------------------------
  // Manejo de opciones
  // -------------------------------
  const onOptionClick = (value: string) => {
    sendUserMessage(value);

    if (value === "inicio") {
      setStage("initial");
      sendAssistantMessage(
        "Perfecto, volvamos al inicio. ¿Qué módulo deseas consultar?",
        Object.keys(sections).map((k) => ({
          label: k.replace("_", " ").toUpperCase(),
          value: k,
        }))
      );
      return;
    }

    if (sections[value]) {
      setStage(value);
      sendAssistantMessage(sections[value].message, sections[value].options);
      return;
    }

    if (stage === "productos") {
      const response = handleProductoOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

    if (stage === "clientes") {
      const response = handleClienteOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }
     if (stage === "proveedores") {
      const response = handleProveedorOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

     if (stage === "tecnicos") {
      const response = handleTecnicoOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

      if (stage === "ventas") {
      const response = handleVentasOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

      if (stage === "compra") {
      const response = handleComprasOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

    if (stage === "servicio") {
      const response = handleServicioOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

    if (stage === "material") {
      const response = handleMaterialOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }

    if (stage === "gastos") {
      const response = handleGastoOption(value);
      sendAssistantMessage(response.text, response.options);
      return;
    }
    // Respuesta genérica para opciones desconocidas
    sendAssistantMessage(
      `Has seleccionado la opción: "${value}". Puedes pedirme más detalles si deseas.`,
      [{ label: "Volver al inicio", value: "inicio" }]
    );
  };

  // -------------------------------
  // Envío de texto libre
  // -------------------------------
/*   const onSend = () => {
    if (!input.trim()) return;

    sendUserMessage(input);

    if (stage === "productos" && input.toLowerCase().includes("precio")) {
      sendAssistantMessage(
        "Para consultar el precio del producto, dime su nombre o código.",
        [{ label: "Volver al inicio", value: "inicio" }]
      );
    } else {
      sendAssistantMessage(
        "He recibido tu mensaje. ¿Deseas consultar otra cosa?",
        [{ label: "Volver al inicio", value: "inicio" }]
      );
    }

    setInput("");
  }; */

  // -------------------------------
  // UI del Chat
  // -------------------------------
if (!open) return null;

  return (
  <Paper
    elevation={4}
    sx={{
      position: "fixed",
      bottom: 20,
      right: 20,
      width: { xs: "90%", sm: 360 },
      height: { xs: "70vh", sm: 520 },
      borderRadius: 3,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header */}
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.primary.main,
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6">
        <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
        Asistente Virtual
      </Typography>
      <IconButton onClick={onClose} sx={{ color: "white" }}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* Mensajes */}
    <List sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
      {messages.map((m) => (
        <ListItem
          key={m.id}
          sx={{
            justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
            flexDirection: "column",
            alignItems: m.sender === "user" ? "flex-end" : "flex-start",
          }}
        >
          <Box
            sx={{
              maxWidth: "100%",
              bgcolor:
                m.sender === "user"
                  ? theme.palette.primary.light
                  : theme.palette.grey[300],
              color: m.sender === "user" ? "white" : "#000",
              p: 1.2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            {m.text}
          </Box>

          {m.options && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {m.options.map((o) => (
                <Button
                  key={o.value}
                  size="small"
                  variant="outlined"
                  onClick={() => onOptionClick(o.value)}
                >
                  {o.label}
                </Button>
              ))}
            </Box>
          )}
        </ListItem>
      ))}

      {isTyping && (
        <ListItem>
          <Typography fontStyle="italic">
            El asistente está escribiendo...
          </Typography>
        </ListItem>
      )}

      <div ref={messagesEndRef} />
    </List>

    {/* Eliminamos el Input y botón Send */}
    <Divider />
  </Paper>
);
};

export default MiniChat;
