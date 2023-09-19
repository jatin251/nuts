/* eslint-disable @typescript-eslint/no-unused-vars */
import { handleProtectedRoute } from '@/lib/server/handleProtectedRoute';
import type { PageServerLoad } from '../(landing)/$types';

export const load: PageServerLoad = async (event) => {
  await handleProtectedRoute(event);
};
