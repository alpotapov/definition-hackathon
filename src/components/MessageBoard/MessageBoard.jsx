import React, { useState, useEffect, useRef } from 'react';
import { Typography, Grid, TextField } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';
import Web3 from 'web3';

import './MessageBoard.css';

const MessageBoard = () => {
  // eslint-disable-next-line
  const [newMessage, setNewMessage] = useState('');
  const web3 = useRef(null);

  const onChange = (evt) => {
    setNewMessage(evt.target.value);
  };

  const onWeb3Init = async () => {
    const network = await web3.current.eth.net.getNetworkType();
    await window.ethereum.enable();
    const accounts = await web3.current.eth.getAccounts();
    console.log({ network, accounts });
  };

  useEffect(() => {
    web3.current = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
    console.log('...');
    onWeb3Init();
  }, []);

  return (
    <div className="MessageBoard-formContainer">
      <Typography variant="h6" gutterBottom>
        Messages
      </Typography>
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Sleep</TimelineContent>
        </TimelineItem>
      </Timeline>
      <Typography variant="h6" gutterBottom>
        New Message
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="newMessage"
            name="newMessage"
            label="New message"
            fullWidth
            variant="standard"
            value={newMessage}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default MessageBoard;
