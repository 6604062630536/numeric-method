import React from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

import AutocompleteInput from "./AutocompleteInput";
import Navbar from "./Navbar";
import Home from "./Home";
import Bisection from "./Bisection";
import FalsePosition from "./FalsePosition";
import NewtonRaphson from "./NewtonRaphson";
import SecantMethod from "./SecantMethod";
import CalCramerRule from "./CramerRule";
import NewtonDivided from "./NewtonDivided";
import Lagrange from "./Lagrange";

const App = () => {
  const navigate = useNavigate();

  const handleAutocompleteChange = (event, value) => {
    if (value === "False Position Method") {
      navigate("/FalsePosition");
    } else if (value === "Bisection Method") {
      navigate("/Bisection");
    } else if (value === "Newton Raphson Method") {
      navigate("/NewtonRaphson");
    } else if (value === "Secant Method") {
      navigate("/SecantMethod");
    } else if (value === "Cramer's Rule") {
      navigate("/CramerRule");
    } else if (value === "Newton's Divided Difference") {
      navigate("/NewtonDivided");
    } else if (value === "Lagrange's Interpolation") {
      navigate("/Lagrange");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <AutocompleteInput onChange={handleAutocompleteChange} />
      </Box>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Bisection" element={<Bisection />} />
        <Route path="/FalsePosition" element={<FalsePosition />} />
        <Route path="/NewtonRaphson" element={<NewtonRaphson />} />
        <Route path="/SecantMethod" element={<SecantMethod />} />
        <Route path="/CramerRule" element={<CalCramerRule />} />
        <Route path="/NewtonDivided" element={<NewtonDivided />} />
        <Route path="/Lagrange" element={<Lagrange />} />
      </Routes>
    </>
  );
};

export default App;
