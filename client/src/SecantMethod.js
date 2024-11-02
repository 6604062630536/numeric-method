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

const SecantMethod = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [html, setHtml] = useState(null);

  const [Equation, setEquation] = useState("x^2-7");
  const [X, setX] = useState(0);
  const [X0, setX0] = useState(0);
  const [X1, setX1] = useState(0);

  const [xValues, setXValues] = useState([]); // For X value per iteration

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const CalSeccant = (x0, x1) => {
    let fX0,
      fX1,
      x2,
      ea = 100;
    let iter = 0;
    const MAX = 50;
    const e = 0.00001;
    const newData = [];
    const xArr = []; // Array for X values

    do {
      fX0 = evaluate(Equation, { x: x0 });
      fX1 = evaluate(Equation, { x: x1 });

      x2 = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0);

      iter++;
      xArr.push(x2); // Store each X value

      ea = error(x0, x1);
      newData.push({ iteration: iter, X0: x0, X1: x1, X2: x2 });

      x0 = x1;
      x1 = x2;
    } while (ea > e && iter < MAX);

    setData(newData);
    setX(x2);
    setXValues(xArr); // Update X values for chart
    navigate("/SecantMethod");

    axios.post(
      `${process.env.REACT_APP_API_URL}/save/rootequation/all`,
      { equation: Equation },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  useEffect(() => {
    const print = (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th width="10%">Iteration</th>
            <th width="30%">X0</th>
            <th width="30%">X1</th>
            <th width="30%">X2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => (
            <tr key={index}>
              <td>{element.iteration}</td>
              <td>{element.X0}</td>
              <td>{element.X1}</td>
              <td>{element.X2}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
    setHtml(print);
  }, [data]);

  const inputEquation = (event) => {
    setEquation(event.target.value);
  };

  const inputX0 = (event) => {
    setX0(event.target.value);
  };

  const inputX1 = (event) => {
    setX1(event.target.value);
  };

  const calculateRoot = () => {
    const x0num = parseFloat(X0);
    const x1num = parseFloat(X1);

    CalSeccant(x0num, x1num);
  };

  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      <h2>Secant Method</h2>
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
                <Form.Label>INPUT X0</Form.Label>
                <input
                  type="number"
                  id="X0"
                  onChange={inputX0}
                  style={{
                    width: "100%",
                    margin: "0 auto",
                    marginBottom: "20px",
                  }}
                  className="form-control"
                />
                <Form.Label>INPUT X1</Form.Label>
                <input
                  type="number"
                  id="X1"
                  onChange={inputX1}
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
              xAxis={[
                {
                  data: Array.from({ length: xValues.length }, (_, i) => i + 1),
                },
              ]} // Iteration เป็นแกน X
              series={[
                {
                  data: xValues || [], // X value เป็นแกน Y
                  label: "X value per Iteration",
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

export default SecantMethod;
