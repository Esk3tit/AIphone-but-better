import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import JoinGame from '../JoinGame';
import { createMemoryHistory } from 'history';

it('should render the submit button', () => { 

    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <JoinGame />
        </Router>
    );
    const componentTitle = screen.getByRole("button", { name: "Submit" });
    expect(componentTitle).toBeInTheDocument();
});

it('should render the username text field', () => {
    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <JoinGame />
        </Router>
    );

    const textboxElement = screen.getByPlaceholderText("Enter username");
    expect(textboxElement).toBeInTheDocument();
});

it('should render the game id text field', () => {
    const history = createMemoryHistory();

    render(
        <Router location={history.location} navigator={history}>
            <JoinGame />
        </Router>
    );

    const textboxElement = screen.getByPlaceholderText("Enter game id");
    expect(textboxElement).toBeInTheDocument();
});

// TEST INTERACTION HERE
// TEST SUBMISSION/API REQUEST????