import { render, screen } from '@testing-library/react';
import Home from '../main';
import { MemoryRouter } from 'react-router-dom';

it("should render the join game accordion's text", () => {
  
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const accordionTitle = screen.getByText(/Join Existing Game/i);
    expect(accordionTitle).toBeInTheDocument();
  
});

it("should render the create game accordion's text", () => {
  
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  const accordionTitle = screen.getByText(/Create New Game/i);
  expect(accordionTitle).toBeInTheDocument();

});