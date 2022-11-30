import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Error from '../error';
import { createMemoryRouter, RouterProvider, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const routes = [
  {
    path: "/",
    element: <div>Home</div>,
    loader: () => {throw new Response("Not Found", { status: 404 });},
    errorElement: <Error />
  }
];

const router = createMemoryRouter(routes);

describe("Error rendering tests", () => {

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

  it("should render the image span", async () => {
    render(
      <RouterProvider router={router}>
        <Error />
      </RouterProvider>
    );
    expect(await screen.findByTestId("span")).toBeInTheDocument();
  });

});

describe("Error interaction tests", () => {
  it("should take the user back to the home page when clicking on button/link", async () => {

    const history = createMemoryHistory();

    render(
      <RouterProvider router={router}>
        <Router location={history.location} navigator={history}>
          <Error />
        </Router>
      </RouterProvider>
    );
    const goBackButton = await screen.findByRole("link");
    fireEvent.click(goBackButton);
    await waitFor(() => expect(history.location.pathname).toBe('/'));
  });
});