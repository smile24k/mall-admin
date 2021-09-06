<template>
	<div class="home page">
		<div class="home-data">
			<div class="home-data-list" v-for="(item, index) in datas" :key="index">{{ item.name }}</div>
		</div>
	</div>
</template>
<script>
import { reactive, ref } from 'vue';
export default {
	setup() {
		const datas = reactive([{ name: '章三' }, { name: '章三' }, { name: '章三' }, { name: '章三' }, { name: '章三' }, { name: '章三' }]);

		return {
			datas,
		};
	},
};
</script>
<style lang="less" scoped>
.home {
	height: 100%;
	&-data {
		.flex;
		&-list {
		}
	}
}
</style>
