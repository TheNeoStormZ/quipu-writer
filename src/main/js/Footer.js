const React = require("react");
const ReactDOM = require("react-dom/client");
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "./Copyright";




const pages = ["historia", "personaje"];
const iconosNav = [<CollectionsBookmarkIcon />, <PeopleAltIcon />];
const urls = ["/", "/personajes"];
const urls_add = ["/historias", "/personajes"];
const settings = ["Cuenta", "Cerrar sesión"];



function Footer() {
  
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Acerca de
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Quipu, un proyecto para los que sueñan a lo grande
        </Typography>
        <Copyright />
    </Box>
  );
}
export default Footer;
