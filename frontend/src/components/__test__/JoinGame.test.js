import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import JoinGame from "../JoinGame";
import { createMemoryHistory } from "history";

const MockJoinGame = () => {
  const history = createMemoryHistory();

  return (
    <Router location={history.location} navigator={history}>
      <JoinGame gameId={undefined} setGameId={jest.fn()} />
    </Router>
  );
};

describe("JoinGame rendering tests", () => {
  it("should render the submit button", () => {
    render(<MockJoinGame />);

    const componentTitle = screen.getByRole("button", { name: "Submit" });
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render the username text field", () => {
    render(<MockJoinGame />);

    const textboxElement = screen.getByPlaceholderText("Enter username");
    expect(textboxElement).toBeInTheDocument();
  });

  it("should render the game id text field", () => {
    render(<MockJoinGame />);

    const textboxElement = screen.getByPlaceholderText("Enter game id");
    expect(textboxElement).toBeInTheDocument();
  });
});

describe("JoinGame interaction tests", () => {
  it("should be able to type into the username field", () => {
    render(<MockJoinGame />);

    const textboxElement = screen.getByPlaceholderText("Enter username");
    fireEvent.change(textboxElement, { target: { value: "test123" } });
    expect(textboxElement.value).toBe("test123");
  });

  it("should be able to type into the game id text field", () => {
    render(<MockJoinGame />);

    const textboxElement = screen.getByPlaceholderText("Enter game id");
    fireEvent.change(textboxElement, { target: { value: "123" } });
    expect(textboxElement.value).toBe("123");
  });

  it("should NOT let you go to game if username field is not filled out", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <JoinGame gameId={undefined} setGameId={jest.fn()} />
      </Router>
    );

    const textboxElement = screen.getByPlaceholderText("Enter game id");
    fireEvent.change(textboxElement, { target: { value: "123" } });
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    await waitFor(() => expect(history.location.pathname).toBe("/"));
  });

  it("should NOT let you go to game if game id field is not filled out", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <JoinGame gameId={undefined} setGameId={jest.fn()} />
      </Router>
    );

    const textboxElement = screen.getByPlaceholderText("Enter username");
    fireEvent.change(textboxElement, { target: { value: "test123" } });
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    await waitFor(() => expect(history.location.pathname).toBe("/"));
  });

  it("should let you go to game if both fields are filled out", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <JoinGame gameId={undefined} setGameId={jest.fn()} />
      </Router>
    );

    const usernameElement = screen.getByPlaceholderText("Enter username");
    fireEvent.change(usernameElement, { target: { value: "test123" } });
    const gameIdElement = screen.getByPlaceholderText("Enter game id");
    fireEvent.change(gameIdElement, { target: { value: "123" } });
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
    await waitFor(() => expect(history.location.pathname).toBe("/game"));
  });
});
