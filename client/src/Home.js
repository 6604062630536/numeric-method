import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Home() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ p: 2 }}> 
        <Box sx={{ bgcolor: 'white', height: '200vh', display: 'flex',  justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
          <h2>Welcome to the Home Page</h2>
        </Box>
      </Container>
    </React.Fragment>
  );
}
