import { rest } from 'msw';

export const handlers = [
  rest.get('/create_game', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        game_id: '1234567890',
      })
    );
  }),

  rest.get('/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        game_id: '1234567890',
        user_id: '123',
      })
    );
  }),

  rest.get('http://localhost:5000/socket.io/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: "Mock response"
      })
    );
  }),

  rest.post('/submit_prompt', async (req, res, ctx) => {

    return res(
      ctx.status(200),
      ctx.json({
        user_id: '7',
        game_id: '76',
        wait: 1,
      })
    );
  }),

  rest.get('http://localhost:5000/game', async (req, res, ctx) => {

    return res(
      ctx.status(200),
      ctx.json({
        user_id: '4',
        game_id: '77',
        wait: false,
        username: 'noImgRefresh',
        round_number: 0,
        drawn_for: '4',
        all_players_info: [{'name': 'noImgRefresh', 'status': 'writing prompt'}]
      }),
    );

  })

]