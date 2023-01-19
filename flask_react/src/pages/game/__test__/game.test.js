import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Game from '../game';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

const LOADER_DATA = {
  username: "test",
  user_id: 420,
  game_id: 69,
  round_number: 1,
  all_players_info: [
    {'name': 'player1', 'status': 'writing prompt'}
  ]
};

const routes = [
  {
    path: "/game",
    element: <Game />,
    loader: () => LOADER_DATA,
  }
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/game"],
});

describe("Testing rendering of game page", () => {

  it('should render the correct username field', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const usernameText = await screen.findByText(/Username: test/i);
    expect(usernameText).toBeInTheDocument();
  });

  it('should render the correct game id field', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const gameIdText = await screen.findByText(/Game id: 69/i);
    expect(gameIdText).toBeInTheDocument();
  });

  it('should render the correct round number field', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const roundNumberText = await screen.findByText(/Round number: 2/i);
    expect(roundNumberText).toBeInTheDocument();
  });

  it('should render the username column of the status table', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const usernameText = await screen.findByText(/^Username$/i);
    expect(usernameText).toBeInTheDocument();
  });

  it('should render the status column of the status table', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const statusText = await screen.findByText(/Status/i);
    expect(statusText).toBeInTheDocument();
  });

  it('should render the submit button', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const submitBtn = await screen.findByRole('button', { name: /Submit/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('should render the dropdown', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const dropdown = await screen.findByLabelText(/Select number of images to generate/i);
    expect(dropdown).toBeInTheDocument();
  });

  it('should render the text field', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const textField = await screen.findByLabelText(/Enter your prompt:/i);
    expect(textField).toBeInTheDocument();
  });

  it('should show the username in game info accordion', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    const usernameText = await screen.findByText(/^player1$/i);
    expect(usernameText).toBeInTheDocument();
  });

  it('should show the status in game info accordion', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    const statusText = await screen.findByText(/writing prompt/i);
    expect(statusText).toBeInTheDocument();
  });

});

describe("Testing interactions of game page", () => {

  it('should expand the accordion when clicked', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    expect(accordion).toHaveAttribute("aria-expanded", "true");
  });

  it('should refresh the game when the refresh button is clicked', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    const refreshBtn = await screen.findByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshBtn);
    waitFor(() => {
      expect(screen.findByText(/^noImgRefresh$/i)).toBeInTheDocument();
    });
  });

  it('should collapse the accordion when clicked', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    fireEvent.click(accordion);
    expect(accordion).toHaveAttribute("aria-expanded", "false");
  });

  it('should accept input in the textarea/textfield', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const textField = await screen.findByLabelText(/Enter your prompt:/i);
    fireEvent.change(textField, { target: { value: 'Joe Mama' } });
    expect(textField.value).toBe('Joe Mama');
  });

  it('should change the dropdown values when a new value is selected', async () => {
    render(
      <RouterProvider router={router}>
        <Game />
      </RouterProvider>
    );
    const dropdown = await screen.findByLabelText(/Select number of images to generate/i);
    fireEvent.mouseDown(dropdown);
    const option1 = await screen.findByText(/^1$/i);
    fireEvent.click(option1);
    waitFor(() => {
      expect(dropdown.value).toBe('1');
    });
  });

});