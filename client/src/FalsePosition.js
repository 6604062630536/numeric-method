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

const FalsePosition = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // ใช้ useState เพื่อเก็บข้อมูล
  const [html, setHtml] = useState(null);

  const [Equation, setEquation] = useState("2x^3-2x-5");
  const [X, setX] = useState(0);
  const [XL, setXL] = useState(0);
  const [XR, setXR] = useState(0);

  const [errorData, setErrorData] = useState([]); // เก็บค่าของ error
  const [xValues, setXValues] = useState([]);

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const CalFalsePoistion = (xl, xr) => {
    let xm,
      fXm,
      fXr,
      fXl,
      ea = 100;
    let iter = 0;
    const MAX = 50;
    const e = 0.00001;
    const newData = [];
    const errorArr = []; // สร้าง array เก็บค่า Error แต่ละ Iteration
    const iterArr = []; // สร้าง array เก็บค่า Iteration เพื่อแสดงบนแกน X

    do {
      fXr = evaluate(Equation, { x: xr });
      fXl = evaluate(Equation, { x: xl });

      xm = (xr * fXl - xl * fXr) / (fXl - fXr);
      fXm = evaluate(Equation, { x: xm });

      iter++;
      iterArr.push(iter);

      if (fXm * fXr > 0) {
        ea = error(xr, xm);
        newData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr });
        errorArr.push(ea); // เก็บค่า Error ของแต่ละ Iteration
        xr = xm;
      } else if (fXm * fXr < 0) {
        ea = error(xl, xm);
        newData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr });
        errorArr.push(ea); // เก็บค่า Error ของแต่ละ Iteration
        xl = xm;
      }
    } while (ea > e && iter < MAX);

    setData(newData); // อัปเดต data
    setX(xm);
    setXValues(iterArr); // อัปเดต Iteration สำหรับแกน X
    setErrorData(errorArr); // อัปเดต Error สำหรับแกน Y (กราฟ)
    navigate("/FalsePosition");

    axios.post(
      `${process.env.REACT_APP_API_URL}/save/rootequation/all`,
      {
        equation: Equation,
        XL: parseFloat(XL),
        XR: parseFloat(XR),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

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
    setEquation(event.target.value);
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
      console.error("XL หรือ XR ต้องเป็นเลข!");
      return;
    }

    CalFalsePoistion(xlnum, xrnum);
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
                      const XXL = res.data.equations[0].XL;
                      const XXR = res.data.equations[0].XR;
                      setEquation(eq);
                      setXL(XXL);
                      setXR(XXR);
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
                  data: errorData || [], // Error เป็นแกน Y
                  label: "Error per Iteration",
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
