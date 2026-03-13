import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

const { EMAIL_ENGINE_API_KEY, EMAIL_ENGINE_API_URL } = env;

interface OrganizationJoinInvitationEmailProps {
	email: string;
	invitedByUsername: string;
	invitedByEmail: string;
	organizationName: string;
	inviteLink: string;
	logoUrl?: string | null;
}

export async function sendOrganizationJoinEmail(payload: OrganizationJoinInvitationEmailProps) {
	const url = EMAIL_ENGINE_API_URL;
	if (!url) {
		throw new Error('EMAIL_ENGINE_API_URL is not defined in environment variables.');
	}

	const key = EMAIL_ENGINE_API_KEY;
	if (!key) {
		throw new Error('EMAIL_ENGINE_API_KEY is not defined in environment variables.');
	}

	const response = await fetch(`${url}/send-organization-join-email`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': key },
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		error(500, 'Failed to send email');
	}

	return await response.json();
}

interface ResetPasswordEmailProps {
	email: string;
	resetUrl: string;
}

export async function sendResetPasswordEmail(payload: ResetPasswordEmailProps) {
	const url = EMAIL_ENGINE_API_URL;
	if (!url) {
		throw new Error('EMAIL_ENGINE_API_URL is not defined in environment variables.');
	}

	const key = EMAIL_ENGINE_API_KEY;
	if (!key) {
		throw new Error('EMAIL_ENGINE_API_KEY is not defined in environment variables.');
	}

	const response = await fetch(`${url}/reset-password-email`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': key },
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		throw new Error('Failed to send email');
	}

	return await response.json();
}

interface VerifyEmail {
	email: string;
	username?: string | null;
	url: string;
}

export async function sendEmailVerificationEmail(payload: VerifyEmail) {
	const url = EMAIL_ENGINE_API_URL;
	if (!url) {
		throw new Error('EMAIL_ENGINE_API_URL is not defined in environment variables.');
	}

	const key = EMAIL_ENGINE_API_KEY;
	if (!key) {
		throw new Error('EMAIL_ENGINE_API_KEY is not defined in environment variables.');
	}

	const response = await fetch(`${url}/send-verify-email`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-api-key': key },
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		throw new Error('Failed to send email');
	}

	return await response.json();
}
