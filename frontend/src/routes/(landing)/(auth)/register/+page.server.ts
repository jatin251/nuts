import type { Actions } from '@sveltejs/kit';
import { client, api } from '@/lib/convexClient';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();

    const username = await data.get('username');
    const email = await data.get('email');
    const password = await data.get('password');

    if (!username || !password || !email) return { success: false };

    const registerResult = await client.mutation(api.auth.register, {
      username: username as string,
      email: email as string,
      password: password as string
    });

    // Set Cookie (For SvelteKit Protected Routes)
    if (registerResult && registerResult?.session?.sessionId) {
      event.cookies.set('auth', registerResult.session.sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: registerResult.session.maxAge
      });
    }

    return registerResult;
  }
};
