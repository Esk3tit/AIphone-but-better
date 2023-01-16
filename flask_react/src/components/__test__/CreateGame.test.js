import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CreateGame from '../CreateGame';
import { createMemoryHistory } from 'history';

describe('CreateGame rendering tests', () => {
    it('should render the new game button', () => { 

        const history = createMemoryHistory();
    
        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={1} setGameId={jest.fn()} />
            </Router>
        );
        const componentTitle = screen.getByRole("button", { name: "New Game" });
        expect(componentTitle).toBeInTheDocument();
    });
    
    it('should render the number of turns text field', () => {
        const history = createMemoryHistory();
    
        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={1} setGameId={jest.fn()} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        expect(textboxElement).toBeInTheDocument();
    });

    it('should render a notification after submitting', async () => {
        const history = createMemoryHistory();
    
        const setGameId = jest.fn();

        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={undefined} setGameId={setGameId} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        const submitButton = screen.getByRole("button", { name: "New Game" });
        fireEvent.change(textboxElement, { target: { value: '2' } });
        fireEvent.click(submitButton);
        const snackbarElement = await screen.findByText(/The game ID to share with your friends is:/i);
        expect(snackbarElement).toBeInTheDocument();
    });

    it('should render a notification with a copy to clipboard button', async () => {
        const history = createMemoryHistory();
    
        const setGameId = jest.fn();

        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={undefined} setGameId={setGameId} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        const submitButton = screen.getByRole("button", { name: "New Game" });
        fireEvent.change(textboxElement, { target: { value: '2' } });
        fireEvent.click(submitButton);
        const copyToClipboardElement = await screen.findByText(/COPY TO CLIPBOARD/i);
        expect(copyToClipboardElement).toBeInTheDocument();
    });
});

describe('CreateGame interaction tests', () => {
    it('should be able to type a number into the text input field', () => {
        const history = createMemoryHistory();
    
        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={1} setGameId={jest.fn()} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        fireEvent.change(textboxElement, { target: { value: '5' } });
        expect(textboxElement.value).toBe('5');
    });

    it('should be able to type a non-number into the text input field, but cannot submit', async () => {
        const history = createMemoryHistory();
    
        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={1} setGameId={jest.fn()} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        const submitButton = screen.getByRole("button", { name: "New Game" });
        fireEvent.change(textboxElement, { target: { value: 'a' } });
        fireEvent.click(submitButton);
        waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('should be able to type a number into the text input field, and can submit (submit button disabled)', async () => {
        const history = createMemoryHistory();
    
        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={1} setGameId={jest.fn()} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        const submitButton = screen.getByRole("button", { name: "New Game" });
        fireEvent.change(textboxElement, { target: { value: '2' } });
        fireEvent.click(submitButton);
        waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('should close snackbar after 6 seconds', async () => {
        const history = createMemoryHistory();
        const setGameId = jest.fn();

        render(
            <Router location={history.location} navigator={history}>
                <CreateGame gameId={undefined} setGameId={setGameId} />
            </Router>
        );
    
        const textboxElement = screen.getByRole("textbox", { name: "Number of Turns" });
        const submitButton = screen.getByRole("button", { name: "New Game" });
        fireEvent.change(textboxElement, { target: { value: '2' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.queryByText(/The game ID to share with your friends is:/i)).not.toBeInTheDocument();
        });
    });
});