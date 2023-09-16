import type { Actions } from '@sveltejs/kit';
import { client, api } from '@/lib/convexClient';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();

    const usernameOrEmail = await data.get('usernameOrEmail');
    const password = await data.get('password');

    console.log(usernameOrEmail, password);

    if (!usernameOrEmail || !password) return { success: false };

    const loginResult = await client.mutation(api.auth.login, {
      usernameOrEmail: usernameOrEmail as string,
      password: password as string
    });

    console.log(loginResult);

    return loginResult;
  }
};
