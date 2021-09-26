<template>
	<div class="home page">
		<div class="home-data">
			<div class="img-wrap">
				<div class="image-box" v-for="img in imgs" :key="img">
					<img v-lazy="img.webformatURL" alt="" />
				</div>
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
		let loading = ref(false);
		const getImgs = async () => {
			loading.value = true;
			const [err, data = {}] = await to(api.getImgs(pageData.value));
			loading.value = false;
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			let list = data.result.hits || [];
			imgs.value = imgs.value.concat(list);
		};
		onMounted(() => {
			window.addEventListener('scroll', handleScroll, true);
			getImgs();
		});
		const handleScroll = (e) => {
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			let clientHeight = document.documentElement.clientHeight;
			let scrollHeight = document.documentElement.scrollHeight;
			if (scrollTop + clientHeight >= scrollHeight) {
				// 滚动到底部，逻辑代码
				//事件处理
				if (loading.value) return;
				pageData.value.page++;
				console.log({ ...pageData.value });
				getImgs();
				// 这这里可以写一些业务逻辑，请求数据等
			}
		};

		return {
			datas,
			getImgs,
			imgs,
			handleScroll,
			loading,
		};
	},
	beforeDestroy() {
		window.removeEventListener('scroll', handleScroll, true);
	},
};
</script>
<style lang="less" scoped>
.home {
	height: 100%;

	&-data {
		.img-wrap {
			column-count: 2;
			column-gap: 10px;

			.image-box {
				margin-bottom: 10px;
				break-inside: avoid;
				counter-increment: item-counter;
				img {
					display: block;
					width: 100%;
				}
			}
		}
		@media screen and (min-width: 768px) {
			.img-wrap {
				column-count: 2;
			}
		}
		@media screen and (min-width: 992px) {
			.img-wrap {
				column-count: 4;
			}
		}
		@media screen and (min-width: 1200px) {
			.img-wrap {
				column-count: 6;
			}
		}
	}
}
</style>
