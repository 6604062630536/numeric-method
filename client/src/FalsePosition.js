// client/src/FalsePosition.js
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
import FalsePositionMethod from "./classes/FalsePositionMethod";

const FalsePosition = () => {
  const navigate = useNavigate();

  // สร้าง instance ของ FalsePositionMethod
  const [falsePosition] = useState(() => new FalsePositionMethod("2x^3-2x-5"));

  const [data, setData] = useState([]);
  const [html, setHtml] = useState(null);
  const [Equation, setEquation] = useState("2x^3-2x-5");
  const [X, setX] = useState(0);
  const [XL, setXL] = useState(0);
  const [XR, setXR] = useState(0);

  const [errorData, setErrorData] = useState([]);
  const [xValues, setXValues] = useState([]);

  // Update table HTML when data changes
  useEffect(() => {
    const print = (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th width="10%">Iteration</th>
            <th width="30%">XL</th>
            <th width="30%">XM</th>
            <th width="30%">XR</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => (
            <tr key={index}>
              <td>{element.iteration}</td>
              <td>{element.Xl}</td>
              <td>{element.Xm}</td>
              <td>{element.Xr}</td>
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
      falsePosition.setEquation(newEquation);
    } catch (error) {
      console.error("Invalid equation:", error.message);
    }
  };

  const inputXL = (event) => {
    setXL(event.target.value);
  };

  const inputXR = (event) => {
    setXR(event.target.value);
  };

  const calculateRoot = () => {
    const xlnum = parseFloat(XL);
    const xrnum = parseFloat(XR);

    if (isNaN(xlnum) || isNaN(xrnum)) {
      alert("XL และ XR ต้องเป็นตัวเลข!");
      return;
    }

    try {
      // ตั้งค่าและคำนวณด้วย OOP method
      falsePosition.setEquation(Equation);
      falsePosition.setInitialValues(xlnum, xrnum);

      const results = falsePosition.calculate();

      // อัปเดต state
      setData(results.data);
      setX(results.result);

      // ดึงข้อมูลกราฟ
      const chartData = falsePosition.getChartData();
      setErrorData(chartData.yValues);
      setXValues(chartData.xValues);

      navigate("/FalsePosition");

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
        falsePosition.setEquation(eq);
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
      <h2>False Position Method</h2>
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
                  style={{
                    width: "100%",
                    margin: "0 auto",
                    marginBottom: "20px",
                  }}
                  className="form-control"
                />
                <Form.Label>INPUT XL</Form.Label>
                <input
                  type="number"
                  id="XL"
                  value={XL}
                  onChange={inputXL}
                  style={{
                    width: "100%",
                    margin: "0 auto",
                    marginBottom: "20px",
                  }}
                  className="form-control"
                />
                <Form.Label>INPUT XR</Form.Label>
                <input
                  type="number"
                  id="XR"
                  value={XR}
                  onChange={inputXR}
                  style={{
                    width: "100%",
                    margin: "0 auto",
                    marginBottom: "20px",
                  }}
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
                  data: errorData || [],
                  label: "f(Xm) per XL",
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

export default FalsePosition;
