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

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./game.css";

import { useLoaderData, useNavigate } from "react-router-dom";

export const gameLoader = async ({ request }) => {
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  const game_id = url.searchParams.get("game_id");
  const res = await axios.get("/game", {
    params: { user_id: user_id, game_id: game_id },
  });
  return res.data;
};

export default function Game() {

  const gameContext = useLoaderData();
  const [ctx, setCtx] = useState(gameContext);
  const [numImages, setNumImages] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackPack, setSnackPack] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(undefined);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    const res = await axios.get("/game", {
      params: { user_id: ctx.user_id, game_id: ctx.game_id },
    });
    console.log("Context after refresh/returned from refresh: ", res.data);
    setCtx(res.data);
  }, [ctx]);

  useEffect(() => {

    const socket = io.connect("http://localhost:5000", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
      socket.emit("join", { username: ctx.username, user_id: ctx.user_id });
    });

    socket.on("reload", (msg) => {
      console.log("Received reload message from socket:", msg);
      refresh();
    });

    socket.on('pong', () => {
      console.log(`Received pong from socket at ${new Date().toISOString()}`);
    });

    socket.on('message', (msg) => {
      console.log(`Received message from socket: ${msg}`);
      setSnackbarMessage(msg);
      handleSnackBarOpen(msg);
    });

    return () => {
      socket.off('connect');
      socket.off('reload');
      socket.off('pong');
      socket.off('message');
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

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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

  const handleSnackBarOpen = (message) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
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

    const res = await axios.post("/submit_prompt", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    await refresh();

    // Navigate depending on whether wait is set to 1 or not from submit prompt route
    // Can probably remove this since we aren't using the wait property and we are already on the route
    // anyways when this code runs, and refreshing is handled by other code so navigating here again doesn't
    // do anything except cause a reload that we don't need...
    if ("wait" in res.data) {
      navigate(
        `/game?user_id=${res.data.user_id}&game_id=${res.data.game_id}&wait=1`
      );
    } else {
      navigate(`/game?user_id=${res.data.user_id}&game_id=${res.data.game_id}`);
    }
  };

  const handleImageSubmit = async (img_id) => {
    await axios.get("/choose_image", { params: { user_id: ctx.user_id, game_id: ctx.game_id, image_id: img_id } });
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
    <div id="main-content" style={{ position: "relative" }}>
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
                  <h4 className="card-title">{ctx.prev_user_name}'s image</h4>
                  <Modal open={modalOpen} onClose={handleModalClose}>
                    <img
                      src={`/images?id=${ctx.prev_user_image_id}`}
                      className="w-100"
                    />
                  </Modal>
                  <img
                      src={`/images?id=${ctx.prev_user_image_id}`}
                      onClick={handleModalOpen}
                      className="w-100"
                    />
                </div>
              </>
            )}
            {ctx.chosen_image_id && (
              <>
                <div className="card image-width-css-stuff">
                  <h4 className="card-title">Chosen image</h4>
                  <Modal open={modalOpen} onClose={handleModalClose}>
                    <img
                      src={`/images?id=${ctx.chosen_image_id}`}
                      className="w-100"
                    />
                  </Modal>
                  <img
                      src={`/images?id=${ctx.chosen_image_id}`}
                      onClick={handleModalOpen}
                      className="w-100"
                    />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div id="prompt-container">
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
                />
              </Grid2>
              <Grid2 item>
                {!ctx.generated_images && (
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
                    <Button
                      sx={{ m: 1 }}
                      variant="contained"
                      type="submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </Button>
                  </FormControl>
                )}
              </Grid2>
            </Grid2>
          </fieldset>
        </form>
      </div>

      {ctx.wait && (
        <h2>
          Please wait for images from your old prompt to finish being generated
          before submitting a new prompt
        </h2>
      )}
      {ctx.generated_images && (
        <>
          <h2>Images generated so far</h2>
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
                <Modal open={modalOpen} onClose={handleModalClose}>
                  <img
                    className="image_thingy_modal"
                    id={`img${img["id"]}`}
                    src={`/images?id=${img["id"]}`}
                  />
                </Modal>
                <img
                  className="image_thingy"
                  id={`img${img["id"]}`}
                  onClick={handleModalOpen}
                  src={`/images?id=${img["id"]}`}
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
        <Alert onClose={handleSnackBarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
