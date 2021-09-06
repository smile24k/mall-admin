<template>
	<div class="block">
		<Home />

		block build
	</div>
</template>
<script>
import Home from './Home.vue';
import { getCurrentInstance } from 'vue';
export default {
	name: 'Block',
	components: {
		Home,
	},
	setup() {
		const { proxy } = getCurrentInstance();
		const select = (e) => {
			const { poi = {} } = e;
			if (!(poi.location || {}).lat) return proxy.$message.error('未定位到经纬度');
		};
		return {
			select,
		};
	},
};
</script>
<style lang="less" scoped></style>
