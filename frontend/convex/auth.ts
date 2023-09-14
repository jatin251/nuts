import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { hashSync, genSaltSync } from 'bcryptjs';
import cryptoRandomString from 'crypto-random-string';
import { queryWithAuth } from './withAuth';

export const register = mutation({
	args: {
		username: v.string(),
		email: v.string(),
		password: v.string()
	},
	handler: async (ctx, args) => {
		// Hash the password
		const salt = await genSaltSync(10);
		const hashed_pass = await hashSync(args.password, salt);

		// Create the account
		const createdUserId = await ctx.db.insert('users', {
			username: args.username,
			email: args.email,
			password: hashed_pass
		});

		// Create session
		const sessionId = cryptoRandomString({ length: 16, type: 'base64' });

		await ctx.db.insert('sessions', {
			sessionId: sessionId,
			userId: createdUserId
		});

		return {
			sessionId: sessionId,
			username: args.username,
			email: args.email
		};
	}
});

export const login = mutation({
	args: {
		usernameOrEmail: v.string(),
		password: v.string()
	},
	handler: async (ctx, args) => {
		const foundByUsername = await ctx.db
			.query('users')
			.filter((user) => user.eq(user.field('username'), args.usernameOrEmail))
			.collect();
	}
});
