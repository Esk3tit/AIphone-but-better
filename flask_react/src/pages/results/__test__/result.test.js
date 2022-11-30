import { fireEvent, render, screen } from '@testing-library/react';
import Results from '../results';
import { MemoryRouter } from 'react-router-dom';

describe('Results rendering tests', () => {

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

  it('should render the prompt label text', () => {

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
    const promptText = screen.getByText(/Prompt:/i);
    expect(promptText).toBeInTheDocument();

  });

  it('should render the prompt itself', () => {

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
    const promptText = screen.getByText(/test prompt/i);
    expect(promptText).toBeInTheDocument();

  });

  it('should render multiple images', () => {

    render(
      <MemoryRouter initialEntries={[{
          state: {
            username: "test",
            game_id: 1,
            round_number: 3,
            player_rounds_list: [{username: "test", rounds: [{image_id: 1, prompt: "test prompt"}
                              , {image_id: 2, prompt: "test prompt 2"}, 
                                {image_id: 3, prompt: "test prompt 3"}]}]
          }
        }]}
      >
        <Results />
      </MemoryRouter>
    );
    const imgList = screen.getAllByRole("img");
    expect(imgList).toHaveLength(3);

  });

});

describe('Results interaction tests', () => {
  it('should open the modal when you click on an image', () => {

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
    fireEvent.click(img);
    const modalImg = screen.getByAltText("img1 modal");
    expect(modalImg).toBeInTheDocument();

  });
});