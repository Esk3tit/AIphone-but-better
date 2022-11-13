import React, { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import axios from 'axios';

export default function CreateGame() {

    const [numTurns, setNumTurns] = useState("");

    async function redirectToGame(e) {
        e.preventDefault();
        //const data = await axios.get("/create_game", { params: { num_turns: numTurns } });
        const data = await fetch("http://localhost:5000/create_game", { method: "GET", params: { num_turns: numTurns } });
        console.log(data);
        const newUrl = data.data.url;
        
        window.location = newUrl;
    }

    return (
        <form onSubmit={redirectToGame} id="new_game_container">
            {/* <form action="/create_game" method="get">
                <fieldset>
                    <div class="form-group">
                    <label for="num_turns" class="form-label mt-4">Number of Turns</label>
                    <input type="text" class="form-control" id="num_turns" name="num_turns" placeholder="Enter number of turns" />
                    </div>
                    <button type="submit" class="btn btn-primary">New Game</button>
                </fieldset>
            </form> */}
            <Grid2 container sx={{ m: '3px' }} rowSpacing={3} direction="column" alignItems="center" justifyContent="center">
                <Grid2 item>
                    <TextField
                        required
                        id="outlined-required"
                        label="Number of Turns"
                        placeholder="Enter number of turns"
                        onChange={e => setNumTurns(e.target.value)}
                        value={numTurns}
                    />
                </Grid2>
                <Button variant="contained" type="submit">New Game</Button>
            </Grid2>
        </form>
    );
}