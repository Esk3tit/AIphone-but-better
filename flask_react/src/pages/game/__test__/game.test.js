import { render, screen } from '@testing-library/react';
import Game from '../game';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

const LOADER_DATA = {
  username: "test",
  game_id: 1,
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
    const gameIdText = await screen.findByText(/Game id: 1/i);
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

});