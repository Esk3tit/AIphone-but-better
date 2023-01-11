import { render, screen } from '@testing-library/react';
import NavBar from '../NavBar';

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