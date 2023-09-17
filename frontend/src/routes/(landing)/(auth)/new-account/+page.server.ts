import { handleProtectedRoute } from '@/lib/server/handleProtectedRoute';
import type { PageServerLoad } from './$types';
export const ssr = false;

export const load: PageServerLoad = async (event) => {
  await handleProtectedRoute(event);
};
