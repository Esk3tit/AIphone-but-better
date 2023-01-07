import React, { useState } from 'react';

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
    <div id="main-content" style="position: relative;">
      <Typography variant='h6'>Username: {state.username}</Typography>
      <Typography>Game id: {state.game_id}</Typography>
      <Typography>Round number: {state.round_number}</Typography>

      {state.player_rounds_list.map((player) => (
        <div class="card mb-3 player_round_card">
          <Typography variant='h4' class="card-header">{player['username']}'s chain</Typography>
          <div class="card-body">
            {player.round_info.map((round_info) => (
              <div class="card text-white bg-primary mb-3">
                <div class="card-header">{round_info['username']}</div>
                <div class="card-body image-card-thingy">
                  <Typography>{round_info['prompt']}</Typography>
                  <Modal open={modalOpen && modalImage === round_info['image_id']} onClose={handleModalClose}>
                    <img
                      class="image_thingy_modal"
                      id={`img${round_info['image_id']}`}
                      src={`/images?id=${round_info['image_id']}`}
                      alt={`img${round_info['image_id']}`}
                    />
                  </Modal>
                  <img
                    class="image_thingy"
                    id={`img${round_info['image_id']}`}
                    src={`/images?id=${round_info['image_id']}`}
                    alt={`img${round_info['image_id']}`}
                    onclick={() => handleModalOpen(round_info['image_id'])}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
