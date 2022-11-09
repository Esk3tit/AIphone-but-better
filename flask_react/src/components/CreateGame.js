import React from "react";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function CreateGame() {
    return (
        <div id="new_game_container">
            {/* <form action="/create_game" method="get">
                <fieldset>
                    <div class="form-group">
                    <label for="num_turns" class="form-label mt-4">Number of Turns</label>
                    <input type="text" class="form-control" id="num_turns" name="num_turns" placeholder="Enter number of turns" />
                    </div>
                    <button type="submit" class="btn btn-primary">New Game</button>
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
                        label="Number of Turns"
                        placeholder="Enter number of turns"
                    />
                </div>
                <Button variant="contained">New Game</Button>
            </Box>
        </div>
    );
}