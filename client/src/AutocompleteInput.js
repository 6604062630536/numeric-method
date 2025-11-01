import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const options = [
  "Bisection Method",
  "False Position Method",
  "Newton Raphson Method",
  "Secant Method",
  "Newton's Divided Difference",
  "Lagrange's Interpolation",
  "Cramer's Rule",
];

const AutocompleteInput = ({ onChange }) => {
  return (
    <Autocomplete
      options={options}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Method"
          variant="outlined"
          sx={{ width: 300 }}
        />
      )}
    />
  );
};

export default AutocompleteInput;
