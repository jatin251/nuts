import { handleProtectedRoute } from '@/lib/server/handleProtectedRoute';
export const ssr = false;

export const load = async (event) => {
  await handleProtectedRoute(event);
};
