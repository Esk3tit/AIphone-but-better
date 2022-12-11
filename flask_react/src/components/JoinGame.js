import React, { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import axios from 'axios';

export default function JoinGame({ gameId, setGameId }) {

  const [username, setUsername] = useState("");
  
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await axios.get("/login", { params: { username: username, game_id: gameId } });
    console.log(res.data);
  }

  return (
      <form onSubmit={handleSubmit} id="login_container">
        <Grid2 container sx={{ m: '3px' }} columnSpacing={2} rowSpacing={3} direction="column" alignItems="center" justifyContent="center">
          <Grid2 item>
            <TextField
              required
              id="outlined-required"
              label="Username"
              placeholder="Enter username"
              onChange={e => setUsername(e.target.value)}
              value={username}
            />
          </Grid2>
          <Grid2 item>
            <TextField
              required
              id="outlined-required"
              label="Game ID"
              placeholder="Enter game id"
              onChange={e => setGameId(e.target.value)}
              value={gameId}
            />
          </Grid2>
          <Button variant="contained" type="submit">Submit</Button>
        </Grid2>
      </form>
  );
}