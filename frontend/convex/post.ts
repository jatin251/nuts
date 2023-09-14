import { paginationOptsValidator } from 'convex/server';
import { mutationWithAuth, queryWithAuth } from './withAuth';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { nanoid } from 'nanoid';

export const get = queryWithAuth({
	args: {
		paginationOpts: paginationOptsValidator
	},
	handler: async (ctx, args) => {
		// POLISH: Apply some sort of algorithm here as well for getting the posts of friends
		// Do this later.

		const posts = await ctx.db.query('posts').order('desc').paginate(args.paginationOpts);

		return {
			posts: posts,
			success: true
		};
	}
});

export const likePost = mutationWithAuth({
	args: {
		postId: v.id('posts'),
		like: v.optional(v.boolean())
	},
	handler: async (ctx, args) => {
		const like = args.like ?? true;

		const post = await ctx.db.get(args.postId);
		if (!post)
			return {
				success: false,
				message: 'Post does not exist.'
			};

		await ctx.db.patch(args.postId, {
			likes: post.likes + 1,
			likerIds: like
				? [...post.likerIds, ctx.session.userId]
				: post.likerIds.filter((likerId) => likerId !== ctx.session.userId)
		});

		return {
			success: true
		};
	}
});

export const comment = mutationWithAuth({
	args: {
		postId: v.id('posts'),
		comment: v.string()
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId);
		if (!post)
			return {
				success: false,
				message: 'Post does not exist.'
			};

		const newComment: Doc<'posts'>['comments'][number] = {
			commentId: nanoid(),
			comment: args.comment,
			userId: ctx.session.userId
		};

		await ctx.db.patch(args.postId, {
			comments: [...post.comments, newComment]
		});
	}
});
