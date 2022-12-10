import { useRouteError } from "react-router-dom";
import './style.css';
import React from 'react';

export default function Error() {

    const error = useRouteError();
    console.error(error);

    return (
        <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>4<span></span>4</h1>
                </div>
                <h2>Oops! An Unexpected Error Occurred!</h2>
                <p><i>{error.statusText || error.message}</i></p>
                <a href="/">Back to homepage</a>
            </div>
        </div>
    );
}
