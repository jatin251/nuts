import { api, client } from '$lib/convexClient';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  console.log(event.locals.sessionId);
  if (event?.locals?.sessionId) {
    const session = await client.query(api.auth.checkSession, {
      sessionId: event.locals.sessionId
    });

    if (session.status === 'Success') throw redirect(302, '/app');
  }
};
