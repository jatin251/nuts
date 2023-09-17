import { ResponseStatus } from './responseStatuses';
import { mutationWithAuth } from './withAuth';

export const generateUploadUrl = mutationWithAuth({
  args: {},
  handler: async (ctx) => {
    const uploadUrl = await ctx.storage.generateUploadUrl();

    return {
      status: ResponseStatus.Success,
      uploadUrl: uploadUrl
    };
  }
});
