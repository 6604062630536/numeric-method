import { useState, useEffect } from "react";
import { Form, Table } from "react-bootstrap";
import Button from "@mui/material/Button";
import { evaluate } from "mathjs";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import "./styles.css";
import { LineChart } from "@mui/x-charts/LineChart";
import { useNavigate } from "react-router-dom";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import axios from "axios";

const NewtonRaphson = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [html, setHtml] = useState(null);
  const [Equation, setEquation] = useState("x^2 -7");
  const [Differential, setDifferential] = useState("2*x");
  const [X, setX] = useState(0);
  const [X0, setX0] = useState(0);

  const [fXmData, setFXmData] = useState([]); // เก็บค่า f(Xm) ของแต่ละ Iteration
  const [xValues, setXValues] = useState([]); // Iteration แสดงบนกราฟ

  const CalNewtonRaphson = (x0) => {
    let fX0,
      fXd,
      x1,
      fXm,
      ea = 100;
    let iter = 0;
    const MAX = 50;
    const e = 0.00001;
    const newData = [];
    const fXmArr = []; // Array เก็บค่า f(Xm)
    const iterArr = [];

    do {
      fX0 = evaluate(Equation, { x: x0 });
      fXd = evaluate(Differential, { x: x0 });

      x1 = x0 - fX0 / fXd;
      fXm = evaluate(Equation, { x: x1 }); // คำนวณ f(Xm) ของแต่ละรอบ Iteration

      iter++;
      iterArr.push(iter);
      fXmArr.push(fXm); // เก็บค่า f(Xm) ในแต่ละรอบ

      ea = Math.abs((x1 - x0) / x1) * 100;
      newData.push({ iteration: iter, X0: x0, X1: x1 });

      x0 = x1;
    } while (ea > e && iter < MAX);

    setData(newData);
    setX(x0);
    setXValues(iterArr);
    setFXmData(fXmArr); // อัปเดตค่า f(Xm) สำหรับกราฟ
    navigate("/NewtonRaphson");

    axios.post(
      `${process.env.REACT_APP_API_URL}/save/rootequation/all`,
      { equation: Equation },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  const inputEquation = (event) => setEquation(event.target.value);
  const inputDifferential = (event) => setDifferential(event.target.value);
  const inputX0 = (event) => setX0(event.target.value);

  const calculateRoot = () => {
    const x0num = parseFloat(X0);
    CalNewtonRaphson(x0num);
  };

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
                  onChange={inputDifferential}
                  style={{ width: "100%", marginBottom: "20px" }}
                  className="form-control"
                />
                <Form.Label>INPUT X0</Form.Label>
                <input
                  type="number"
                  id="X0"
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
                onClick={() => {
                  axios
                    .get(
                      `${process.env.REACT_APP_API_URL}/load/rootequation/all`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    )
                    .then((res) => {
                      const eq = res.data.equations[0].equation;

                      setEquation(eq);
                    });
                  console.log("Shuffle button clicked!");
                }}
              >
                <ShuffleOnIcon />
              </Button>
            </Form>
          </Paper>
          <Paper elevation={2}>
            <LineChart
              xAxis={[{ data: xValues || [] }]} // Iteration เป็นแกน X
              series={[
                {
                  data: fXmData || [], // f(Xm) เป็นแกน Y
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
