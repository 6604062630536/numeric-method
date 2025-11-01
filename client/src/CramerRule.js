import React, { useState } from "react";
import { Grid, TextField, Button, Typography, MenuItem } from "@mui/material";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import CramerRuleMethod from "./classes/CramerRuleMethod";

const CalCramerRule = () => {
  const navigate = useNavigate();

  // สร้าง instance ของ CramerRuleMethod
  const [cramer] = useState(() => new CramerRuleMethod());

  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState(
    Array(3)
      .fill(0)
      .map(() => Array(3).fill(0))
  );
  const [results, setResults] = useState(Array(3).fill(0));
  const [solution, setSolution] = useState({});

  // Handle change in the matrix input fields
  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  // Handle change in the result values (constants)
  const handleResultChange = (row, value) => {
    const newResults = [...results];
    newResults[row] = parseFloat(value) || 0;
    setResults(newResults);
  };

  // Handle matrix size change
  const handleMatrixSizeChange = (size) => {
    setMatrixSize(size);
    setMatrix(
      Array(size)
        .fill(0)
        .map(() => Array(size).fill(0))
    );
    setResults(Array(size).fill(0));
    setSolution({});
  };

  // Calculate Cramer's rule
  const calculateCramer = () => {
    try {
      // ตั้งค่า matrix และ constants
      cramer.setMatrix(matrix);
      cramer.setConstants(results);

      // คำนวณ
      const calculationResult = cramer.calculate();

      // ดึงผลลัพธ์
      setSolution(calculationResult.result);

      navigate("/CramerRule");

      // แสดงข้อมูลเพิ่มเติมใน console
      console.log("Main Determinant (D):", cramer.getMainDeterminant());
      console.log("All Determinants:", cramer.getDeterminants());
      console.log("Solution Array:", cramer.getSolutionArray());
      console.log("Verification:", cramer.verifySolution());

      // แสดงสมการในรูปแบบ matrix
      console.log(cramer.printMatrix());
    } catch (error) {
      alert(error.message);
      console.error("Calculation error:", error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      <h2>Cramer's Rule</h2>
      <Grid
        container
        spacing={3}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {/* Matrix Size Selector */}
        <Grid item xs={12}>
          <TextField
            select
            label="Matrix Size"
            value={matrixSize}
            onChange={(e) => handleMatrixSizeChange(parseInt(e.target.value))}
            variant="outlined"
            sx={{ width: "150px" }}
          >
            <MenuItem value={2}>2x2</MenuItem>
            <MenuItem value={3}>3x3</MenuItem>
            <MenuItem value={4}>4x4</MenuItem>
            <MenuItem value={5}>5x5</MenuItem>
          </TextField>
        </Grid>

        {/* Matrix Input Section */}
        <Grid item xs={7}>
          <Paper sx={{ p: 2 }} elevation={2}>
            {matrix.map((row, rowIndex) => (
              <Grid container spacing={2} key={rowIndex} alignItems="center">
                {row.map((col, colIndex) => (
                  <Grid item key={colIndex}>
                    <TextField
                      label={`a${rowIndex + 1}${colIndex + 1}`}
                      variant="outlined"
                      size="small"
                      sx={{ m: 1, width: "110px" }}
                      value={matrix[rowIndex][colIndex]}
                      onChange={(e) =>
                        handleMatrixChange(rowIndex, colIndex, e.target.value)
                      }
                      type="number"
                      InputProps={{ inputProps: { step: "any" } }}
                    />
                  </Grid>
                ))}
                <Grid item>=</Grid>
                <Grid item>
                  <TextField
                    label={`d${rowIndex + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{ width: "110px" }}
                    value={results[rowIndex]}
                    onChange={(e) =>
                      handleResultChange(rowIndex, e.target.value)
                    }
                    type="number"
                    InputProps={{ inputProps: { step: "any" } }}
                  />
                </Grid>
              </Grid>
            ))}

            <Button
              variant="contained"
              color="primary"
              onClick={calculateCramer}
              sx={{ mt: 2 }}
            >
              Calculate
            </Button>
          </Paper>
        </Grid>

        {/* Answer Section */}
        <Grid item xs={4} justifyContent="flex-start">
          <Paper sx={{ p: 2 }} elevation={2}>
            {Object.keys(solution).length > 0 && (
              <div>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Solution :
                </Typography>
                {Object.keys(solution).map((key, index) => (
                  <Typography key={index}>
                    {key.toUpperCase()} = {solution[key].toPrecision(7)}
                  </Typography>
                ))}
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CalCramerRule;
