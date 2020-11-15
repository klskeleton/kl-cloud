<template>
	<div class="cloud-page">

		<!-- <filelsit class="filelsit"></filelsit> -->
		<filetree class="filetree"></filetree>
	</div>
</template>

<script>
	import filetree from './components/FileTree.vue'
	import filelsit from './components/FileList.vue'

	export default {
		components: {
			filelsit,
			filetree
		},
		data() {
			return {}
		},
		methods: {},
		mounted() {

		},
	}
</script>

<style scoped>
	.cloud-page {}

	.filetree {
		min-height: 100%;
		height: 100%;
	}

	@media screen and (max-width:600px) {
		.cloud-page {
			margin: 0px;
			min-height: 300px;
			height: 100%;
		}
	}

	@media screen and (min-width:1200px) {
		.cloud-page {
			margin: 10px 40px 40px 40px;
			min-height: 300px;
			height: 100%;
		}
	}
</style>
