import { Doc, Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { ObjectType, PropertyValidators, v } from 'convex/values';
import cryptoRandomString from 'crypto-random-string';

export async function getSession(ctx: QueryCtx | MutationCtx, sessionId: string) {
	const session = await ctx.db
		.query('sessions')
		.withIndex('sessionId', (q) => q.eq('sessionId', sessionId))
		.first();
	return session;
}

export async function createSession(ctx: MutationCtx, userId: string) {
	const sessionId = cryptoRandomString({ length: 24, type: 'base64' });

	const expiresOn = new Date().getDate() + 10;
	const expireDate = new Date().setDate(expiresOn);

	await ctx.db.insert('sessions', {
		sessionId: sessionId,
		userId: userId as Id<'users'>,
		expiresAt: expireDate.toString()
	});

	return sessionId;
}

export function queryWithAuth<ArgsValidator extends PropertyValidators, Output>({
	args,
	handler
}: {
	args: ArgsValidator;
	handler: (
		ctx: Omit<QueryCtx, 'auth'> & { session: Doc<'sessions'> },
		args: ObjectType<ArgsValidator>
	) => Output;
}) {
	return query({
		args: {
			...args,
			sessionId: v.string()
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		handler: async (ctx, args: any) => {
			const session = await getSession(ctx, args.sessionId);

			if (!session)
				return {
					success: false,
					message: 'No user session found. Please login.'
				};

			return handler({ ...ctx, session }, args);
		}
	});
}
export function mutationWithAuth<ArgsValidator extends PropertyValidators, Output>({
	args,
	handler
}: {
	args: ArgsValidator;
	handler: (
		ctx: Omit<MutationCtx, 'auth'> & { session: Doc<'sessions'> },
		args: ObjectType<ArgsValidator>
	) => Output;
}) {
	return mutation({
		args: { ...args, sessionId: v.string() },
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		handler: async (ctx, args: any) => {
			const session = await getSession(ctx, args.sessionId);
			if (!session)
				return {
					success: false,
					message: 'No user session found. Please login.'
				};

			return handler({ ...ctx, session }, args);
		}
	});
}
