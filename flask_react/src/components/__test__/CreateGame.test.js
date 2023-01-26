import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import CreateGame from "../CreateGame";
import { createMemoryHistory } from "history";
import { act } from "@testing-library/react";

describe("CreateGame rendering tests", () => {
  it("should render the Create Game button", () => {
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <CreateGame gameId={1} setGameId={jest.fn()} />
      </Router>
    );
    const componentTitle = screen.getByRole("button", { name: "Create Game" });
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render the v2 updated turns text", () => {
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <CreateGame gameId={1} setGameId={jest.fn()} />
      </Router>
    );

    const textElement = screen.getByText(
      /AIphone V2 Update: The number of turns is now dependent on the number of players and the game ends/i
    );
    expect(textElement).toBeInTheDocument();
  });

  it("should render a notification after submitting", async () => {
    const history = createMemoryHistory();

    const setGameId = jest.fn();

    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <CreateGame gameId={undefined} setGameId={setGameId} />
        </Router>
      );
    });

    const submitButton = screen.getByRole("button", { name: "Create Game" });
    act(() => {
      fireEvent.click(submitButton);
    });
    const snackbarElement = await screen.findByText(
      /The game ID to share with your friends is:/i
    );
    expect(snackbarElement).toBeInTheDocument();
  });

  it("should render a notification with a copy to clipboard button", async () => {
    const history = createMemoryHistory();

    const setGameId = jest.fn();

    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <CreateGame gameId={undefined} setGameId={setGameId} />
        </Router>
      );
    });

    const submitButton = screen.getByRole("button", { name: "Create Game" });
    act(() => {
      fireEvent.click(submitButton);
    });
    const copyToClipboardElement = await screen.findByText(
      /COPY TO CLIPBOARD/i
    );
    expect(copyToClipboardElement).toBeInTheDocument();
  });
});

describe("CreateGame interaction tests", () => {
  it("should allow users to create a new game and then disable the submit button afterwards", async () => {
    const history = createMemoryHistory();
    const setGameId = jest.fn();

    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <CreateGame gameId={undefined} setGameId={setGameId} />
        </Router>
      );
    });

    const submitButton = screen.getByRole("button", { name: "Create Game" });
    act(() => {
      fireEvent.click(submitButton);
    });
    waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("should close snackbar after 6 seconds", async () => {
    const history = createMemoryHistory();
    const setGameId = jest.fn();

    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <CreateGame gameId={undefined} setGameId={setGameId} />
        </Router>
      );
    });

    const submitButton = screen.getByRole("button", { name: "Create Game" });
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/The game ID to share with your friends is:/i)
      ).not.toBeInTheDocument();
    });
  });
});