const React = require("react");
const ReactDOM = require("react-dom");

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function DataTable(props) {
  // Obtener los datos del prop data
  const data = props.data;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const personaje = JSON.parse(localStorage.getItem("personaje"));
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function convertirFecha(fechaOriginal) {
    // Crear objeto Date a partir de la fecha original
    if (fechaOriginal == null) {
      return undefined;
    }
    let fecha = new Date(fechaOriginal);
  
    // Obtener componentes de la fecha
    let dia = fecha.getDate().toString().padStart(2, "0");
    let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    let anio = fecha.getFullYear().toString();
  
    // Formatear la fecha en la cadena deseada
    let fechaFormateada = `${dia}-${mes}-${anio}`;
  
    return fechaFormateada;
  }

  function handleRemove(relacion) {

    axios
    .delete("/api/personajes/relaciones/remove/" + relacion.id + "/personaje/" + personaje.id)
    .then((response) => {
      setTimeout(navigate("/personajes"), 20);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Renderizar una tabla con MaterialUI
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Personajes involucrados
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell> {item.descripcion}</TableCell>
                  <TableCell>{convertirFecha(item.fecha)}</TableCell>
                  <TableCell>
                    {item.personajesInvolucrados
                      .map((personaje) => personaje.nombre)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="submit"
                      color="error"
                      variant="contained"
                      sx={{ ml: 1 }}
                      onClick={() => handleRemove(item)}
                    >
                      Sacar de la relación
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default DataTable;
