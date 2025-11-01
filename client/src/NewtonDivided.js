import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import NewtonDividedDifference from "./classes/NewtonDividedDifference";

const NewtonDivided = () => {
  const navigate = useNavigate();

  // สร้าง instance ของ NewtonDividedDifference
  const [newton] = useState(() => new NewtonDividedDifference());

  const [html, setHtml] = useState(null);
  const [data, setData] = useState([
    { x: 1891, y: 46 },
    { x: 1901, y: 66 },
    { x: 1911, y: 81 },
    { x: 1921, y: 93 },
  ]);
  const [xValue, setXValue] = useState(1895);
  const [result, setResult] = useState(null);

  const Calculation = () => {
    try {
      // ตั้งค่าข้อมูล
      newton.setPoints(data);
      newton.setXValue(xValue);

      // คำนวณ
      const results = newton.calculate();

      // ดึงผลลัพธ์
      setResult(results.result);

      // สร้างตารางแสดงผล
      const dividedDifferenceTable = newton.getDividedDifferenceTable();
      const xValues = newton.getXValues();

      setHtml(print(dividedDifferenceTable, xValues));

      navigate("/NewtonDivided");

      // แสดงข้อมูลเพิ่มเติมใน console
      console.log("Coefficients:", newton.getCoefficients());
      console.log("Polynomial:", newton.getPolynomialString());
      console.log("Verification:", newton.verifyResult());
    } catch (error) {
      alert(error.message);
      console.error("Calculation error:", error);
    }
  };

  const InputXY = (index, field, event) => {
    const newValue = event.target.value;
    const updatedData = [...data];
    updatedData[index][field] = parseFloat(newValue) || 0;
    setData(updatedData);
  };

  const addRow = () => {
    setData([...data, { x: 0, y: 0 }]);
  };

  const removeRow = (index) => {
    if (data.length <= 2) {
      alert("ต้องมีอย่างน้อย 2 จุดข้อมูล");
      return;
    }
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const print = (table, xValues) => {
    const n = table.length;

    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th width="15%">X</th>
            {Array.from({ length: n }, (_, index) => (
              <th width="20%" key={index}>
                C{index}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{xValues[rowIndex]}</td>
              {row.map((value, colIndex) => (
                <td key={colIndex}>
                  {value !== 0 && !isNaN(value) ? value.toFixed(4) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      <h2>Newton's Divided Difference Interpolation</h2>
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={5}>
          <Paper sx={{ p: 2 }} elevation={2}>
            {data.map((element, index) => (
              <div
                key={index}
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <TextField
                  label={`X${index + 1}`}
                  variant="outlined"
                  size="small"
                  sx={{ width: "110px", marginRight: "10px" }}
                  value={element.x}
                  onChange={(e) => InputXY(index, "x", e)}
                  type="number"
                  InputProps={{ inputProps: { step: "any" } }}
                />
                <TextField
                  label={`Y${index + 1}`}
                  variant="outlined"
                  size="small"
                  sx={{ width: "110px" }}
                  value={element.y}
                  onChange={(e) => InputXY(index, "y", e)}
                  type="number"
                  InputProps={{ inputProps: { step: "any" } }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeRow(index)}
                  sx={{ marginLeft: "10px" }}
                  disabled={data.length <= 2}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="contained"
              onClick={addRow}
              sx={{ marginTop: "10px", marginBottom: "10px" }}
            >
              Add Row
            </Button>

            <Button
              variant="contained"
              onClick={Calculation}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                marginLeft: "10px",
              }}
            >
              Calculate
            </Button>
            <TextField
              label="Input X Value"
              variant="outlined"
              size="small"
              sx={{ width: "230px", marginLeft: "10px", marginTop: "10px" }}
              value={xValue}
              onChange={(e) => setXValue(parseFloat(e.target.value) || 0)}
              type="number"
              InputProps={{ inputProps: { step: "any" } }}
            />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper sx={{ p: 3 }}>
            {result !== null && <h3>Answer = {result.toPrecision(7)}</h3>}
            {html}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewtonDivided;
