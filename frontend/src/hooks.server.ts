// import { api, client } from './lib/convexClient';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get('auth');

  event.locals.sessionId = sessionId;

  const response = await resolve(event);

  return response;
};
