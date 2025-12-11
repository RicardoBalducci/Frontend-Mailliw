// ---------------------------------------------
// MINI CHAT AMPLIADO CON TODAS LAS SECCIONES
// ---------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  List,
  ListItem,
  Divider,
  Fab,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

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
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState("initial");

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        sendAssistantMessage(
          "¡Hola! Soy el asistente virtual del sistema. ¿Sobre qué módulo deseas consultar?",
          [
            { label: "Ventas", value: "ventas" },
            { label: "Compras", value: "compras" },
            { label: "Productos", value: "productos" },
            { label: "Servicios", value: "servicios" },
            { label: "Materiales", value: "materiales" },
            { label: "Proveedores", value: "proveedores" },
            { label: "Clientes", value: "clientes" },
            { label: "Personal", value: "personal" },
            { label: "Historial de Ventas", value: "historial_ventas" },
            { label: "Historial de Compras", value: "historial_compras" },
          ]
        );
        setStage("initial");
      }, 700);
    }
  }, [open]);

  // ---------------------------------------------
  //           ENVÍO DE MENSAJES
  // ---------------------------------------------

  const sendUserMessage = (text: string) => {
    const msg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const sendAssistantMessage = (
    text: string,
    options?: { label: string; value: string }[]
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      const msg: ChatMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text,
        options,
      };
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
    }, 600);
  };

  // ---------------------------------------------
  //      RESPUESTAS POR SECCIÓN (INTELIGENTES)
  // ---------------------------------------------

  const sections: Record<
    string,
    { message: string; options: { label: string; value: string }[] }
  > = {
    ventas: {
      message:
        "Aquí puedes consultar información del módulo de *Ventas*. ¿Qué deseas hacer?",
      options: [
        { label: "Registrar venta", value: "registrar_venta" },
        { label: "Ver ventas", value: "ver_ventas" },
        { label: "Buscar venta por ID", value: "venta_id" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    compras: {
      message:
        "Aquí tienes opciones sobre el módulo de *Compras*. ¿Qué deseas saber?",
      options: [
        { label: "Registrar compra", value: "registrar_compra" },
        { label: "Ver compras", value: "ver_compras" },
        { label: "Buscar compra por ID", value: "compra_id" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    productos: {
      message:
        "Módulo de *Productos*: aquí puedes consultar la información de inventario.",
      options: [
        { label: "Precio de productos", value: "precio_productos" },
        { label: "Consultar stock", value: "stock_productos" },
        { label: "Ver productos", value: "ver_productos" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    servicios: {
      message:
        "En el módulo de *Servicios* puedes gestionar servicios, asignaciones o tipos.",
      options: [
        { label: "Tipos de servicios", value: "tipos_servicio" },
        { label: "Servicios disponibles", value: "servicios_disponibles" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    materiales: {
      message:
        "El módulo de *Materiales* te permite administrar el inventario técnico.",
      options: [
        { label: "Ver materiales", value: "ver_materiales" },
        { label: "Material por ID", value: "material_id" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    proveedores: {
      message:
        "En *Proveedores* puedes gestionar quién suministra tus productos o materiales.",
      options: [
        { label: "Lista de proveedores", value: "ver_proveedores" },
        { label: "Buscar proveedor", value: "proveedor_id" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    clientes: {
      message:
        "Bienvenido al módulo de *Clientes*. ¿Qué deseas consultar o gestionar?",
      options: [
        { label: "Lista de clientes", value: "ver_clientes" },
        { label: "Buscar cliente por ID", value: "cliente_id" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    personal: {
      message:
        "En *Personal* (usuarios / técnicos) puedes consultar información interna.",
      options: [
        { label: "Ver personal", value: "ver_personal" },
        { label: "Buscar técnico", value: "tecnico_id" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    historial_ventas: {
      message: "Historial completo de ventas disponibles para análisis.",
      options: [
        { label: "Ver historial de ventas", value: "ver_historial_ventas" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
    historial_compras: {
      message: "Historial completo de compras registradas.",
      options: [
        { label: "Ver historial de compras", value: "ver_historial_compras" },
        { label: "Volver al inicio", value: "inicio" },
      ],
    },
  };

  // ---------------------------------------------
  //              MANEJO DE OPCIONES
  // ---------------------------------------------

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

    // Si es una de las secciones principales
    if (sections[value]) {
      setStage(value);
      sendAssistantMessage(sections[value].message, sections[value].options);
      return;
    }

    // Sub-opciones: puedes expandirlas con lógica real
    sendAssistantMessage(
      `Has seleccionado la opción: "${value}".  
      Puedes pedirme más detalles si deseas.`,
      [{ label: "Volver al inicio", value: "inicio" }]
    );
  };

  // ---------------------------------------------
  //            ENVÍO DE TEXTO LIBRE
  // ---------------------------------------------

  const onSend = () => {
    if (!input.trim()) return;

    sendUserMessage(input);

    // Respuestas inteligentes dependiendo del stage
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
  };

  // ---------------------------------------------
  //                  UI
  // ---------------------------------------------

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
      {/* HEADER */}
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

      {/* MENSAJES */}
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
                maxWidth: "80%",
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

      {/* INPUT */}
      <Divider />
      <Box sx={{ p: 2, display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <Fab size="small" color="primary" onClick={onSend}>
          <SendIcon />
        </Fab>
      </Box>
    </Paper>
  );
};

export default MiniChat;
