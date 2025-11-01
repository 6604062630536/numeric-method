import { useState, useEffect } from "react";
import { Form, Table } from "react-bootstrap";
import Button from "@mui/material/Button";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import "./styles.css";
import { LineChart } from "@mui/x-charts/LineChart";
import { useNavigate } from "react-router-dom";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import axios from "axios";
import NewtonRaphsonMethod from "./classes/NewtonRaphsonMethod";

const NewtonRaphson = () => {
  const navigate = useNavigate();

  // สร้าง instance ของ NewtonRaphsonMethod
  const [newtonRaphson] = useState(
    () => new NewtonRaphsonMethod("x^2-7", "2*x")
  );

  const [data, setData] = useState([]);
  const [html, setHtml] = useState(null);
  const [Equation, setEquation] = useState("x^2-7");
  const [Differential, setDifferential] = useState("2*x");
  const [X, setX] = useState(0);
  const [X0, setX0] = useState(0);

  const [fXmData, setFXmData] = useState([]);
  const [xValues, setXValues] = useState([]);

  // Update table HTML when data changes
  useEffect(() => {
    const print = (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th width="10%">Iteration</th>
            <th width="30%">X0</th>
            <th width="30%">X1</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => (
            <tr key={index}>
              <td>{element.iteration}</td>
              <td>{element.X0}</td>
              <td>{element.X1}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
    setHtml(print);
  }, [data]);

  const inputEquation = (event) => {
    const newEquation = event.target.value;
    setEquation(newEquation);
    try {
      newtonRaphson.setEquation(newEquation);
    } catch (error) {
      console.error("Invalid equation:", error.message);
    }
  };

  const inputDifferential = (event) => {
    const newDifferential = event.target.value;
    setDifferential(newDifferential);
    try {
      newtonRaphson.setDerivative(newDifferential);
    } catch (error) {
      console.error("Invalid derivative:", error.message);
    }
  };

  const inputX0 = (event) => {
    setX0(event.target.value);
  };

  const calculateRoot = () => {
    const x0num = parseFloat(X0);

    if (isNaN(x0num)) {
      alert("X0 ต้องเป็นตัวเลข!");
      return;
    }

    try {
      // ตั้งค่าและคำนวณด้วย OOP method
      newtonRaphson.setEquation(Equation);
      newtonRaphson.setDerivative(Differential);
      newtonRaphson.setInitialValue(x0num);

      const results = newtonRaphson.calculate();

      // อัปเดต state
      setData(results.data);
      setX(results.result);

      // ดึงข้อมูลกราฟ
      const chartData = newtonRaphson.getChartData();
      setXValues(chartData.xValues);
      setFXmData(chartData.yValues);

      navigate("/NewtonRaphson");

      // บันทึกลง database
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/save/rootequation/all`,
          { equation: Equation },
          { headers: { "Content-Type": "application/json" } }
        )
        .catch((error) => {
          console.error("Error saving to database:", error);
        });
    } catch (error) {
      alert(error.message);
      console.error("Calculation error:", error);
    }
  };

  const loadEquation = async () => {
    try {
      if (!process.env.REACT_APP_API_URL) {
        alert("⚠️ กรุณาตั้งค่า REACT_APP_API_URL ในไฟล์ .env");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/load/rootequation/all`,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        }
      );

      if (
        response.data &&
        response.data.equations &&
        response.data.equations.length > 0
      ) {
        const eq = response.data.equations[0].equation;
        setEquation(eq);
        newtonRaphson.setEquation(eq);
        console.log("✅ Loaded equation:", eq);
      } else {
        alert("ไม่พบสมการในฐานข้อมูล");
      }
    } catch (error) {
      console.error("Error loading equation:", error);

      if (error.code === "ECONNABORTED") {
        alert(
          "⏱️ การเชื่อมต่อหมดเวลา กรุณาตรวจสอบว่า Backend Server ทำงานอยู่"
        );
      } else if (error.response) {
        alert(`❌ Server Error: ${error.response.status}`);
      } else if (error.request) {
        alert("❌ ไม่สามารถเชื่อมต่อกับ Server ได้");
      } else {
        alert(`❌ เกิดข้อผิดพลาด: ${error.message}`);
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      <h2>Newton Raphson Method</h2>
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={5}>
          <Paper sx={{ p: 2 }} elevation={2}>
            <Form>
              <Form.Group className="mb-3 custom-input">
                <Form.Label>INPUT f(X)</Form.Label>
                <input
                  type="text"
                  id="equation"
                  value={Equation}
                  onChange={inputEquation}
                  style={{ width: "100%", marginBottom: "20px" }}
                  className="form-control"
                />
                <Form.Label>INPUT f'(X)</Form.Label>
                <input
                  type="text"
                  id="Differential"
                  value={Differential}
                  onChange={inputDifferential}
                  style={{ width: "100%", marginBottom: "20px" }}
                  className="form-control"
                />
                <Form.Label>INPUT X0</Form.Label>
                <input
                  type="number"
                  id="X0"
                  value={X0}
                  onChange={inputX0}
                  style={{ width: "100%", marginBottom: "20px" }}
                  className="form-control"
                />
              </Form.Group>
              <Button
                variant="contained"
                onClick={calculateRoot}
                sx={{ backgroundColor: "#3f51b5", color: "#fff" }}
              >
                Calculate
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  marginLeft: "10px",
                }}
                onClick={loadEquation}
              >
                <ShuffleOnIcon />
              </Button>
            </Form>
          </Paper>
          <Paper elevation={2}>
            <LineChart
              xAxis={[{ data: xValues || [] }]}
              series={[
                {
                  data: fXmData || [],
                  label: "f(Xm) per Iteration",
                  type: "line",
                },
              ]}
              width={600}
              height={350}
              style={{ marginTop: "20px" }}
            />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper sx={{ p: 2 }} elevation={2}>
            <h3>Answer = {X.toPrecision(7)}</h3>
            <Container>{html}</Container>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewtonRaphson;
