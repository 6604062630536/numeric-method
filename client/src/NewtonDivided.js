import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

const NewtonDivided = () => {
    const navigate = useNavigate();
    const [html, setHtml] = useState(null);
    const [data, setData] = useState([
        { x: 1891, y: 46 },
        { x: 1901, y: 66 },
        { x: 1911, y: 81 },
        { x: 1921, y: 93 }
    ]);
    const [xValue, setXValue] = useState(1895); // Added for user input
    const [result, setResult] = useState(null); // For storing the final result

    const CalNewtonDivided = (x, y) => {
        const n = x.length;
        let func = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            func[i][0] = y[i];
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                func[i][j] = (func[i + 1][j - 1] - func[i][j - 1]) / (x[i + j] - x[i]);
            }
        }

        return func; // Return the func table
    };

    const Calculation = () => {
        const x = data.map(item => item.x);
        const y = data.map(item => item.y);

        // Calculate the divided difference table
        const func = CalNewtonDivided(x, y);
        setHtml(print(func, x));

        // Calculate the result based on the input X value
        const n = x.length;
        let calculatedResult = func[0][0]; // Initialize with the first term
        let Ci = 1;

        if (n === 1) {
            setResult(calculatedResult); // Only one point
        } else {
            for (let j = 1; j < n; j++) {
                Ci *= (xValue - x[j - 1]); // Calculate Ci
                calculatedResult += func[0][j] * Ci; // Update result
            }
            setResult(calculatedResult.toPrecision(7)); // Set the final result
        }
        navigate('/NewtonDivided');
    };

    const InputXY = (index, field, event) => {
        const newValue = event.target.value;
        const updatedData = [...data];
        updatedData[index][field] = parseFloat(newValue) || 0; // Update x or y values
        setData(updatedData);
    };

    const addRow = () => {
        setData([...data, { x: 0, y: 0 }]);
    };

    const removeRow = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
    };

    const print = (func, x) => {
        return (
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th width="15%">X</th>
                        {Array.from({ length: func.length }, (_, index) => (
                            <th width="20%" key={index}>C{index}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {func.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{x[rowIndex]}</td> {/* Show X values */}
                            {row.map((value, colIndex) => (
                                <td key={colIndex}>{value !== 0 ? value.toFixed(4) : ''}</td>
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
            <Grid container spacing={3} justifyContent="space-between" alignItems="flex-start">
                <Grid item xs={5}>
                    <Paper sx={{ p: 2 }} elevation={2}>
                        {data.map((element, index) => (
                            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                                <TextField
                                    label={`X${index + 1}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: '110px', marginRight: '10px' }}
                                    value={element.x}
                                    onChange={(e) => InputXY(index, 'x', e)}
                                    type="number" // allow decimal input
                                    InputProps={{ inputProps: { step: "any" } }} // allow decimal step
                                />
                                <TextField
                                    label={`Y${index + 1}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: '110px' }}
                                    value={element.y}
                                    onChange={(e) => InputXY(index, 'y', e)}
                                    type="number" // allow decimal input
                                    InputProps={{ inputProps: { step: "any" } }} // allow decimal step
                                />
                                <Button variant="outlined" color="error" onClick={() => removeRow(index)} sx={{ marginLeft: '10px' }}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button variant="contained" onClick={addRow} sx={{ marginTop: '10px', marginBottom: '10px' }}>
                            Add Row
                        </Button>

                        <Button variant="contained" onClick={Calculation} sx={{ backgroundColor: '#1976d2', color: '#fff', marginLeft: '10px' }}>
                            Calculate
                        </Button>

                        <TextField
                            label="Input X Value"
                            variant="outlined"
                            size="small"
                            sx={{ width: '230px', marginLeft: '10px' , marginTop: '10px'}}
                            value={xValue}
                            onChange={(e) => setXValue(parseFloat(e.target.value) || 0)}
                            type="number"
                            InputProps={{ inputProps: { step: "any" } }} 
                        />
                        
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper sx={{ p: 3 }}>
                        {result !== null && <h3 >Answer = {result}</h3>} 
                        {html}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NewtonDivided;
