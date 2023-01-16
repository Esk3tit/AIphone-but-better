import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavBar from '../NavBar';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('NavBar rendering tests', () => {

  it('should render the AIphone text that acts as a button', () => {

    render(<NavBar />);
    const componentTitle = screen.getByText(/AIPhone/i);
    expect(componentTitle).toBeInTheDocument();
  });

  it('should render a new game button', () => {

    render(<NavBar />);
    const componentTitle = screen.getByRole("link", { name: "New Game" });
    expect(componentTitle).toBeInTheDocument();
  });

});

describe('NavBar interaction tests', () => {
  it('should navigate back to home/login when clicking AIphone', async () => {
    
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <NavBar />;
      </Router >
    );
    const componentTitle = screen.getByText(/AIPhone/i);
    fireEvent.click(componentTitle);
    await waitFor(() => expect(history.location.pathname).toBe('/'));
  });

  it('should navigate back to home/login when clicking New Game button', async () => {

    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <NavBar />;
      </Router >
    );
    const componentTitle = screen.getByRole("link", { name: "New Game" });
    fireEvent.click(componentTitle);
    await waitFor(() => expect(history.location.pathname).toBe('/'));
  });
});