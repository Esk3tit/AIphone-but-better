import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Game from '../game';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

const LOADER_DATA = {
  username: "test",
  user_id: 420,
  game_id: 69,
  round_number: 1,
  all_players_info: [
    {'name': 'player1', 'status': 'writing prompt'}
  ]
};

const IMG_LOADER_DATA = {
  'user_id': '7',
  'game_id': '76',
  'wait': false,
  'username': 'test',
  'round_number': 0,
  'drawn_for': '7',
  'all_players_info': [{'name': 'test', 'status': 'waiting for image generation'}],
  'prompt': 'extreme gaming',
  'ready': 0,
  'chosen_image_id': null,
  'images': [{'id': 73, 'path': '/aiphone/data/76/0/7/0.png'}],
  'generated_images': true
};

const IMG_LIST_LOADER_DATA = {
  'user_id': '7',
  'game_id': '76',
  'wait': false,
  'username': 'test',
  'round_number': 0,
  'drawn_for': '7',
  'all_players_info': [{'name': 'test', 'status': 'waiting for image generation'}],
  'prompt': 'extreme gaming',
  'ready': 0,
  'chosen_image_id': null,
  'images': [
    {'id': 73, 'path': '/aiphone/data/76/0/7/0.png'}, 
    {'id': 74, 'path': '/aiphone/data/76/0/7/1.png'},
    {'id': 75, 'path': '/aiphone/data/76/0/7/2.png'},
    {'id': 76, 'path': '/aiphone/data/76/0/7/3.png'}
  ],
  'generated_images': true
};

const CHOSEN_IMG_LOADER_DATA = {
  all_players_info: [
    {
      name: "test",
      status: "waiting for image generation",
    },
    {
      name: "test2",
      status: "writing prompt",
    },
  ],
  chosen_image_id: 76,
  drawn_for: "7",
  game_id: "79",
  generated_images: true,
  images: [
    {
      id: 76,
      path: "/aiphone/data/79/0/7/0.png",
    },
  ],
  prompt: "test",
  ready: 1,
  round_number: 0,
  user_id: "7",
  username: "test",
  wait: false,
};

const routes = [
  {
    path: "/game",
    element: <Game />,
    loader: () => LOADER_DATA,
  }
];

const img_routes = [
  {
    path: "/game",
    element: <Game />,
    loader: () => IMG_LOADER_DATA,
  }
];

const img_list_routes = [
  {
    path: "/game",
    element: <Game />,
    loader: () => IMG_LIST_LOADER_DATA,
  }
];

const chosen_img_routes = [
  {
    path: "/game",
    element: <Game />,
    loader: () => CHOSEN_IMG_LOADER_DATA,
  }
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/game"],
});

const img_router = createMemoryRouter(img_routes, {
  initialEntries: ["/game"],
});

const img_list_router = createMemoryRouter(img_list_routes, {
  initialEntries: ["/game"],
});

const chosen_img_router = createMemoryRouter(chosen_img_routes, {
  initialEntries: ["/game"],
});

const MockGame = ({ router }) => {
  return (
    <RouterProvider router={router}>
      <Game />
    </RouterProvider>
  );
};

