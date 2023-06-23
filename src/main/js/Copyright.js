const React = require("react");
const ReactDOM = require("react-dom/client");
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";



function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Este proyecto usa{" "}
      <Link color="inherit" href="https://mui.com/">
       MIUI
      </Link>
      {"."}
    </Typography>
  );
}

export default Copyright;
