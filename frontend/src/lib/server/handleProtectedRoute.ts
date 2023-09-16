import { redirect, type RequestEvent } from '@sveltejs/kit';
import { api, client } from '../convexClient';

export const handleProtectedRoute = async (
  event: RequestEvent,
  message = 'Please login first before accessing that page.'
) => {
  const url = new URL(event.url);
  url.searchParams.set(
    'redirectTo',
    `${event.url.pathname}${event.url.search}`
  );
  url.searchParams.set('message', message);

  if (!event.locals.sessionId) {
    throw redirect(302, `/login?${url.searchParams}`);
  }

  const session = await client.query(api.auth.checkSession, {
    sessionId: event.locals.sessionId
  });

  if (!session) {
    throw redirect(302, `/login?${url.searchParams}`);
  }

  const castedSession = session as {
    success: boolean;
    userIsNew: boolean;
    message: string;
  };

  if (castedSession.userIsNew && event.url.pathname !== '/new-account')
    throw redirect(302, `/new-account`);
};
