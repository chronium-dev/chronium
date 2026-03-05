import { form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/server/auth';
import { isPasswordPwned } from '$lib/server/passwords';
import {
	forgetPasswordSchema,
	passwordMsg,
	registerSchema,
	resetPasswordSchema,
	signinSchema
} from '$lib/validations/auth';
import { invalid, redirect } from '@sveltejs/kit';
import zxcvbn from 'zxcvbn';

export const register = form(registerSchema, async (user) => {
	const { name, email, password } = user;

	// Length check
	if (password.length < 10) {
		invalid(passwordMsg);
	}

	// Entropy check
	const { score } = zxcvbn(password);
	if (score < 3) {
		invalid(`This password is easy to guess.
Try using 3 - 4 unrelated words, or add more length and variety.`);
	}

	// Breach check
	if (await isPasswordPwned(password)) {
		invalid('This password has appeared in a data breach. Please choose a different one.');
	}

	const newUser = { name: name ? name : email.split('@'[0]).join(' '), email, password };

	const response = await auth.api.signUpEmail({
		body: newUser,
		asResponse: true
	});
	if (!response.ok) {
		//console.log('register response:', response);
		const data = await response.json();
		//console.log('register data:', data);
		if (data.code == 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
			invalid(
				'That email address is already in use. Click the signin link above or use a different email address.'
			);
		} else {
			invalid('Sorry, an error occurred while registering the account. Please try again.');
		}
	}

	await auth.api.sendVerificationEmail({
		body: {
			email: newUser.email,
			callbackURL: '/verify-email' // The redirect URL after verification
		}
	});

	redirect(307, `/verify-email-sent`);
});

export const signin = form(signinSchema, async (user) => {
	const { request } = getRequestEvent();
	const response = await auth.api.signInEmail({
		body: user,
		headers: request.headers,
		asResponse: true
	});
	console.log('signin response:', response);

	// if (response.status === 401) {
	// 	return fail(401, 'Invalid email address or password');
	// }

	// if (response.status === 403) {
	// 	return fail(response.status, 'Cannot sign-in, have you verified your email address?');
	// }

	// if (response.status !== 200) {
	// 	return fail(response.status, 'Invalid email address or password');
	// }

	// if (response.status === 401) {
	// 	return invalid('401');
	// }

	// if (response.status === 403) {
	// 	return invalid('403');
	// }

	if (response.status !== 200) {
		return invalid(response.status.toString());
	}

	// Post-signin checks
	const redirectTo =
		'/post-signin' +
		(user.redirect && user.redirect.startsWith('/') ? `?redirect=${user.redirect}` : '');
	redirect(303, redirectTo);
});

export const signout = form(async () => {
	const { request } = getRequestEvent();
	await auth.api.signOut({ headers: request.headers });
	redirect(303, '/signin');
});

export const getUser = query(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(307, '/signin');
	}
	return locals.user;
});

export const forgotPassword = form(forgetPasswordSchema, async ({ email }) => {
	const result = await auth.api.requestPasswordReset({
		body: {
			email,
			redirectTo: '/reset-password'
		}
	});
	console.log('forgotPassword result:', result);

	if (!result.status) {
		invalid(
			'Sorry, an error occurred while sending teh password reset link. Please try again later.'
		);
	}

	return { success: true };
});

export const resetPassword = form(resetPasswordSchema, async (data) => {
	const { password, token } = data;

	// Length check
	if (password.length < 10) {
		invalid(passwordMsg);
	}
	// Entropy check
	const { score } = zxcvbn(password);
	if (score < 3) {
		invalid(`This password is easy to guess.
	Try using 3 - 4 unrelated words, or add more length and variety.`);
	}
	// Breach check
	if (await isPasswordPwned(password)) {
		invalid('This password has appeared in a data breach. Please choose a different one.');
	}

	const result = await auth.api.resetPassword({
		body: {
			newPassword: password,
			token
		}
	});

	console.log('resetPassword result:', result);

	if (!result.status) {
		invalid('Sorry, an error occurred while resetting the password. Please try again later.');
	}

	redirect(302, `/signin?status=2`);
});

// export const getAccount = query(z.string(), async (userId) => {
// 	const [userRecord] = await db.select().from(user).where(eq(user.id, userId));
// 	if (!userRecord) error(404, 'User not found');
// 	return userRecord;
// });

// export const updateAccount = form(updateAccountSchema, async ({ userId, name }) => {
// 	await db.update(user).set({ name }).where(eq(user.id, userId));
// });
