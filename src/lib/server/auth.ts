import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/public';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from '$env/static/private';
import { sendEmailVerificationEmail, sendResetPasswordEmail } from '$lib/server/auth/email';
import { ensureOnboarded } from '$lib/server/auth/onboarding';
import { db } from '$lib/server/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { customSession } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

// src/lib/auth.ts

export const auth = betterAuth({
	secret: BETTER_AUTH_SECRET,
	url: BETTER_AUTH_URL,
	database: drizzleAdapter(db, { provider: 'pg' }),
	authSchema: '../db/schema.ts',
	// advanced: { cookiePrefix: 'rr-app' },
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // Cache duration in seconds
		}
	},

	emailAndPassword: {
		autoSignIn: false,
		enabled: true,
		// requireEmailVerification: true,
		minPasswordLength: 10,
		maxPasswordLength: 128,
		sendResetPassword: async ({ user, url }) => {
			void sendResetPasswordEmail({ email: user.email, resetUrl: url });
			console.log('sendResetPassword...');
		},
		onPasswordReset: async ({ user }) => {
			// ...more logic here
			console.log(`Password for user ${user.email} has been reset.`);
		},
		resetPasswordTokenExpiresIn: 3600 // 1 hour
	},

	emailVerification: {
		sendOnSignUp: false, // This is done manually because the callbackURL is required and can't be specified here
		// sendVerificationEmail: async ({ user, url }) => {
		// 	void sendEmailVerificationEmail({
		// 		email: user.email,
		// 		username: user.name,
		// 		url
		// 	});
		// }
		sendVerificationEmail: async ({ user, token }) => {
			// const url = `http://localhost:5173/api/auth/verify-email?token=${token}&callbackURL=/verify-email`;
			const url = `${env.PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&callbackURL=/verify-email`;
			void sendEmailVerificationEmail({
				email: user.email,
				username: user.name,
				url
			});
		}
	},

	user: {
		additionalFields: {
			onboarded: {
				type: 'boolean',
				required: false,
				default: false
			}
		}
	},

	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			console.log('hooks, after: createAuthMiddleware, ctx.path:', ctx.path);
			if (ctx.path.startsWith('/sign-in')) {
				// When a user signs in, check that they have a default
				// workspace and initial default template.
				const newSession = ctx.context.newSession;
				if (newSession) {
					//const { user } = newSession;
					// await ensureOnboarded(user);
				}
			}
			// if (ctx.path.startsWith('/sign-up')) {
			// 	const newSession = ctx.context.newSession;
			// 	if (newSession) {
			// 		sendMessage({
			// 			type: 'user-register',
			// 			name: newSession.user.name
			// 		});
			// 	}
			// }
		})
		// beforeSignIn
	},

	databaseHooks: {
		user: {
			create: {
				// 'after' ensures the user record was successfully staged/created
				after: async (user) => {
					console.log('databaseHooks, user, create, user:', user);

					// TODO - DON'T CALL THIS IF THE USER WAS INVITED
					//await ensureOnboarded(user);

					// // 1. Create a default profile or workspace
					// await db.insert(profileTable).values({
					// 	userId: user.id,
					// 	bio: "Hello, I'm new here!"
					// });

					// // 2. Example: Create a default SaaS workspace
					// await db.insert(workspaceTable).values({
					// 	name: `${user.name}'s Workspace`,
					// 	ownerId: user.id
					// });

					console.log(`Setup complete for user: ${user.email}`);
				}
			}
		}
	},

	plugins: [
		// customSession(async ({ user, session }) => {
		// 	console.log('customSession, user:', user);

		// 	// 	/**
		// 	// 	 * If the user is a single workspace on the free plan then we handle the UI differently
		// 	// 	 * than if they have multiple workspace, or a single workspace with multiple templates.
		// 	// 	 *
		// 	// 	 * In short, we want to hide the complexity of multiple workspaces and templates
		// 	// 	 * for users with free accounts - i.e. keep it simple.
		// 	// 	 */

		// 	console.log({ session });

		// 	// 	const workspaceMembership = await getUserTemplates(user.id);
		// 	// 	const workspaceCount = workspaceMembership.length;
		// 	// 	// const templateCount = workspaceMembership.reduce((acc, membership) => {
		// 	// 	// 	return acc + membership.templates.length;
		// 	// 	// }, 0);

		// 	// 	const isBasicUser =
		// 	// 		workspaceCount === 1 &&
		// 	// 		// templateCount === 1 &&
		// 	// 		workspaceMembership[0].planType === PlanTypes.Free;

		// 	// 	return {
		// 	// 		user: {
		// 	// 			...user,
		// 	// 			planType: PlanTypes.Free,
		// 	// 			isBasicUser
		// 	// 		},
		// 	// 		session
		// 	// 	};
		// }),
		sveltekitCookies(getRequestEvent)
	]
});
