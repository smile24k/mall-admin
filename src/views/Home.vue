<template>
	<div class="home page">
		<div class="home-data">
			<div class="home-data-list" v-for="(item, index) in imgs" :key="index">
				<img :src="item.webformatURL" alt="" srcset="" />
			</div>
		</div>
	</div>
</template>
<script>
import api from '@/api/index';
import to from 'await-to-js';

import { reqFail, initPageData, regionToText, formatDate } from '@util/common';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
export default {
	setup() {
		const { proxy } = getCurrentInstance();
		const datas = reactive([]);
		const pageData = ref(initPageData(50));
		let imgs = ref([]);
		const getImgs = async () => {
			const [err, data = {}] = await to(api.getImgs(pageData.value));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			let list = data.result.hits || [];
			imgs.value = list;
		};
		onMounted(() => {
			getImgs();
		});

		return {
			datas,
			getImgs,
			imgs,
		};
	},
};
</script>
<style lang="less" scoped>
.home {
	height: 100%;
	&-data {
		.flex;
		flex-wrap: wrap;
		&-list {
			width: 640px;
			height: 427px;
		}
	}
}
</style>
