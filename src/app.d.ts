import type { Organisation } from '$lib/types/organisations';
import type { Session, User } from 'better-auth/types';
import type { UserAccessContext } from './lib/server/cache/cache';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: (User & { context: UserAccessContext }) | null;
			session: Session | null;
			// requireUser: () => User;
			requireUser: () => User & { context: UserAccessContext };
			requireActiveOrg: () => Organisation | undefined;
		}

		interface PageData {
			user: Locals['user'];
			session: Locals['session'];
		}

		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
