import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import logo from "./numlogo.png";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 2 }}>
        <Toolbar>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ width: 40, height: 40, mr: 2, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, color: "#3f51b5" }}
          >
            Numeric Method
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
