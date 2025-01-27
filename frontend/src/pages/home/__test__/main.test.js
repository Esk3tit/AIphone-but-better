import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import Home from '../main';
import { MemoryRouter } from 'react-router-dom';

const MockHome = () => {
  return(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Home rendering tests', () => {

  it("should render the join game accordion's text", () => {
    
      render(<MockHome />);
      const accordionTitle = screen.getByText(/Join Existing Game/i);
      expect(accordionTitle).toBeInTheDocument();
    
  });

  it("should render the create game accordion's text", () => {
    
    render(<MockHome />);
    const accordionTitle = screen.getByText(/Create New Game/i);
    expect(accordionTitle).toBeInTheDocument();

  });

});

describe('Home interaction tests (integrating join and create game)', () => {

  it('should NOT disable create game accordion when game id is empty', async () => {
    render(<MockHome />);
    const createGameAccordion = await screen.findByTestId('create-game-accordion');
    expect(createGameAccordion.classList.contains('Mui-disabled')).toBe(false);
  });

  it('should disable create game accordion when game id is typed in join game', async () => {
    render(<MockHome />);
    const gameIdInput = screen.getByPlaceholderText(/Enter game id/i);
    fireEvent.change(gameIdInput, { target: { value: '123' } });
    const createGameAccordion = await screen.findByTestId('create-game-accordion');
    expect(createGameAccordion.classList.contains('Mui-disabled')).toBe(true);
  });

  it('should fill in game id input when you create new game', async () => {
    render(<MockHome />);
    const newGameButton = screen.getByRole('button', { name: /Create Game/i });
    act(() => {
      fireEvent.click(newGameButton);
    });
    waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter game id/i)).toHaveValue('1234567890');
    });
  });

  it('should disable create game accordion when you create new game', async () => {
    render(<MockHome />);
    const newGameButton = screen.getByRole('button', { name: /Create Game/i });
    act(() => {
      fireEvent.click(newGameButton);
    });
    waitFor(() => {
      expect(screen.findByTestId('create-game-accordion').classList.contains('Mui-disabled')).toBe(true);
    });
  });
});