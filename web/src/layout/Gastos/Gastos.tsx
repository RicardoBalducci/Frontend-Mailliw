import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Fade,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import Calendar from "react-calendar"; // Import React Calendar
import "react-calendar/dist/Calendar.css"; // Default React Calendar styles
import "./GastosCalendar.css"; // <-- NEW: Import your custom CSS for the calendar
import { format, addMonths, isSameDay } from "date-fns"; // Import addMonths and isSameDay

import { Gasto as BaseGasto, gastosService } from "../../api/GastosServices";

// Extend Gasto type to allow isProjectedFixed for projected fixed expenses
type Gasto = BaseGasto & { isProjectedFixed?: boolean };
import { GastoDetailsDialog } from "./Components/GastoDetailsDialog";
import { NewGastoDialog } from "./Components/AddGasto";
import HeaderSection from "../../components/global/Header/header";
import { ArrowDownUp } from "lucide-react";
import GastosCard from "./Components/Card";

export function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGastos, setSelectedGastos] = useState<Gasto[]>([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    totalUsd: number;
    totalBs: number;
    count: number;
  } | null>(null);
  const [openNewGastoDialog, setOpenNewGastoDialog] = useState<boolean>(false);
  const [dateForNewGasto, setDateForNewGasto] = useState<Date | null>(null);


  const [dollarOficial, setDollarOficial] = useState<number>(1);

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial");
    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);
  const fetchGastosData = async () => {
    try {
      setLoading(true);
      const data = await gastosService.fetchAllGastos();
      setGastos(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching gastos in component:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Hubo un error al cargar los gastos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastosData();
  }, []);

  const dailyTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    const today = new Date(); // Get current date to limit future projections

    gastos.forEach((gasto) => {
      // Parse the date string directly without adding timezone information
      const initialDate = new Date(gasto.fecha);

      if (gasto.tipo_gasto === "fijo") {
        // Project fixed expenses monthly
        let projectedDate = initialDate;
        // Project up to a reasonable number of months in the future, e.g., 12 months
        // Or you can project until the end of the current calendar view's range
        for (let i = 0; i < 12; i++) {
          // Project for the next 12 months
          const dateKey = format(projectedDate, "yyyy-MM-dd");
          totals[dateKey] =
            (totals[dateKey] || 0) + parseFloat(gasto.monto_gastado);
          projectedDate = addMonths(projectedDate, 1); // Move to the next month
          // Stop projecting if the date goes too far into the future (e.g., beyond next year)
          if (projectedDate.getFullYear() > today.getFullYear() + 1) break;
        }
      } else {
        // Handle variable expenses normally
        const dateKey = format(initialDate, "yyyy-MM-dd");
        totals[dateKey] =
          (totals[dateKey] || 0) + parseFloat(gasto.monto_gastado);
      }
    });
    return totals;
  }, [gastos]);

  const gastosByDate = useMemo(() => {
    const grouped: { [key: string]: Gasto[] } = {};
    const today = new Date(); // Get current date

    gastos.forEach((gasto) => {
      const initialDate = new Date(gasto.fecha);

      if (gasto.tipo_gasto === "fijo") {
        let projectedDate = initialDate;
        for (let i = 0; i < 12; i++) {
          // Project for the next 12 months
          const dateKey = format(projectedDate, "yyyy-MM-dd");
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          // Create a new gasto object for the projected date to avoid modifying original
          // And add a flag to indicate it's a projected fixed expense
          grouped[dateKey].push({
            ...gasto,
            fecha: projectedDate.toISOString(), // Use the projected date
            isProjectedFixed: true, // Custom flag
          });
          projectedDate = addMonths(projectedDate, 1);
          if (projectedDate.getFullYear() > today.getFullYear() + 1) break;
        }
      } else {
        const dateKey = format(initialDate, "yyyy-MM-dd");
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(gasto);
      }
    });
    return grouped;
  }, [gastos]);

const handleDateClick = (date: Date) => {
  const dateKey = format(date, "yyyy-MM-dd");
  const dailyGastos = gastosByDate[dateKey];

  if (dailyGastos && dailyGastos.length > 0) {
    const totalUsd = dailyGastos.reduce(
      (sum, g) => sum + parseFloat(g.monto_gastado),
      0
    );

    const totalBs = totalUsd * dollarOficial;

    setSelectedDateInfo({
      totalUsd,
      totalBs,
      count: dailyGastos.length,
    });

    setSelectedGastos(dailyGastos);
    setOpenDetailsDialog(true);
  } else {
    // No hay gastos → mostrar 0
    setSelectedDateInfo({
      totalUsd: 0,
      totalBs: 0,
      count: 0,
    });

    setDateForNewGasto(date);
    setOpenNewGastoDialog(true);
  }
};


  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedGastos([]);
  };

  const handleCloseNewGastoDialog = () => {
    setOpenNewGastoDialog(false);
    setDateForNewGasto(null);
  };

  const handleGastoAdded = () => {
    fetchGastosData(); // Refresh the data after adding a new gasto
    handleCloseNewGastoDialog();
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateKey = format(date, "yyyy-MM-dd");
      const total = dailyTotals[dateKey];
      // You can add a special class for days with fixed expenses only
      const hasFixedOnly = gastosByDate[dateKey]?.every(
        (g) => g.tipo_gasto === "fijo" && g.isProjectedFixed
      );

      if (total) {
        return (
          <div
            className={`daily-expense-total ${
              hasFixedOnly ? "fixed-expense-day" : ""
            }`}
          >
            ${total.toFixed(2)}
          </div>
        );
      }
    }
    return null;
  };

  // Add a tileClassName to apply different styles to days with fixed expenses
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateKey = format(date, "yyyy-MM-dd");
      // Check if this date has any projected fixed expenses (and not original ones)
      const isProjectedFixedDay = gastosByDate[dateKey]?.some(
        (gasto) => gasto.isProjectedFixed
      );

      // You might also want to differentiate original fixed expenses from projected ones
      // For simplicity, this checks for any fixed expense on that day
      const hasOriginalFixedExpense = gastosByDate[dateKey]?.some(
        (gasto) =>
          gasto.tipo_gasto === "fijo" &&
          !gasto.isProjectedFixed &&
          isSameDay(new Date(gasto.fecha), date)
      );

      if (isProjectedFixedDay && !hasOriginalFixedExpense) {
        return "projected-fixed-expense-day"; // Apply a class for projected fixed expenses
      }
    }
    return null;
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderSection
              title="Gestión de Gastos"
              icon={<ArrowDownUp />}
              chipLabel={`${gastos.length} gastos registrados`}
            />

            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={300}
              >
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Cargando gastos...
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {!loading && !error && (
              
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <GastosCard
                count={selectedDateInfo?.count ?? 0}
                totalBs={selectedDateInfo?.totalBs ?? 0}
                totalUsd={selectedDateInfo?.totalUsd ?? 0}
              />
                <Calendar
                  onClickDay={handleDateClick}
                  value={null}
                  locale="es"
                  tileContent={tileContent}
                  tileClassName={tileClassName} // Apply the new class name
                  className="my-custom-calendar"
                />
              </Paper>
            )}
          </Box>
        </Fade>
      </Container>
      <GastoDetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        gastos={selectedGastos}
        onGastoAddedSuccessfully={fetchGastosData} // Refresh data after adding
      />
      <NewGastoDialog
        open={openNewGastoDialog}
        onClose={handleCloseNewGastoDialog}
        selectedDate={dateForNewGasto}
        onGastoAdded={handleGastoAdded}
      />
    </>
  );
}
