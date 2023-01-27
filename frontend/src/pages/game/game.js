import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";
import io from "socket.io-client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./game.css";

import { useLoaderData, useNavigate } from "react-router-dom";

export const gameLoader = async ({ request }) => {
  console.log("React router loader called");
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  const game_id = url.searchParams.get("game_id");
  const res = await axios.get("http://localhost:5000/game", {
    params: { user_id: user_id, game_id: game_id },
  });
  return res.data;
};

export default function Game() {

  const gameContext = useLoaderData();
  const [ctx, setCtx] = useState(gameContext);
  const [numImages, setNumImages] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(undefined);
  const [snackPack, setSnackPack] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(undefined);
  const [genRandPromptDisabled, setGenRandPromptDisabled] = useState(false);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/game", {
      params: { user_id: ctx.user_id, game_id: ctx.game_id },
    });
    console.log("Context that will be set for refresh: ", res.data);
    setCtx(res.data);
  }, [ctx]);

  useEffect(() => {

    const socket = io.connect("http://localhost:5000", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:8080/",
      },
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
      socket.emit("join", { username: ctx.username, user_id: ctx.user_id });
    });

    socket.on("reload", () => {
      console.log("Received reload message from socket");
      refresh();
    });

    socket.on('message', (msg) => {
      console.log(`Received message from socket: ${msg}`);
      handleSnackBarOpen(msg, "info");
    });

    socket.on('game_info', (game_info) => {
      console.log(`Received game_info from socket: ${JSON.stringify(game_info)}`);
      setCtx((prev) => ({ ...prev, all_players_info: game_info }));
    });

    return () => {
      socket.off('connect');
      socket.off('reload');
      socket.off('message');
      socket.off('game_info');
    };

  }, []);

  useEffect(() => {
    if (snackPack.length && !snackbarMessage) {
      // Set a new snack when we don't have an active one
      setSnackbarMessage({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setSnackbarOpen(true);
    } else if (snackPack.length && snackbarMessage && snackbarOpen) {
      // Close an active snack when a new one is added
      setSnackbarOpen(false);
    }
  }, [snackPack, snackbarMessage, snackbarOpen]);

  // Go to results page if ctx changes and now has player_rounds_list
  // since it indicates the end of game (current round == set number of rounds)
  useEffect(() => {
    if ("player_rounds_list" in ctx) {
      navigate(
        `/results?game_id=${ctx.game_id}`,
        { state: ctx }
      );
    }
  }, [ctx]);

  const handleModalOpen = (img_id) => {
    setModalImage(img_id);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalImage(undefined);
    setModalOpen(false);
  };

  const handleNumImagesChange = (event) => {
    setNumImages(event.target.value);
  };

  // Use prompt data from context and replace it with the textbox prompt value
  // setCtx does merging of state, so we want to spread out previous ctx values
  // to keep them the same and then just replace the prompt value only
  const handlePromptChange = (event) => {
    setCtx((prevCtx) => {
      return { ...prevCtx, prompt: event.target.value };
    });
  };

  const handleGenerateRandomPrompt = async () => {
    setGenRandPromptDisabled(true);

    // Handle possible error of prompt generating website being down...
    try {
      const res = await axios.post("http://localhost:5000/random_prompt");
      console.log("Random prompt: ", res.data.prompt);
      setCtx((prevCtx) => {
        return { ...prevCtx, prompt: res.data.prompt };
      });
    } catch (err) {
      console.log("Error generating random prompt: ", err);
      handleSnackBarOpen("Error generating random prompt. Please try again later. If the issue persists, just make up your own prompt.", "error");
    }
    
    setGenRandPromptDisabled(false);
  };

  const handleSnackBarOpen = (message, status) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime(), status: status }]);
  };
  const handleSnackBarClose = () => setSnackbarOpen(false);
  const handleSnackBarExited = () => setSnackbarMessage(undefined);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const data = new URLSearchParams();
    data.append("user_id", ctx.user_id);
    data.append("game_id", ctx.game_id);
    data.append("drawn_for", ctx.drawn_for);
    data.append("num_images", numImages);
    data.append("prompt", ctx.prompt);

    setCtx((prevCtx) => {
      return { ...prevCtx, generated_images: true, images: [] };
    });

    const res = await axios.post("http://localhost:5000/submit_prompt", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if ("wait" in res.data) {
      navigate(`/game?user_id=${res.data.user_id}&game_id=${res.data.game_id}&wait=1`);
    } else {
      navigate(`/game?user_id=${res.data.user_id}&game_id=${res.data.game_id}`);
    }

  };

  const handleImageSubmit = async (img_id) => {
    await axios.get("http://localhost:5000/choose_image", { params: { user_id: ctx.user_id, game_id: ctx.game_id, image_id: img_id } });
    navigate(`/game?user_id=${ctx.user_id}&game_id=${ctx.game_id}`);
  };

  let prompt;
  if (!ctx.generated_images) {
    if (ctx.prev_user_image_id) {
      prompt = `Guess the prompt for ${ctx.prev_user_name}'s image!`;
    } else {
      prompt = "Enter your prompt:";
    }
  } else {
    prompt = "Your prompt:";
  }

  return (
    <div id="main-content" style={{ position: "relative", margin: 10 }}>
      <Accordion
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          textAlign: "right",
          zIndex: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          data-testid="game-info"
        >
          <Typography>Game Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="player table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ctx.all_players_info.map((p_info) => (
                  <TableRow
                    key={p_info.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {p_info.name}
                    </TableCell>
                    <TableCell align="right">{p_info.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid2
            container
            sx={{ m: "3px", margin: "10px" }}
            columnSpacing={2}
            rowSpacing={3}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Button onClick={refresh} variant="contained">
              Refresh
            </Button>
          </Grid2>
        </AccordionDetails>
      </Accordion>

      <Typography variant="h6">Username: {ctx.username}</Typography>
      <Typography>Game id: {ctx.game_id}</Typography>
      <Typography>Round number: {ctx.round_number + 1}</Typography>

      {(ctx.prev_user_name || ctx.chosen_image_id) && (
        <>
          <div id="comparison_box" className="w-100">
            {ctx.prev_user_name && (
              <>
                <div className="card image-width-css-stuff">
                  {ctx.drawn_for_name === ctx.prev_user_name ?
                    <Typography variant="subtitle2" className="card-title">{ctx.prev_user_name}'s image</Typography>
                    :
                    <Typography variant="subtitle2" className="card-title">{ctx.prev_user_name}'s interpretation of {ctx.drawn_for_name}'s image</Typography>
                  }
                  <Modal open={modalOpen && modalImage === ctx.prev_user_image_id} onClose={handleModalClose}>
                    <img
                      src={`/images?id=${ctx.prev_user_image_id}`}
                      className="image_thingy_modal"
                      alt={`img${ctx.prev_user_image_id} prev modal`}
                    />
                  </Modal>
                  <img
                      src={`/images?id=${ctx.prev_user_image_id}`}
                      onClick={() => handleModalOpen(ctx.prev_user_image_id)}
                      className="image_thingy"
                      alt={`img${ctx.prev_user_image_id} prev`}
                    />
                </div>
              </>
            )}
            {ctx.chosen_image_id && (
              <>
                <div className="card image-width-css-stuff">
                  <Typography variant="subtitle2" className="card-title">Chosen image</Typography>
                  <Modal open={modalOpen && modalImage === ctx.chosen_image_id} onClose={handleModalClose}>
                    <img
                      src={`/images?id=${ctx.chosen_image_id}`}
                      className="image_thingy_modal"
                      alt={`img${ctx.chosen_image_id} chosen modal`}
                    />
                  </Modal>
                  <img
                      src={`/images?id=${ctx.chosen_image_id}`}
                      onClick={() => handleModalOpen(ctx.chosen_image_id)}
                      className="image_thingy"
                      alt={`img${ctx.chosen_image_id} chosen`}
                    />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div style={{ marginTop: 10 }} id="prompt-container">
        <form onSubmit={handleFormSubmit}>
          <fieldset>
            <Grid2
              container
              sx={{ m: "3px" }}
              rowSpacing={3}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid2 item sx={{ width: "99%" }}>
                <TextField
                  className="form-label mt-4"
                  label={prompt}
                  type="text"
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  value={ctx.prompt}
                  onChange={handlePromptChange}
                  disabled={ctx.generated_images}
                />
              </Grid2>
              <Grid2 item>
                {!ctx.generated_images && (
                  <Stack spacing={2} direction="column">
                    <FormControl id="submit-box-thing">
                      <InputLabel id="num-images-label">
                        Select number of images to generate
                      </InputLabel>
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
                    </FormControl>
                    <Stack spacing={1} direction="row">
                      <Button
                        variant="contained"
                        type="submit"
                        className="btn btn-primary"
                      >
                        Submit
                      </Button>
                      <Button
                        variant="outlined"
                        className="btn btn-secondary"
                        onClick={handleGenerateRandomPrompt}
                        disabled={genRandPromptDisabled}
                      >
                        Generate Random Prompt
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Grid2>
            </Grid2>
          </fieldset>
        </form>
      </div>

      {ctx.wait && (
        <Typography variant="h6">
          Please wait for images from your old prompt to finish being generated
          before submitting a new prompt
        </Typography>
      )}
      {ctx.generated_images && (
        <>
          <Typography variant="h6">Images generated so far</Typography>
          {ctx.images.length === 0 && 
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          }
          <ImageList id="images" cols={4}>
            {ctx.images.map((img) => (
              <ImageListItem
                className="card image-card-thingy"
                key={`img${img["id"]}`}
                sx={{
                  width: 200,
                  height: 200,
                }}
              >
                <Modal open={modalOpen && modalImage === img["id"]} onClose={handleModalClose}>
                  <img
                    className="image_thingy_modal"
                    id={`img${img["id"]}`}
                    src={`/images?id=${img["id"]}`}
                    alt={`img${img["id"]} modal`}
                  />
                </Modal>
                <img
                  className="image_thingy"
                  id={`img${img["id"]}`}
                  onClick={() => handleModalOpen(img["id"])}
                  src={`/images?id=${img["id"]}`}
                  alt={`img${img["id"]}`}
                />
                <Button variant="text" onClick={() => handleImageSubmit(img["id"])}>Choose Image</Button>
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
      <Snackbar
        key={snackbarMessage ? snackbarMessage.key : undefined}
        open={snackbarOpen}
        autoHideDuration={6000} 
        onClose={handleSnackBarClose}
        TransitionProps={{
          onExited: handleSnackBarExited,
        }}
      >
        {snackbarMessage && snackbarMessage.status === "info" ?
          <Alert onClose={handleSnackBarClose} severity="info">
            {snackbarMessage? snackbarMessage.message : undefined}
          </Alert>
          :
          <Alert onClose={handleSnackBarClose} severity="error">
            {snackbarMessage? snackbarMessage.message : undefined}
          </Alert>
        }
      </Snackbar>
    </div>
  );
}
