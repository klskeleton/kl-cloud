<template>
	<div id="app">
		<router-view></router-view>

	</div>
</template>

<script>
	// import login from './views/login/idnex.vue'

	export default {
		name: 'App',
		components: {
			// login,

		}


	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;

		width: 100%;
		height: 100%;
	}
</style>
