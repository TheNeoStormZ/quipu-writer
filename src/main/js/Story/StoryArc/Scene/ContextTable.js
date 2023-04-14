const React = require("react");
const ReactDOM = require("react-dom");

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import Link from '@mui/material/Link';

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

  // Renderizar una tabla con MaterialUI
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Evento</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <TableRow key={index}>
              <TableCell> <Link href={item.source.value} component="a" target="_blank">{item.title.value}</Link></TableCell>
              <TableCell>{item.date.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[5,10, 25, 100]}
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