describe("Testing rendering of game page", () => {

  it('should render the correct username field', async () => {
    render(
      <MockGame router={router}/>
    );
    const usernameText = await screen.findByText(/Username: test/i);
    expect(usernameText).toBeInTheDocument();
  });

  it('should render the correct game id field', async () => {
    render(
      <MockGame router={router}/>
    );
    const gameIdText = await screen.findByText(/Game id: 69/i);
    expect(gameIdText).toBeInTheDocument();
  });

  it('should render the correct round number field', async () => {
    render(
      <MockGame router={router}/>
    );
    const roundNumberText = await screen.findByText(/Round number: 2/i);
    expect(roundNumberText).toBeInTheDocument();
  });

  it('should render the username column of the status table', async () => {
    render(
      <MockGame router={router}/>
    );
    const usernameText = await screen.findByText(/^Username$/i);
    expect(usernameText).toBeInTheDocument();
  });

  it('should render the status column of the status table', async () => {
    render(
      <MockGame router={router}/>
    );
    const statusText = await screen.findByText(/Status/i);
    expect(statusText).toBeInTheDocument();
  });

  it('should render the submit button', async () => {
    render(
      <MockGame router={router}/>
    );
    const submitBtn = await screen.findByRole('button', { name: /Submit/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('should render the dropdown', async () => {
    render(
      <MockGame router={router}/>
    );
    const dropdown = await screen.findByLabelText(/Select number of images to generate/i);
    expect(dropdown).toBeInTheDocument();
  });

  it('should render the text field', async () => {
    render(
      <MockGame router={router}/>
    );
    const textField = await screen.findByLabelText(/Enter your prompt:/i);
    expect(textField).toBeInTheDocument();
  });

  it('should render the username in game info accordion', async () => {
    render(
      <MockGame router={router}/>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    const usernameText = await screen.findByText(/^player1$/i);
    expect(usernameText).toBeInTheDocument();
  });

  it('should render the status in game info accordion', async () => {
    render(
      <MockGame router={router}/>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    const statusText = await screen.findByText(/writing prompt/i);
    expect(statusText).toBeInTheDocument();
  });

  it('should render an image when we have image data (from submitting a prompt)', async () => {
    render(
      <MockGame router={img_router}/>
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render 4 images when we have multiple images\' data (from generating 4 images)', async () => {
    render(
      <MockGame router={img_list_router}/>
    );
    expect(screen.getAllByRole('img')).toHaveLength(4);
  });

  it('should render 4 "Choose Image" buttons when we have 4 images', async () => {
    render(
      <MockGame router={img_list_router}/>
    );
    expect(screen.getAllByRole('button', { name: /Choose Image/i })).toHaveLength(4);
  });

  it('should render a chosen image text when we choose image', async () => {
    render(
      <MockGame router={chosen_img_router}/>
    );
    expect(screen.getByText(/Chosen image/i)).toBeInTheDocument();
  });

  it('should render a chosen image when we choose image', async () => {
    render(
      <MockGame router={chosen_img_router}/>
    );
    expect(screen.getByAltText("img76 chosen")).toBeInTheDocument();
  });

});

describe("Testing interactions of game page", () => {

  it('should expand the accordion when clicked', async () => {
    render(
      <MockGame router={router}/>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    expect(accordion).toHaveAttribute("aria-expanded", "true");
  });

  it('should refresh the game when the refresh button is clicked', async () => {
    render(
      <MockGame router={router}/>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    const refreshBtn = await screen.findByRole('button', { name: /Refresh/i });
    fireEvent.click(refreshBtn);
    waitFor(() => {
      expect(screen.findByText(/^noImgRefresh$/i)).toBeInTheDocument();
    });
  });

  it('should collapse the accordion when clicked', async () => {
    render(
      <MockGame router={router}/>
    );
    const accordion = await screen.findByTestId("game-info");
    fireEvent.click(accordion);
    fireEvent.click(accordion);
    expect(accordion).toHaveAttribute("aria-expanded", "false");
  });

  it('should accept input in the textarea/textfield', async () => {
    render(
      <MockGame router={router}/>
    );
    const textField = await screen.findByLabelText(/Enter your prompt:/i);
    fireEvent.change(textField, { target: { value: 'Joe Mama' } });
    expect(textField.value).toBe('Joe Mama');
  });

  it('should change the dropdown values when a new value is selected', async () => {
    render(
      <MockGame router={router}/>
    );
    const dropdown = await screen.findByLabelText(/Select number of images to generate/i);
    fireEvent.mouseDown(dropdown);
    const option1 = await screen.findByText(/^1$/i);
    fireEvent.click(option1);
    waitFor(() => {
      expect(dropdown.value).toBe('1');
    });
  });

  it('should render a modal when a generated image is clicked', async () => {
    render(
      <MockGame router={img_router}/>
    );
    const generatedImg = screen.getByRole('img');
    fireEvent.click(generatedImg);
    waitFor(() => {
      expect(screen.findByAltText('img73 modal')).toBeInTheDocument();
    });
  });

  it('should render a modal image when the chosen image is clicked', async () => {
    render(
      <MockGame router={chosen_img_router}/>
    );
    const chosenImg = screen.getByAltText("img76 chosen");
    fireEvent.click(chosenImg);
    waitFor(() => {
      expect(screen.findByAltText('img76 chosen modal')).toBeInTheDocument();
    });
  });

});