<script lang="ts">
	import { register } from '$lib/api/auth.remote';
	import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
	import EyeOffIcon from '$lib/components/icons/EyeOffIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { registerSchema } from '$lib/validations/auth';
	import zxcvbn from 'zxcvbn';

	let password = $state('');
	let showPassword = $state(false);

	const MIN_LENGTH = 12;

	const isLongEnough = $derived(password.length >= MIN_LENGTH);
	const strength = $derived(password ? zxcvbn(password) : null);
	const score = $derived(strength?.score ?? 0);
</script>

<div class="rounded-lg bg-background p-8 shadow-lg">
	<div class="mb-8 text-center">
		<!-- <div class="mx-auto w-fit">
			<LogoIcon width={48} height={48} />
		</div> -->
		<h2 class="text-2xl font-bold">Create a RatingsRobot Account</h2>
		<p class="mt-6 text-center text-sm text-muted-foreground">
			Already have an account?
			<a href="/signin" class="font-medium text-primary hover:underline"> Sign In </a>
		</p>
	</div>

	<!-- Form-level errors -->
	{#each register.fields.allIssues() as issue}
		<div class="mb-4 rounded-md bg-destructive/10 p-2">
			<p class="text-sm text-destructive">
				{issue.message}
			</p>
		</div>
	{/each}

	<form {...register.preflight(registerSchema)}>
		<div class="space-y-4">
			<div class="space-y-1">
				<Label for="name">Display Name</Label>
				<Input {...register.fields.name.as('text')} placeholder="e.g. Jane Smith" />
			</div>
			<div class="space-y-1">
				<Label for="email">Email address</Label>
				<Input {...register.fields.email.as('email')} placeholder="you@example.com" />
			</div>

			<div class="space-y-1">
				<Label for="password">Password</Label>
				<div class="relative">
					<Input
						{...register.fields.password.as('password')}
						type={showPassword ? 'text' : 'password'}
						placeholder="Enter a password"
						class="pr-10"
					/>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="absolute top-0 right-0 h-full"
						onclick={() => (showPassword = !showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						aria-pressed={showPassword}
					>
						{#if showPassword}
							<EyeIcon class="h-4 w-4" />
						{:else}
							<EyeOffIcon class="h-4 w-4" />
						{/if}
					</Button>
				</div>

				<!-- <div class="mt-2 text-sm">
					{#if password.length > 0 && !isLongEnough}
						<p class="text-sm text-muted-foreground">
							Use at least {MIN_LENGTH} characters.
						</p>
					{:else if isLongEnough}
						<p
							class="text-sm"
							class:text-green-600={score >= 3}
							class:text-yellow-600={score === 2}
							class:text-red-600={score <= 1}
						>
							Password strength:
							{#if score >= 3}
								Strong ✓
							{:else if score === 2}
								OK
							{:else}
								Weak
							{/if}
						</p>
					{/if}
				</div> -->
			</div>

			<Button type="submit" class="w-full" disabled={register.pending > 0}>
				{register.pending > 0 ? 'Registering…' : 'Sign Up'}
			</Button>
		</div>
	</form>

	<!-- <div class="relative my-6">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t"></div>
		</div>
		<div class="relative flex justify-center text-sm">
			<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
		</div>
	</div> -->

	<!-- <div class="space-y-3">
		<Button variant="outline" class="w-full gap-3" onclick={handleGithubRegistration}>
			Sign up with GitHub
		</Button>

		<Button variant="outline" class="w-full gap-3" onclick={handleGoogleRegistration}>
			Sign up with Google
		</Button>
	</div> -->

	<p class="mt-6 text-center text-sm text-muted-foreground">
		Already have an account?
		<a href="/signin" class="font-medium text-primary hover:underline"> Sign in </a>
	</p>
</div>
