import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import JoinGame from "../../components/JoinGame";
import CreateGame from "../../components/CreateGame";
import NavBar from "../../components/NavBar";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Home() {
  return (
    <div>
      <NavBar />
      <Accordion defaultExpanded>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4">Join Existing Game</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <JoinGame/>
          </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">Create New Game</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateGame/>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}