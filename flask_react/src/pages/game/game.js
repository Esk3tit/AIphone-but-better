import React, { createContext, useState } from 'react';

import axios from 'axios';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useLoaderData } from 'react-router-dom';

export const gameLoader = async ({ request }) => {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");
    const game_id = url.searchParams.get("game_id");
    const res = await axios.get("/game", { params: { user_id: user_id, game_id: game_id } });
    return res.data;
}

export default function Game() {

    const gameContext = useLoaderData();
    const [ctx, setCtx] = useState(gameContext);

    async function refresh() {
        const res = await axios.get("/game", { params: { user_id: ctx.user_id, game_id: ctx.game_id } });
        setCtx(res.data);
    }

    let prompt;
    if (!ctx.generated_images) {
        if (ctx.prev_user_image_id) {
            prompt = `Guess the prompt for ${prev_user_name}'s image!`;
        }
        else {
            prompt = "Enter your prompt:";
        }
    }
    else {
        prompt = "Your prompt:";
    }

    return (
        <div id="main-content" style={{position: "relative"}}>
            
            <Accordion sx={
                {
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    textAlign: "right"
                }
            }>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Game Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="player table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    ctx.all_players_info.map(p_info => (
                                        <TableRow
                                            key={p_info.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {p_info.name}
                                            </TableCell>
                                            <TableCell align="right">{p_info.status}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid2 container sx={{ m: '3px', margin: '10px' }} columnSpacing={2} rowSpacing={3} direction="column" alignItems="center" justifyContent="center">
                        <Button onClick={refresh} variant='contained'>Refresh</Button>
                    </Grid2>
                </AccordionDetails>
            </Accordion>

            <Typography variant="h6">Username: {ctx.username}</Typography>
            <Typography>Game id: {ctx.game_id}</Typography>
            <Typography>Round number: {ctx.round_number + 1}</Typography>

            {/* {% if prev_user_name or chosen_image_id %}
            <div id="comparison_box" className="w-100">
                {% if prev_user_name %}
                    <div className="card image-width-css-stuff">
                    <h4 className="card-title">{prev_user_name}'s image</h4>
                    <a href="javascript:pop('img{{prev_user_image_id}}');">
                        <img src="/images?id={{prev_user_image_id}}" className="w-100" />
                    </a>
                    </div>
                {% endif %}
                {% if chosen_image_id %}
                <div className="card image-width-css-stuff">
                    <h4 className="card-title">Chosen image</h4>
                    <a href="javascript:pop('img{{chosen_image_id}}');">
                    <img src="/images?id={{chosen_image_id}}" className="w-100" />
                    </a>
                </div>
                {% endif %}
            </div>
            {% endif %} */}
            <div id="prompt-container">
                <form action="/submit_prompt" method="post">
                    <fieldset>
                        <div className="form-group">
                            <label for="prompt" className="form-label mt-4">
                                {prompt}
                            </label>
                            <textarea disabled={ctx.generated_images} className="form-control" id="prompt" name="prompt" rows="3">{ctx.prompt}</textarea>
                        </div>
                            {!ctx.generated_images && 
                                <>
                                    <input type="hidden" name="user_id" value={ctx.user_id} />
                                    <input type="hidden" name="game_id" value={ctx.game_id} />
                                    <input type="hidden" name="drawn_for" value={ctx.drawn_for} />
                                    <label for="num_images" className="form-label mt-4">Select number of images to generate</label>
                                    <div id="submit-box-thing">
                                        <select className="form-select" id="num_images" name="num_images">
                                            <option>4</option>
                                            <option>3</option>
                                            <option>2</option>
                                            <option>1</option>
                                        </select>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </>
                            }
                    </fieldset>
                </form>
            </div>
            {/* {% if wait %}
            <h2>Please wait for images from your old prompt to finish being generated before submitting a new prompt</h2>
            {% endif %}
            {% if generated_images %}
                <h2>Images generated so far</h2>
                <div id="images">
                {% for img in images %}
                <div className="card image-card-thingy">
                <a href="javascript:pop('img{{img['id']}}');">
                    <img className="image_thingy" id="img{{img['id']}}" src="/images?id={{img['id']}}" />
                </a>
                <a href="/choose_image?game_id={{game_id}}&user_id={{user_id}}&image_id={{img['id']}}">Choose</a>
                </div>
                {% endfor %}
                </div>
            {% endif %} */}

                <div className="modal fade" id="imagemodal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{display: "flex"}}>
                        <div className="modal-content w-100">
                            <div className="modal-body w-100">
                                <img src="" className="w-100" id="imagepreview" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
        // </div>
    );
}
