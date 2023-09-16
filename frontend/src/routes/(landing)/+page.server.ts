import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  console.log(event.locals.sessionId);
  if (event?.locals?.sessionId) throw redirect(302, '/app');
};
