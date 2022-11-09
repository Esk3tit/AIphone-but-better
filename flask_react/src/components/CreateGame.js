import React from "react";

export default function CreateGame() {
    return (
        <div id="new_game_container">
            <form action="/create_game" method="get">
            <legend>OR CREATE A NEW GAME</legend>
            <fieldset>
                <div class="form-group">
                <label for="num_turns" class="form-label mt-4">Number of Turns</label>
                <input type="text" class="form-control" id="num_turns" name="num_turns" placeholder="Enter number of turns" />
                </div>
                <button type="submit" class="btn btn-primary">New Game</button>
            </fieldset>
            </form>
        </div>
    );
}