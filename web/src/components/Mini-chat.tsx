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
  Button, // Import Button for options
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles"; // Import useTheme for palette access
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface MiniChatProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  sender: "user" | "gemini";
  text: string;
  options?: { label: string; value: string }[]; // Optional options for Gemini messages
}

const MiniChat: React.FC<MiniChatProps> = ({ open, onClose }) => {
  const theme = useTheme(); // Access theme for colors
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState(0); // 0: initial, 1: products, 2: technicians, 3: expenses

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize chat with a welcome message and options when it opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            sender: "gemini",
            text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            options: [
              { label: "Información de productos", value: "productos" },
              { label: "Ayuda con un técnico", value: "tecnicos" },
              { label: "Pregunta sobre gastos", value: "gastos" },
              { label: "Contactar a soporte", value: "soporte" },
            ],
          },
        ]);
        setConversationStage(0); // Reset stage when chat is opened for the first time
      }, 500);
    }
  }, [open, messages.length]);

  // Function to handle sending a message (user or option click)
  const sendMessage = (messageText: string, isOption: boolean = false) => {
    if (!isOption && messageText.trim() === "") return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: messageText.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate Gemini response based on predefined logic
    let geminiResponseText =
      "No estoy seguro de cómo responder a eso. ¿Puedes ser más específico o elegir una de las opciones?";
    let nextOptions: { label: string; value: string }[] | undefined;
    let nextStage = conversationStage;

    if (isOption) {
      switch (messageText) {
        case "productos":
          geminiResponseText =
            "Claro, ¿qué tipo de información necesitas sobre nuestros productos? Por ejemplo, puedes preguntar sobre 'precio', 'stock' o 'descripción'.";
          nextOptions = [
            { label: "Precio de productos", value: "precio_productos" },
            { label: "Stock de productos", value: "stock_productos" },
            {
              label: "Descripción de productos",
              value: "descripcion_productos",
            },
            { label: "Volver al inicio", value: "inicio" },
          ];
          nextStage = 1;
          break;
        case "tecnicos":
          geminiResponseText =
            "Entendido. ¿Necesitas 'agendar una cita', 'consultar un técnico' o 'reportar un problema'?";
          nextOptions = [
            { label: "Agendar cita", value: "agendar_cita" },
            { label: "Consultar técnico", value: "consultar_tecnico" },
            { label: "Reportar problema", value: "reportar_problema" },
            { label: "Volver al inicio", value: "inicio" },
          ];
          nextStage = 2;
          break;
        case "gastos":
          geminiResponseText =
            "Para ayudarte con los gastos, ¿quieres 'registrar un gasto', 'ver historial' o 'generar un informe'?";
          nextOptions = [
            { label: "Registrar gasto", value: "registrar_gasto" },
            { label: "Ver historial de gastos", value: "historial_gastos" },
            { label: "Generar informe de gastos", value: "informe_gastos" },
            { label: "Volver al inicio", value: "inicio" },
          ];
          nextStage = 3;
          break;
        case "soporte":
          geminiResponseText =
            "Para contactar a soporte, puedes llamarnos al +1 (689) 686-4045 o enviar un correo a kppabonduque18@gmail.com";
          nextOptions = [{ label: "Volver al inicio", value: "inicio" }];
          nextStage = 0; // Back to initial stage after providing contact info
          break;
        case "inicio":
          geminiResponseText =
            "De acuerdo, volvamos al inicio. ¿En qué más puedo ayudarte?";
          nextOptions = [
            { label: "Información de productos", value: "productos" },
            { label: "Ayuda con un técnico", value: "tecnicos" },
            { label: "Pregunta sobre gastos", value: "gastos" },
            { label: "Contactar a soporte", value: "soporte" },
          ];
          nextStage = 0;
          break;
        // Add more nested cases for specific product/technician/expense queries if desired
        default:
          geminiResponseText =
            "Recibido. Dime en qué más puedo asistirte dentro de esta sección.";
          nextOptions = [{ label: "Volver al inicio", value: "inicio" }];
          // For now, keep the stage to allow more specific questions within the same topic
          break;
      }
    } else {
      // Basic free-text response simulation (can be expanded)
      if (
        messageText.toLowerCase().includes("hola") ||
        messageText.toLowerCase().includes("qué tal")
      ) {
        geminiResponseText =
          "¡Hola! ¿Cómo te encuentras? Recuerda que puedes elegir una de las opciones para guiar la conversación.";
        nextOptions = [
          { label: "Información de productos", value: "productos" },
          { label: "Ayuda con un técnico", value: "tecnicos" },
          { label: "Pregunta sobre gastos", value: "gastos" },
          { label: "Contactar a soporte", value: "soporte" },
        ];
        nextStage = 0;
      } else if (
        conversationStage === 1 &&
        messageText.toLowerCase().includes("precio")
      ) {
        geminiResponseText =
          "Para consultar el precio de un producto, por favor, indícame el nombre o código del producto.";
      } else if (
        conversationStage === 1 &&
        messageText.toLowerCase().includes("stock")
      ) {
        geminiResponseText =
          "Para consultar el stock, ¿me puedes dar el nombre o código del producto?";
      } else if (
        conversationStage === 1 &&
        messageText.toLowerCase().includes("descripción")
      ) {
        geminiResponseText =
          "Para darte la descripción, ¿qué producto te interesa?";
      }
      // Add more specific free-text response logic for other stages here
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "gemini",
          text: geminiResponseText,
          options: nextOptions,
        },
      ]);
      setConversationStage(nextStage);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleOptionClick = (value: string) => {
    sendMessage(value, true); // Send the option value as a message
  };

  if (!open) {
    return null;
  }

  return (
    <Paper
      elevation={5}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: { xs: "90%", sm: 350, md: 400 },
        height: { xs: "70vh", sm: 500, md: 550 },
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        zIndex: 1500,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography variant="h6">
          <ChatBubbleOutlineIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Asistente Virtual
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            sx={{
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              p: 0.5,
              flexDirection: "column", // Stack text and options vertically
              alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: "80%",
                bgcolor:
                  msg.sender === "user"
                    ? theme.palette.primary.light
                    : theme.palette.grey[300],
                color:
                  msg.sender === "user" ? "white" : theme.palette.text.primary,
                p: 1.2,
                borderRadius: 2,
                borderBottomLeftRadius: msg.sender === "user" ? 12 : 2,
                borderBottomRightRadius: msg.sender === "user" ? 2 : 12,
                wordBreak: "break-word",
                boxShadow: 1,
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
            {msg.options && msg.sender === "gemini" && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 1,
                  justifyContent: "flex-start", // Align options with message
                  maxWidth: "80%",
                }}
              >
                {msg.options.map((option) => (
                  <Button
                    key={option.value}
                    variant="outlined"
                    size="small"
                    onClick={() => handleOptionClick(option.value)}
                    sx={{
                      borderRadius: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
            )}
          </ListItem>
        ))}
        {isTyping && (
          <ListItem sx={{ justifyContent: "flex-start", p: 0.5 }}>
            <Box
              sx={{
                maxWidth: "80%",
                bgcolor: theme.palette.grey[300],
                color: theme.palette.text.primary,
                p: 1.2,
                borderRadius: 2,
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 12,
                boxShadow: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                El asistente está escribiendo...
              </Typography>
            </Box>
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>
      <Divider />
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: (theme) => alpha(theme.palette.grey[100], 0.8),
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ mr: 1 }}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        />
        <Fab
          size="small"
          color="primary"
          onClick={() => sendMessage(input)}
          disabled={input.trim() === ""}
          sx={{
            minWidth: "40px",
            width: "40px",
            height: "40px",
            "& .MuiSvgIcon-root": {
              fontSize: "1.2rem",
            },
          }}
        >
          <SendIcon />
        </Fab>
      </Box>
    </Paper>
  );
};

export default MiniChat;
