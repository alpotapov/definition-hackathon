import React from 'react';

import { Button, InputLabel, TextField } from '@mui/material';

import './ApproveForm.css';

const ApproveForm = ({
  // eslint-disable-next-line
  approvedAmount,
  // eslint-disable-next-line
  onApprovedAmountChange,
  // eslint-disable-next-line
  sendApproved,
}) => (
  <>
    <div className="ApproveForm">
      <h4>Pre-approve an amount to save gas fees</h4>
      <InputLabel id="approvedAmount">Approved amount</InputLabel>
      <TextField
        fullWidth
        id="approvedAmount"
        variant="outlined"
        value={approvedAmount}
        onChange={onApprovedAmountChange}
      />
    </div>
    <div className="ApproveForm-approveButton">
      <Button fullWidth size="large" variant="contained" onClick={sendApproved}>
        Approve
      </Button>
    </div>
  </>
);

export default ApproveForm;
