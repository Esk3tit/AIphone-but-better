import { render, screen } from '@testing-library/react';
import Error from '../error';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const routes = [
  {
    path: "/",
    element: <div>Home</div>,
    loader: () => {throw new Response("Not Found", { status: 404 });},
    errorElement: <Error />
  }
];

const router = createMemoryRouter(routes);

it("should render the generic error message", async () => {
  render(
    <RouterProvider router={router}>
      <Error />
    </RouterProvider>
  );
  expect(await screen.findByText("Oops! An Unexpected Error Occurred!")).toBeInTheDocument();
});

it("should render the error status text paragraph", async () => {
  render(
    <RouterProvider router={router}>
      <Error />
    </RouterProvider>
  );
  expect(await screen.findByTestId("error-paragraph")).toBeInTheDocument();
});

it("should render the back to home page link/fake button", async () => {
  render(
    <RouterProvider router={router}>
      <Error />
    </RouterProvider>
  );
  expect(await screen.findByRole("link")).toBeInTheDocument();
});