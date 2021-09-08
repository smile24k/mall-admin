<template>
	<div class="merchant page">
		<!-- <PageSearch :searchData="{}" :searchList="searchList">
			<template #searchItem>
				<el-cascader placeholder="请选择行政区域" v-model="value" :props="areaProps" @change="handleChange" @expand-change="expandChange"></el-cascader>
			</template>
		</PageSearch>
		<MyTable :data="shopList" stripe :colConfigs="colConfigs">
			<template #headerSlot>
				<el-button round style="margin-left: auto" type="primary" @click="jumpUrl('/merchant/init')"> 新增门店</el-button>
			</template>
			<template #region>
				<el-table-column label="所在区域" v-slot="{ row }">
					{{ regionToText(row.region) }}
				</el-table-column>
			</template>
			<template #action>
				<el-table-column label="操作" width="120px" v-slot="{ row }">
					<el-button type="text" size="default" @click="jumpUrl('/merchant/detail?id=' + row.id)">详情 </el-button>
				</el-table-column>
			</template>
		</MyTable> -->
	</div>
</template>

<script>
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail, initPageData, regionToText } from '@util/common';
import { onMounted, reactive, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
	name: 'Merchant',
	setup() {
		const { proxy } = getCurrentInstance();
		const router = useRouter();
		const searchList = reactive([
			{
				sort: 1,
				label: '区域',
				type: 'slot',
			},
			{
				sort: 2,
				label: '关键词',
				type: 'input',
				val: 'text',
				placeholder: '请输入单员工姓名或者手机号搜索',
			},
		]);

		const colConfigs = reactive([{ label: '商户名称', prop: 'name' }, { slot: 'region' }, { label: '门店位置', prop: 'address' }, { label: '保证金余额', prop: 'c' }, { slot: 'action' }]);
		const pageData = ref(initPageData());
		const codes = ref([]); //区域查询code
		const handleChange = (value) => {
			codes.value = value;
		};
		const areaProps = reactive({
			lazy: true,
			lazyLoad(node, resolve) {
				getArea(node.value || 100000, (list) => {
					const nodes = list.map((item) => ({
						value: item.adcode,
						label: item.name,
						leaf: item.level === 'street',
					}));
					// 通过调用resolve将子节点数据返回，通知组件数据加载完成
					resolve(nodes);
				});
			},
		});

		const getArea = async (code, cb) => {
			const [err, data = {}] = await to(api.getArea({ parentAdcode: code }));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			cb && typeof cb === 'function' && cb(data.data);
		};
		onMounted(() => {
			// getArea();
			// getShop();
		});
		const shopList = ref([]);
		const getShop = async () => {
			const [err, data = {}] = await to(api.getShop(pageData.value));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			let list = data.data || [];
			shopList.value = list;
		};
		const jumpUrl = (url) => {
			router.push(url);
		};

		return {
			searchList,
			colConfigs,
			areaProps,
			codes,
			getArea,
			handleChange,
			shopList,
			jumpUrl,
			regionToText,
		};
	},
};
</script>
