import React from "react";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function JoinGame() {
  // <input type="text" class="form-control" id="game_id" name="game_id" placeholder="Enter game id" {% if game_id %}value="{{game_id}}"{% endif %} />
  // Fix above on line 17 for react conditional attribute
  return (
      <div id="login_container">
        {/* <form action="/login" method="get">
          <fieldset>
            <div class="form-group">
              <label for="username" class="form-label mt-4">Username</label>
              <input type="text" class="form-control" id="username" name="username" placeholder="Enter username" />
            </div>
            <div class="form-group">
              <label for="game_id" class="form-label mt-4">Game ID</label>
              
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </fieldset>
        </form> */}
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="outlined-required"
              label="Username"
              placeholder="Enter username"
            />
            <TextField
              required
              id="outlined-required"
              label="Game ID"
              placeholder="Enter game id"
            />
          </div>
          <Button variant="contained">Submit</Button>
        </Box>
      </div>
  );
}