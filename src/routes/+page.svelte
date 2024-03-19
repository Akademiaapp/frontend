<script lang="ts">
	import { goto } from '$app/navigation';
	import { userInfo } from '../authStore';

	if ($userInfo) {
		goto('/workspace/home');
	} else {
		goto('/signin');
	}
</script>
