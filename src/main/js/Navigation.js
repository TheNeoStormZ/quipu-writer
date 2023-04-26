const React = require("react");
const ReactDOM = require("react-dom/client");
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";

import { Link as LinkRouter } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

const pages = ["historia", "personaje"];
const iconosNav = [<CollectionsBookmarkIcon key="CollectionsBookmarkIcon" />, <PeopleAltIcon key="PeopleAltIcon" />];
const urls = ["/", "/personajes"];
const urls_add = ["/historias", "/personajes"];
const settings = ["Cuenta", "Cerrar sesión"];

function ResponsiveAppBar() {

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElAdd, setAnchorElAdd] = React.useState(null);


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenAddMenu = (event) => {
    setAnchorElAdd(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseAddMenu = () => {
    setAnchorElAdd(null);
  };

  const handleLogOut = () => {
    document.cookie =
      "token" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
  };

  const [value, setValue] = React.useState();

  React.useEffect(() => {
    const storedValue = localStorage.getItem("bottomNavigationValue");
    if (storedValue) {
      setValue(Number(storedValue));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("bottomNavigationValue", value);
  }, [value]);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalLibraryIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Quipu
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              showLabels
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                boxShadow: "0 -1px 4px rgba(0,0,0,0.12)",
                backgroundColor: "#9eaae7",
              }}
            >
              {pages.map((page, index) => (
                <BottomNavigationAction
                  key={page}
                  label={`Mis ${page}s`}
                  icon={iconosNav[index]}
                  component={LinkRouter}
                  to={urls[index]}
                  onClick={() => {
                    setValue(index);
                    localStorage.setItem("bottomNavigationValue", index);
                  }}
                />
              ))}
              <SpeedDial
                ariaLabel="Acciones de añadir"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
              >
                {pages.map((page, index) => (
                  <SpeedDialAction
                    key={page}
                    component={LinkRouter}
                    to={urls_add[index] + "/new"}
                    icon={iconosNav[index]}
                    tooltipTitle={`Crear ${page}`}
                  />
                ))}
              </SpeedDial>
            </BottomNavigation>
          </Box>

          <LocalLibraryIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />

          <Typography
            variant="h5"
            noWrap
            component={LinkRouter}
            to={"/"}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Quipu
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                component={LinkRouter}
                to={urls[index]}
              >
                {iconosNav[index]} Mis {page}s
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            <Tooltip title="Añadir elementos">
              <IconButton onClick={handleOpenAddMenu} sx={{ p: 0 }}>
                <LibraryAddIcon sx={{ display: "flex", mr: 2 }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-add-appbar"
              anchorEl={anchorElAdd}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElAdd)}
              onClose={handleCloseAddMenu}
            >
              {pages.map((page, index) => (
                <MenuItem
                  key={page}
                  component={LinkRouter}
                  to={urls_add[index] + "/new"}
                >
                  <Typography textAlign="center">Crear {page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Cuenta">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={settings[0]} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{settings[0]}</Typography>
              </MenuItem>
              <MenuItem key={settings[1]} onClick={handleLogOut}>
                <Typography textAlign="center">{settings[1]}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
