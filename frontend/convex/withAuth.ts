import { QueryCtx, query } from './_generated/server';
import { ObjectType, PropertyValidators, v } from 'convex/values';

export function queryWithAuth<ArgsValidator extends PropertyValidators, Output>({
	args,
	handler
}: {
	args: ArgsValidator;
	handler: (
		ctx: Omit<QueryCtx, 'auth'> & { session: unknown | null },
		args: ObjectType<ArgsValidator>
	) => Output;
}) {
	return query({
		args: {
			...args,
			sessionId: v.id('sessions')
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		handler: async (ctx, args: any) => {
			const session = await ctx.db.get(args.sessionId);
			return handler({ ...ctx, session }, args);
		}
	});
}
