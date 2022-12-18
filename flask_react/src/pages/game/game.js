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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

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

    /* <input type="hidden" name="user_id" value={ctx.user_id} />
        <input type="hidden" name="game_id" value={ctx.game_id} />
        <input type="hidden" name="drawn_for" value={ctx.drawn_for} />
        GET THESE FROM THE CONTEXT FOR ON SUBMIT FORM FUNCTION DONT NEED AS INPUT
    */
    /* <label htmlFor="num_images" className="form-label mt-4">Select number of images to generate</label> */

    const gameContext = useLoaderData();
    const [ctx, setCtx] = useState(gameContext);
    const [numImages, setNumImages] = useState(4);

    async function refresh() {
        const res = await axios.get("/game", { params: { user_id: ctx.user_id, game_id: ctx.game_id } });
        setCtx(res.data);
    }

    const handleNumImagesChange = (event) => {
        setNumImages(event.target.value);
    };

    let prompt;
    if (!ctx.generated_images) {
        if (ctx.prev_user_image_id) {
            prompt = `Guess the prompt for ${ctx.prev_user_name}'s image!`;
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

            {
                (ctx.prev_user_name || ctx.chosen_image_id) && 
                <>
                    <div id="comparison_box" className="w-100">
                        {ctx.prev_user_name && 
                            <>
                                <div className="card image-width-css-stuff">
                                    <h4 className="card-title">{ctx.prev_user_name}'s image</h4>
                                    <a href="javascript:pop('img{{prev_user_image_id}}');">
                                        <img src={`/images?id=${ctx.prev_user_image_id}`} className="w-100" />
                                    </a>
                                </div>
                            </>
                        }
                        {ctx.chosen_image_id &&
                            <>
                                <div className="card image-width-css-stuff">
                                    <h4 className="card-title">Chosen image</h4>
                                    <a href="javascript:pop('img{{chosen_image_id}}');">
                                        <img src={`/images?id=${ctx.chosen_image_id}`} className="w-100" />
                                    </a>
                                </div>
                            </>
                        }
                    </div>
                </>
            }

            <div id="prompt-container">
                <form action="/submit_prompt" method="post">
                    <fieldset>
                        <Grid2 container sx={{ m: '3px' }} rowSpacing={3} direction="column" alignItems="center" justifyContent="center">
                            <Grid2 item sx={{ width: '99%' }}>
                                <TextField
                                    className='form-label mt-4'
                                    label={prompt}
                                    type="text"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    sx={{ width: '100%' }}
                                    >
                                    {prompt}
                                </TextField>
                            </Grid2>
                            <Grid2 item>
                                {!ctx.generated_images && 
                                    <FormControl id="submit-box-thing">
                                        <InputLabel id="num-images-label">Select number of images to generate</InputLabel>
                                        <Select
                                            label="Select number of images to generate"
                                            labelId="num-images-label"
                                            id="num-images"
                                            name="num_images"
                                            className="form-select"
                                            value={numImages}
                                            onChange={handleNumImagesChange}
                                            sx={{ width: 300 }}
                                        >
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={1}>1</MenuItem>
                                        </Select>
                                        <Button sx={{ m: 1 }} variant="contained" type="submit" className="btn btn-primary">Submit</Button>
                                    </FormControl>
                                }
                            </Grid2>
                        </Grid2>
                    </fieldset>
                </form>
            </div>
            
            {
                ctx.wait && <h2>Please wait for images from your old prompt to finish being generated before submitting a new prompt</h2>
            }
            {
                ctx.generated_images &&
                <>
                    <h2>Images generated so far</h2>
                    <div id="images">
                    {ctx.images.map(img => (
                        <div className="card image-card-thingy">
                        <a href="javascript:pop('img{{img['id']}}');">
                            <img className="image_thingy" id="img{{img['id']}}" src="/images?id={{img['id']}}" />
                        </a>
                        <a href="/choose_image?game_id={{game_id}}&user_id={{user_id}}&image_id={{img['id']}}">Choose</a>
                        </div>
                    ))}
                    </div>
                </>
            }

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
    );
}
