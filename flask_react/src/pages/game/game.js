import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Game() {
    return (
        <div id="main-content" style="position: relative;">
            {/* <div style="position: absolute; top: 10px; right: 10px; text-align: right;">
                <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">Game info</button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <table class="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for p_info in all_players_info %}
                            <tr>
                            <td>{{p_info['name']}}</td>
                            <td>{{p_info['status']}}</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                        </table>
                        <form action="/game" method="get">
                        <input type="hidden" name="user_id" value="{{user_id}}" />
                        <input type="hidden" name="game_id" value="{{game_id}}" />
                        <button class="btn btn-primary" type="submit" style="margin-top: 10px;">click here to refresh</button>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div> */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Game Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <h4>Username: {username}</h4>
            <p>Game id: {game_id}</p>
            <p>Round number: {round_number + 1}</p>

            {% if prev_user_name or chosen_image_id %}
            <div id="comparison_box" class="w-100">
                {% if prev_user_name %}
                    <div class="card image-width-css-stuff">
                    <h4 class="card-title">{prev_user_name}'s image</h4>
                    <a href="javascript:pop('img{{prev_user_image_id}}');">
                        <img src="/images?id={{prev_user_image_id}}" class="w-100" />
                    </a>
                    </div>
                {% endif %}
                {% if chosen_image_id %}
                <div class="card image-width-css-stuff">
                    <h4 class="card-title">Chosen image</h4>
                    <a href="javascript:pop('img{{chosen_image_id}}');">
                    <img src="/images?id={{chosen_image_id}}" class="w-100" />
                    </a>
                </div>
                {% endif %}
            </div>
            {% endif %}
            <div id="prompt-container">
                <form action="/submit_prompt" method="post">
                    <fieldset>
                        <div class="form-group">
                        <label for="prompt" class="form-label mt-4">
                            {% if not generated_images %}
                            {% if prev_user_image_id %}
                            Guess the prompt for {prev_user_name}'s image!
                            {% else %}
                            Enter your prompt!
                            {% endif %}
                            {% else %}
                            Your prompt:
                            {% endif %}
                        </label>
                        <textarea {% if generated_images %}disabled{% endif %} class="form-control" id="prompt" name="prompt" rows="3">{prompt}</textarea>
                        </div>
                        {% if not generated_images %}
                        <input type="hidden" name="user_id" value="{{user_id}}" />
                        <input type="hidden" name="game_id" value="{{game_id}}" />
                        <input type="hidden" name="drawn_for" value="{{drawn_for}}" />
                        <label for="num_images" class="form-label mt-4">Select number of images to generate</label>
                        <div id="submit-box-thing">
                        <select class="form-select" id="num_images" name="num_images">
                            <option>4</option>
                            <option>3</option>
                            <option>2</option>
                            <option>1</option>
                        </select>
                        <button type="submit" class="btn btn-primary">Submit</button>
                        {% endif %}
                        </div>
                    </fieldset>
                </form>
            </div>
            {% if wait %}
            <h2>Please wait for images from your old prompt to finish being generated before submitting a new prompt</h2>
            {% endif %}
            {% if generated_images %}
                <h2>Images generated so far</h2>
                <div id="images">
                {% for img in images %}
                <div class="card image-card-thingy">
                <a href="javascript:pop('img{{img['id']}}');">
                    <img class="image_thingy" id="img{{img['id']}}" src="/images?id={{img['id']}}" />
                </a>
                <a href="/choose_image?game_id={{game_id}}&user_id={{user_id}}&image_id={{img['id']}}">Choose</a>
                </div>
                {% endfor %}
                </div>
            {% endif %}

                <div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style="display: flex;">
                        <div class="modal-content w-100">
                            <div class="modal-body w-100">
                                <img src="" class="w-100" id="imagepreview" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
