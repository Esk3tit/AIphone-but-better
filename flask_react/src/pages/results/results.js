import React, { useState } from 'react';

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import '../game/game.css'

import { useLocation } from "react-router-dom";

export default function Results() {

  const { state } = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(undefined);

  const handleModalOpen = (img_id) => {
    setModalImage(img_id);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalImage(undefined);
    setModalOpen(false);
  };

  return (
    <div id="main-content" style={{position: "relative", margin: 10}}>
      <Typography variant='h6'>Username: {state.username}</Typography>
      <Typography>Game id: {state.game_id}</Typography>
      <Typography>Round number: {state.round_number}</Typography>

      <Stack spacing={3}>
        {state.player_rounds_list.map((player) => (
          <div key={player['username']} className="card mb-3 player_round_card">
            <Typography variant='h4' className="card-header">{player['username']}'s chain</Typography>
            <div className="card-body">
              {player.rounds.map((round_info) => (
                <Card sx={{ maxWidth: 400 }} key={round_info['image_id']} className="card text-white bg-primary mb-3">
                  <div className="card-body image-card-thingy">
                    <Modal open={modalOpen && modalImage === round_info['image_id']} onClose={handleModalClose}>
                      <img
                        className="image_thingy_modal"
                        id={`img${round_info['image_id']}`}
                        src={`/images?id=${round_info['image_id']}`}
                        alt={`img${round_info['image_id']}`}
                      />
                    </Modal>
                    <CardMedia
                      className="image_thingy"
                      id={`img${round_info['image_id']}`}
                      image={`/images?id=${round_info['image_id']}`}
                      alt={`img${round_info['image_id']}`}
                      title={round_info['prompt']}
                      onClick={() => handleModalOpen(round_info['image_id'])}
                      sx={{ objectFit: 'contain', height: 400, width: 400 }}
                    />
                  </div>
                  <CardContent>
                    <Typography variant='body2'>{round_info['prompt']}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Stack>
    </div>
  )
}
