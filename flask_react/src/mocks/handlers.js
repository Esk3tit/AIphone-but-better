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

  rest.get('/socket.io', (req, res, ctx) => {
    return res(
      ctx.status(200)
    );
  }),

  
  rest.post('/submit_prompt', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user_id: '7',
        game_id: '76',
        wait: 1,
      })
    );
  }),

  rest.get('/game', (req, res, ctx) => {

    return res(
      ctx.status(200),
      ctx.json({
        'user_id': '4',
        'game_id': '77',
        'wait': False,
        'username': 'noImgRefresh',
        'round_number': 0,
        'drawn_for': '4',
        'all_players_info': [{'name': 'noImgRefresh', 'status': 'writing prompt'}]
      })
    )

    if (!("num_images" in req.body)) {
      return res(
        ctx.status(200),
        ctx.json({
          'user_id': '4',
          'game_id': '77',
          'wait': False,
          'username': 'noImgRefresh',
          'round_number': 0,
          'drawn_for': '4',
          'all_players_info': [{'name': 'noImgRefresh', 'status': 'writing prompt'}]
        })
      )
    }

    if (req.body.num_images === 1) {
      return res(
        ctx.status(200),
        ctx.json({
          'user_id': '7',
          'game_id': '76',
          'wait': False,
          'username': 'test',
          'round_number': 0,
          'drawn_for': '7',
          'all_players_info': [{'name': 'test', 'status': 'waiting for image generation'}],
          'prompt': 'extreme gaming',
          'ready': 0,
          'chosen_image_id': None,
          'images': [{'id': 73, 'path': '/aiphone/data/76/0/7/0.png'}],
          'generated_images': True
        })
      )
    }

  })

]