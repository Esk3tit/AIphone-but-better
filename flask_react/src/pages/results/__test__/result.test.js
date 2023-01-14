import { render, screen } from '@testing-library/react';
import Results from '../results';
import { MemoryRouter } from 'react-router-dom';

it('should render the correct username field', () => {

  render(
    <MemoryRouter initialEntries={[{
        state: {
          username: "test",
          game_id: 1,
          round_number: 3,
          player_rounds_list: [{username: "test", rounds: [{image_id: 1, prompt: "test prompt"}]}]
        }
      }]}
    >
      <Results />
    </MemoryRouter>
  );
  const usernameText = screen.getByText(/Username: test/i);
  expect(usernameText).toBeInTheDocument();

});

it('should render the correct game id field', () => {

  render(
    <MemoryRouter initialEntries={[{
        state: {
          username: "test",
          game_id: 1,
          round_number: 3,
          player_rounds_list: [{username: "test", rounds: [{image_id: 1, prompt: "test prompt"}]}]
        }
      }]}
    >
      <Results />
    </MemoryRouter>
  );
  const gameidText = screen.getByText(/Game id: 1/i);
  expect(gameidText).toBeInTheDocument();

});

it('should render the correct round number field', () => {

  render(
    <MemoryRouter initialEntries={[{
        state: {
          username: "test",
          game_id: 1,
          round_number: 3,
          player_rounds_list: [{username: "test", rounds: [{image_id: 1, prompt: "test prompt"}]}]
        }
      }]}
    >
      <Results />
    </MemoryRouter>
  );
  const roundNumberText = screen.getByText(/Round number: 3/i);
  expect(roundNumberText).toBeInTheDocument();

});

it('should render an image', () => {

  render(
    <MemoryRouter initialEntries={[{
        state: {
          username: "test",
          game_id: 1,
          round_number: 3,
          player_rounds_list: [{username: "test", rounds: [{image_id: 1, prompt: "test prompt"}]}]
        }
      }]}
    >
      <Results />
    </MemoryRouter>
  );
  const img = screen.getByRole("img");
  expect(img).toBeInTheDocument();

});