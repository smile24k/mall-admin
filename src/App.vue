<template>
	<Menu v-show="!routeMeta.fullScreen">
		<template v-slot:actions>
			<div class="menu-wrap-actions">
				<el-button type="primary" plain round size="small" @click="logout">退 出</el-button>
			</div>
		</template>
	</Menu>
	<div class="router-content" :class="routeMeta.fullScreen ? 'full' : ''">
		<router-view />
	</div>
</template>

<script>
// import { cloneDeep } from 'lodash-es';
import { useRouter, useRoute } from 'vue-router';
import Menu from '@c/Menu.vue';
import { reactive, ref, getCurrentInstance, onMounted, watchEffect } from 'vue';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail, getToken } from '@util/common';
export default {
	components: { Menu },
	setup() {
		const { proxy } = getCurrentInstance();
		const router = useRouter();
		const route = useRoute();

		const routeMeta = ref({});
		watchEffect(() => {
			routeMeta.value = route.meta || {};
		});
		onMounted(() => {
			if (!getToken()) router.replace('/login');
		});
		const logout = async () => {
			const [err, data = {}] = await to(api.logout());
			if (err) return;
			if (data.status !== 200) return reqFail.call(proxy, data);
			router.replace('/login');
		};
		return {
			logout,
			routeMeta,
		};
	},
};
</script>
<style lang="less" scoped>
.menu-wrap {
	&-actions {
		position: absolute;
		right: 20px;
		top: 13px;
	}
}
.router-content {
	height: calc(100% - 61px);
	&.full {
		height: 100%;
	}
	:deep(.page) {
		padding: 12px;
	}
}
</style>
