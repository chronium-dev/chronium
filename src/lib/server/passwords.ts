import crypto from 'crypto';

export async function isPasswordPwned(password: string): Promise<boolean> {
	const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

	const prefix = sha1.slice(0, 5);
	const suffix = sha1.slice(5);

	const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
		headers: {
			'Add-Padding': 'true' // prevents timing attacks
		}
	});

	if (!res.ok) {
		// Fail open or closed?
		// Best practice: fail OPEN to avoid blocking signups
		return false;
	}

	const text = await res.text();

	return text.split('\n').some((line) => {
		const [hashSuffix] = line.split(':');
		return hashSuffix === suffix;
	});
}
