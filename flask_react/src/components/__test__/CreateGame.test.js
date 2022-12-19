import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CreateGame from '../CreateGame';
import { createMemoryHistory } from 'history';

it('should render the new game button', () => { 

    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <CreateGame />
        </Router>
    );
    const componentTitle = screen.getByRole("button", { name: "New Game" });
    expect(componentTitle).toBeInTheDocument();
});

it('should render the number of turns text field', () => {
    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <CreateGame />
        </Router>
    );

    const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
    expect(textboxElement).toBeInTheDocument();
});

// TEST INTERACTION HERE
// TEST CREATION AND AUTO CLOSE OF SNACKBAR FOR EXAMPLE AND TEST SNACKBAR STUFF