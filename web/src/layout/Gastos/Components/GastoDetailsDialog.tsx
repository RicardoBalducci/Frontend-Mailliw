import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Grid,
  Alert, // Added for error display
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Gasto, gastosService } from "../../../api/GastosServices"; // Import gastosService
import { format } from "date-fns/format";
import { NewGastoDialog } from "./AddGasto";
import { DeleteGastoDialog } from "./DeleteGastoDialog";
import { UpdateGastoDialog } from "./UpdateGastoDialog"; // Import the new dialog
import { formatNumber } from "../../../utils/format";

interface GastoDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  gastos: Gasto[];
  onAddAnotherGasto?: (date: Date) => void;
  onEditGasto?: (gastoId: number) => void; // This prop might become redundant if we handle edit internally
  onGastoAddedSuccessfully: () => void; // This will also trigger refresh after update/delete
}

export const GastoDetailsDialog: React.FC<GastoDetailsDialogProps> = ({
  open,
  onClose,
  gastos,
  onAddAnotherGasto,
  onGastoAddedSuccessfully, // Renamed for clarity, now covers add/update/delete success
}) => {
  const theme = useTheme();
  const [isNewGastoDialogOpen, setIsNewGastoDialogOpen] = useState(false);
  const [dateForNewGasto, setDateForNewGasto] = useState<Date | null>(null);
const [dollarOficial, setDollarOficial] = useState<number>(1)

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial")
    if (storedDollar) setDollarOficial(Number(storedDollar))
  }, [])
  // States for delete functionality
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [gastoToDeleteId, setGastoToDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // States for update functionality
  const [isUpdateGastoDialogOpen, setIsUpdateGastoDialogOpen] = useState(false);
  const [gastoToEdit, setGastoToEdit] = useState<Gasto | null>(null);

  const totalGastosAmount = gastos.reduce(
    (sum, gasto) => sum + parseFloat(String(gasto.monto_gastado)),
    0
  );

  const expenseDate =
    gastos.length > 0 && gastos[0].fecha ? new Date(gastos[0].fecha) : null;

  const handleAddClick = () => {
    if (expenseDate) {
      setDateForNewGasto(expenseDate);
      setIsNewGastoDialogOpen(true);
    }
    if (onAddAnotherGasto && expenseDate) {
      onAddAnotherGasto(expenseDate);
    }
  };

  const handleCloseNewGastoDialog = () => {
    setIsNewGastoDialogOpen(false);
    setDateForNewGasto(null);
  };

  const handleGastoAddedOrUpdated = () => {
    onGastoAddedSuccessfully(); // This will fetch the updated list of gastos
    // Close the GastoDetailsDialog after any successful operation (add, update, delete)
    onClose();
  };

  // Open the update dialog and pass the gasto data
  const handleEditClick = (gastoId: number) => {
    const gasto = gastos.find((g) => g.id === gastoId);
    if (gasto) {
      setGastoToEdit(gasto);
      setIsUpdateGastoDialogOpen(true);
    }
  };

  const handleCloseUpdateGastoDialog = () => {
    setIsUpdateGastoDialogOpen(false);
    setGastoToEdit(null);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (gastoId: number) => {
    setGastoToDeleteId(gastoId);
    setOpenDeleteDialog(true);
  };

  // Close the delete confirmation dialog and optionally the main dialog
  const handleCloseDeleteDialog = (shouldCloseMainDialog: boolean = false) => {
    setOpenDeleteDialog(false);
    setGastoToDeleteId(null);
    setDeleteError(null);
    if (shouldCloseMainDialog) {
      onClose(); // Close the GastoDetailsDialog
    }
  };

  // Function to actually delete the gasto via service
  const confirmDeleteGasto = async (id: number) => {
    try {
      await gastosService.deleteGasto(id);
      onGastoAddedSuccessfully(); // Call this to refresh the parent's data (Gastos component)
      handleCloseDeleteDialog(true); // Close both delete and main dialogs after successful deletion
    } catch (error) {
      console.error("Error deleting gasto:", error);
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Hubo un error al eliminar el gasto.");
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: theme.shadows[10] } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            p: 2,
          }}
        >
          <Box display="flex" alignItems="center">
            <MonetizationOnIcon sx={{ mr: 1, fontSize: "2rem" }} />
            <Typography variant="h5" component="span" fontWeight="bold">
              Detalles de gastos del Día
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="medium"
            sx={{ color: theme.palette.primary.contrastText }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, bgcolor: theme.palette.grey[50] }}>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}

          {gastos.length > 0 ? (
            <>
             <Box
  sx={{
    mb: 3,
    display: "flex",
    gap: 2,
    justifyContent: "center",
  }}
>
  {/* Caja en dólares */}
  <Box
    sx={{
      p: 2,
      bgcolor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      borderRadius: 2,
      textAlign: "center",
      flex: 1,
      boxShadow: theme.shadows[2],
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      Total gastado ($):
    </Typography>
    <Typography
      variant="h5"
      color={theme.palette.primary.dark}
      fontWeight="bold"
    >
      ${formatNumber(totalGastosAmount)}
    </Typography>
  </Box>

  {/* Caja en bolívares */}
  <Box
    sx={{
      p: 2,
      bgcolor: theme.palette.primary.dark,
      color: theme.palette.secondary.contrastText,
      borderRadius: 2,
      textAlign: "center",
      flex: 1,
      boxShadow: theme.shadows[2],
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      Total gastado (Bs):
    </Typography>
    <Typography
      variant="h5"
      color={theme.palette.secondary.light}
      fontWeight="bold"
    >
      Bs. {formatNumber(totalGastosAmount * dollarOficial)}
    </Typography>
  </Box>
</Box>


              <Grid container spacing={2}>
                {gastos.map((gasto) => (
                  <Grid>
                    {" "}
                    {/* Added key and grid sizing */}
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        borderColor: theme.palette.divider,
                        boxShadow: theme.shadows[1],
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[4],
                        },
                        minHeight: "180px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={1}
                        >
                          <Typography
                            variant="h6"
                            component="h3"
                            fontWeight="bold"
                            color="primary.dark"
                          >
                            {gasto.concepto && gasto.concepto.length > 15
                              ? `${gasto.concepto.substring(0, 15)}...` // Increased truncation length
                              : gasto.concepto}
                          </Typography>
                          <Chip
                            label={gasto.tipo_gasto.toUpperCase()}
                            size="small"
                            color={
                              gasto.tipo_gasto === "fijo" ? "info" : "warning"
                            }
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              height: "18px",
                              padding: "0 4px",
                              marginLeft: "4px",
                              "& .MuiChip-label": {
                                px: "4px",
                              },
                            }}
                          />
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" alignItems="center" mt={1}>
                          <AttachMoneyIcon
                            color="action"
                            sx={{ mr: 1, fontSize: "1.2rem" }}
                          />
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            Monto: $
                            {parseFloat(String(gasto.monto_gastado)).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <CalendarTodayIcon
                            color="action"
                            sx={{ mr: 1, fontSize: "1.2rem" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Fecha:{" "}
                            {gasto.fecha
                              ? format(new Date(gasto.fecha), "dd/MM/yyyy")
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(gasto.id)}
                            sx={{ mr: 1 }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(gasto.id)}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {/* Add another expense Card */}
                <Grid>
                  {" "}
                  {/* Added grid sizing */}
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                      boxShadow: theme.shadows[1],
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[4],
                        bgcolor: theme.palette.action.hover,
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "180px",
                      cursor: "pointer",
                    }}
                    onClick={handleAddClick}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <AddCircleOutlineIcon
                        sx={{
                          fontSize: "3rem",
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="h6"
                        color="text.primary"
                        fontWeight="bold"
                      >
                        Añadir Otro Gasto
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        para esta misma fecha
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight={150}
              textAlign="center"
            >
              <Typography variant="h6" color="text.secondary" mb={1}>
                ¡Parece que no hay gastos aquí!
              </Typography>
              <Typography variant="body2" color="text.disabled">
                No se han registrado gastos para la fecha seleccionada.
              </Typography>
              {expenseDate && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleAddClick}
                >
                  Añadir Gasto para el {format(expenseDate, "dd/MM/yyyy")}
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
            sx={{ px: 3, py: 1 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* NewGastoDialog component */}
      <NewGastoDialog
        open={isNewGastoDialogOpen}
        onClose={handleCloseNewGastoDialog}
        selectedDate={dateForNewGasto}
        onGastoAdded={handleGastoAddedOrUpdated}
      />

      {/* DeleteGastoDialog component */}
      <DeleteGastoDialog
        open={openDeleteDialog}
        onClose={() => handleCloseDeleteDialog(false)} // Pass false to keep main dialog open on cancel
        gastoId={gastoToDeleteId}
        onConfirmDelete={confirmDeleteGasto}
      />

      {/* UpdateGastoDialog component */}
      <UpdateGastoDialog
        open={isUpdateGastoDialogOpen}
        onClose={handleCloseUpdateGastoDialog}
        gastoToEdit={gastoToEdit}
        onGastoUpdated={handleGastoAddedOrUpdated}
      />
    </>
  );
};
