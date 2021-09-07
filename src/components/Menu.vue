<template>
	<el-affix style="width: 100%">
		<el-menu :default-active="defaultActive" class="menu-box" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<template v-for="item in menus">
				<el-submenu v-if="(item.children || []).length" :index="item.id" :key="item.id">
					<template #title>
						{{ item.name }}
					</template>
					<el-menu-item v-for="(items, key) in item.children" :key="key" :index="items.id" :route="items">
						{{ items.name }}
					</el-menu-item>
				</el-submenu>
				<el-menu-item v-else :index="item.id" :key="item.id" :route="item">
					{{ item.name }}
				</el-menu-item>
			</template>
		</el-menu>
		<slot name="actions"></slot>
	</el-affix>
</template>
<script>
import { defineComponent, ref, onMounted, getCurrentInstance, computed, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail, getToken } from '@util/common';
export default defineComponent({
	setup() {
		const { proxy } = getCurrentInstance();
		const router = useRouter();
		const route = useRoute();
		const menus = ref([]);
		const handleSelect = (key, keyPath, routeResult) => {
			let url = routeResult.route.url;
			router.replace(url);
		};

		onMounted(async () => {
			if (!getToken()) return;
			const [err, data = {}] = await to(api.getMenu());
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			menus.value = data.result || [];
		});
		const defaultActive = computed(() => {
			const { meta } = toRaw(route);
			let parentMenu = menus.value.find((_m) => _m.url === meta.value.auth) || {};
			return parentMenu.id;
		});

		return {
			menus,
			defaultActive,
			handleSelect,
		};
	},
});
</script>

<style lang="less" scoped>
.menu-box {
	padding-left: 55px;
}
</style>
