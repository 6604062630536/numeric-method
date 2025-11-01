import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import LagrangeInterpolation from "./classes/LagrangeInterpolation";

const Lagrange = () => {
  const navigate = useNavigate();

  // สร้าง instance ของ LagrangeInterpolation
  const [lagrange] = useState(() => new LagrangeInterpolation());

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

  const Calculation = () => {
    try {
      // ตั้งค่าข้อมูล
      lagrange.setPoints(data);
      lagrange.setXValue(xValue);

      // คำนวณ
      const results = lagrange.calculate();

      // ดึงผลลัพธ์
      setResult(results.result);

      // ดึง Lagrange terms สำหรับแสดงผล
      const lagrangeTerms = lagrange.getBasisPolynomials();

      setHtml(print(lagrangeTerms));

      navigate("/Lagrange");

      // แสดงข้อมูลเพิ่มเติมใน console
      console.log("Basis Polynomials:", lagrange.getBasisPolynomials());
      console.log("Contributions:", lagrange.getContributions());
      console.log("Polynomial:", lagrange.getPolynomialString());
      console.log("Verification:", lagrange.verifyResult());
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

  const print = (lagrangeTerms) => {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            {lagrangeTerms.map((_, index) => (
              <th width="15%" key={index}>
                L{index}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {lagrangeTerms.map((value, index) => (
              <td key={index}>
                {value !== 0 && !isNaN(value) ? value.toFixed(4) : ""}
              </td>
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
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
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

export default Lagrange;
