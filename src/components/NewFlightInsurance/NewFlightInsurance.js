import React, { useState } from 'react';
import { Typography, Grid, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';

import './NewFlightInsurance.css';

function NewFlightInsurance() {
  const [plannedDepartureTime, setPlannedDepartureTime] = useState();
  const [plannedArrivalTime, setPlannedArrivalTime] = useState();
  return (
    <div className="NewFlightInsurance-formContainer">
      <Typography variant="h6" gutterBottom>
        Flight Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="flightNumber"
            name="flightNumber"
            label="Flight Number"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="originAirport"
            name="originAirport"
            label="Origin Airport"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="destAirport"
            name="destAirport"
            label="Destination Airport"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Planned departure time"
              value={plannedDepartureTime}
              onChange={(newValue) => setPlannedDepartureTime(newValue)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Planned arrival time"
              value={plannedArrivalTime}
              onChange={(newValue) => setPlannedArrivalTime(newValue)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </div>
  );
}

export default NewFlightInsurance;
