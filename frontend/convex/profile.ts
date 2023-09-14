import { randChoice } from './utils/randChoice';
import { mutationWithAuth, queryWithAuth } from './withAuth';
import { v } from 'convex/values';

export const create = mutationWithAuth({
	args: {
		fullName: v.string(),
		oneLiner: v.string(),
		profilePictureId: v.string(),
		audioBioId: v.string()
	},
	handler: async (ctx, args) => {
		const session = ctx.session;

		await ctx.db.patch(session.userId, {
			fullName: args.fullName,
			oneLiner: args.oneLiner,
			profilePictureId: args.profilePictureId,
			audioBioId: args.audioBioId
		});

		return {
			success: true
		};
	}
});

export const getSelf = queryWithAuth({
	args: {
		withPosts: v.boolean()
	},
	handler: async (ctx, args) => {
		const session = await ctx.session;
		const user = await ctx.db.get(session.userId);

		if (!user)
			return {
				success: false,
				message: 'User not found.'
			};

		let profileImageUrl = null;
		if (user.profilePictureId) profileImageUrl = await ctx.storage.getUrl(user.profilePictureId);

		let audioBioUrl = null;
		if (user.audioBioId) audioBioUrl = await ctx.storage.getUrl(user.audioBioId);

		let posts = null;
		if (args.withPosts)
			posts = await ctx.db.query('posts').withIndex('by_userId', (q) => q.eq('userId', user._id));

		return {
			profileImageUrl: profileImageUrl,
			audioBioUrl: audioBioUrl,
			username: user.username,
			fullName: user.fullName,
			oneliner: user.oneLiner,
			joinDate: user._creationTime,
			posts: posts
		};
	}
});

export const getById = queryWithAuth({
	args: {
		userId: v.id('users'),
		withPosts: v.boolean()
	},
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId);

		if (!user)
			return {
				success: false,
				message: 'User not found.'
			};

		let profileImageUrl = null;
		if (user.profilePictureId) profileImageUrl = await ctx.storage.getUrl(user.profilePictureId);

		let audioBioUrl = null;
		if (user.audioBioId) audioBioUrl = await ctx.storage.getUrl(user.audioBioId);

		let posts = null;
		if (args.withPosts)
			posts = await ctx.db.query('posts').withIndex('by_userId', (q) => q.eq('userId', user._id));

		return {
			profileImageUrl: profileImageUrl,
			audioBioUrl: audioBioUrl,
			username: user.username,
			fullName: user.fullName,
			oneliner: user.oneLiner,
			joinDate: user._creationTime,
			posts: posts
		};
	}
});

export const getRandom = queryWithAuth({
	args: {
		userId: v.id('users'),
		withPosts: v.boolean()
	},
	handler: async (ctx, args) => {
		const allUsers = await ctx.db.query('users').collect();

		const randomUser = randChoice(allUsers);
		const user = await ctx.db.get(randomUser._id);

		if (!user)
			return {
				success: false,
				message: 'User not found.'
			};

		let profileImageUrl = null;
		if (user.profilePictureId) profileImageUrl = await ctx.storage.getUrl(user.profilePictureId);

		let audioBioUrl = null;
		if (user.audioBioId) audioBioUrl = await ctx.storage.getUrl(user.audioBioId);

		let posts = null;
		if (args.withPosts)
			posts = await ctx.db.query('posts').withIndex('by_userId', (q) => q.eq('userId', user._id));

		return {
			profileImageUrl: profileImageUrl,
			audioBioUrl: audioBioUrl,
			username: user.username,
			fullName: user.fullName,
			oneliner: user.oneLiner,
			joinDate: user._creationTime,
			posts: posts
		};
	}
});
