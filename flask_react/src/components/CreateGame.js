import React, { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import axios from 'axios';
import { useSearchParams } from "react-router-dom";


export default function CreateGame({ gameId, setGameId }) {

    const [numTurns, setNumTurns] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    async function redirectToGame(e) {
        e.preventDefault();
        const res = await axios.get("/create_game", { params: { num_turns: numTurns } });
        console.log(res.data.game_id);
        setGameId(res.data.game_id);
        setSearchParams({ game_id: res.data.game_id });
        setOpenAlert(true);
    }

    const copyIdToClipboard = () => {
        navigator.clipboard.writeText(gameId);
    }

    const handleClose = () => {
        setOpenAlert(false);
    }

    return (
        <div>
            <form onSubmit={redirectToGame} id="new_game_container">
                <Grid2 container sx={{ m: '3px' }} rowSpacing={3} direction="column" alignItems="center" justifyContent="center">
                    <Grid2 item>
                        <TextField
                            required
                            id="outlined-required"
                            label="Number of Turns"
                            placeholder="Enter number of turns"
                            onChange={e => setNumTurns(e.target.value)}
                            value={numTurns}
                            name="num_turns"
                            disabled={gameId ? true : false}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    </Grid2>
                    <Button variant="contained" disabled={gameId ? true : false} type="submit">New Game</Button>
                </Grid2>
            </form>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose} >
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}
                    action={
                        <Button color="inherit" size="small" onClick={copyIdToClipboard}>
                            COPY TO CLIPBOARD
                        </Button>
                    }
                >
                    The game ID to share with your friends is: {gameId}
                </Alert>
            </Snackbar>
        </div>
        
    );
}