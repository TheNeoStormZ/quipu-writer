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

import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function DataTable(props) {
  // Obtener los datos del prop data
  const data = props.data;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const importData = (data) => {
    setPage(newPage);
  };

  const navigate = useNavigate();

  function handleImport(personaje) {
    // Crear un nuevo objeto simple
    var personaje_clean = {};

    // Obtener las claves del objeto complejo
    var claves = Object.keys(personaje);

    // Iterar sobre las claves y asignar los valores al nuevo objeto
    for (var i = 0; i < claves.length; i++) {
      var clave = claves[i];
      var valor = personaje[clave].value;
      if(clave=="descripcion") {
        personaje_clean[clave] = valor.split(".")[0];
      } else {
      personaje_clean[clave] = valor;
    }
    }

    // Mostrar el nuevo objeto simple
    localStorage.setItem("personaje", JSON.stringify(personaje_clean));
    setTimeout(navigate("/personaje/update"), 20);
  }

  // Renderizar una tabla con MaterialUI
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Genero</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Lugar de nacimiento
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha de nacimiento
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Importar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell> {item.nombre?.value}</TableCell>
                  <TableCell>{item.genero?.value}</TableCell>
                  <TableCell>{item.lugarNacimiento?.value}</TableCell>
                  <TableCell>{item.fechaNacimiento?.value}</TableCell>
                  <TableCell>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ ml: 1 }}
                      onClick={() => handleImport(item)}
                    >
                      Importar de DBPedia
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
