import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import logo from "./numlogo.png";
export default function Home() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ p: 2 }}>
        <Box
          sx={{
            bgcolor: "white",
            height: "200vh",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ width: 200, height: 200, mr: 2, cursor: "pointer" }}
          />
          <h2 className="mb-3 custom-input">
            Welcome to Numeric Method Calculator
          </h2>
        </Box>
      </Container>
    </React.Fragment>
  );
}
