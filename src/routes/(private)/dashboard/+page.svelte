<script lang="ts">
	import { getUser, signout } from '$lib/api/auth.remote';

	const user = await getUser();
</script>

<div class="p-5">
	<h1>Dashboard</h1>
	<p>Welcome, {user.name}!</p>
	<p>Email: {user.email}</p>

	<form {...signout}>
		<button type="submit">Sign out</button>
	</form>
</div>
