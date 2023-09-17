import { mutationWithAuth } from './withAuth';

export const generateUploadUrl = mutationWithAuth({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  }
});
