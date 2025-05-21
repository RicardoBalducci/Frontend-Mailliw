import { useEffect, useState } from "react";
import { Container, Paper, TextField, Button, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ClienteServices from "../../api/ClientServices"; // Adjust the path as needed

export function Home() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "rif", headerName: "RIF", width: 130 },
    { field: "nombre", headerName: "Nombre", width: 130 },
    { field: "apellido", headerName: "Apellido", width: 130 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "telefono", headerName: "Teléfono", width: 130 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleModify(params.row)}
            sx={{ marginRight: 1 }}
          >
            Modificar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await ClienteServices.fetchClientes(); // Llamar al servicio
        setRows(data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  interface ClienteRow {
    id: number;
    rif: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
  }

  const handleModify = (row: ClienteRow): void => {
    // Implementar lógica para modificar el cliente
    console.log("Modificar cliente:", row);
    // Aquí puedes abrir un modal o un formulario para editar el cliente
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      console.log("Cliente eliminado ID:", id);
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Container>
      <Paper sx={{ padding: 2, backgroundColor: "white" }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Buscar"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: "70%" }}
          />
          <Button variant="contained" color="primary" sx={{ marginLeft: 1 }}>
            Añadir
          </Button>
        </Box>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
}
