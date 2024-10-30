import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const Lagrange = () => {
  const navigate = useNavigate();
  const [html, setHtml] = useState(null);
  const [data, setData] = useState([
    { x: 0, y: 9.81 },
    { x: 20000, y: 9.7487 },
    { x: 40000, y: 9.6879 },
    { x: 60000, y: 9.6879 },
    { x: 80000, y: 9.5682 },
  ]);

  const [xValue, setValue] = useState(42000);
  const [result, setResult] = useState(null);

  const CalLagrange = (x, y) => {
    const n = x.length;
    let func = Array.from({ length: n }, () => 1); // สร้าง array สำหรับเก็บค่าของ L_i(x)

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (i !== j) {
          func[j] *= (xValue - x[i]) / (x[j] - x[i]); // คำนวณค่า L_i(x)
        }
      }
    }
    return func;
  };

  const Calculation = () => {
    const x = data.map((item) => item.x);
    const y = data.map((item) => item.y);

    const func = CalLagrange(x, y); // ฟังก์ชันเก็บค่า L_i(x)
    setHtml(print(func)); // แสดงผลในตาราง
    let calculatedResult = 0;
    const n = x.length;

    for (let j = 0; j < n; j++) {
      calculatedResult += y[j] * func[j]; // คำนวณค่า y ที่จุด x ที่กำหนด
    }
    setResult(calculatedResult.toPrecision(7));
    navigate("/Lagrange");
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
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const print = (func) => {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            {func.map((_, index) => (
              <th width="15%" key={index}>
                L{index}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {func.map((value, index) => (
              <td key={index}>{value !== 0 ? value.toFixed(4) : ""}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      <h2>Lagrange Interpolation</h2>
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
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              type="number"
              InputProps={{ inputProps: { step: "any" } }}
            />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper sx={{ p: 3 }}>
            {result !== null && <h3>Answer = {result}</h3>}
            {html}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Lagrange;
