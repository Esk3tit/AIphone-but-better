import { rest } from 'msw';

export const handlers = [
  rest.get('/create_game', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        game_id: '1234567890',
      })
    );
  })
]