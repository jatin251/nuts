import { handleProtectedRoute } from '@/lib/server/handleProtectedRoute';

export const load = async (event) => {
  await handleProtectedRoute(event);
};
