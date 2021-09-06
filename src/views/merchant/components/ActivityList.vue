<template>
	<div class="merchant page">
		<PageSearch :searchData="{}" :searchList="searchList"> </PageSearch>
		<MyTable :data="shopList" stripe :colConfigs="colConfigs">
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
		</MyTable>
	</div>
</template>

<script>
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail, initPageData, regionToText, formatDate } from '@util/common';
import { onMounted, reactive, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
	name: 'ActivityList',
	setup(props, { attrs }) {
		const { proxy } = getCurrentInstance();
		const router = useRouter();

		const shopInfo = reactive(attrs.shopInfo);
		const searchList = reactive([
			{
				sort: 2,
				label: '关键词',
				type: 'input',
				val: 'text',
				placeholder: '请输入单员工姓名或者手机号搜索',
			},
		]);

		const colConfigs = reactive([
			{ label: '活动开始时间', prop: 'startTime' },
			{ label: '活动结束时间', prop: 'endTime' },
			{ label: '活动门店', prop: 'name' },
			{ label: '活动状态', prop: 'name' },
			{ label: '发布数量', prop: 'name' },
			{ label: '完成数量', prop: 'name' },
			{ label: '待审核数量', prop: 'name' },
			{ label: '缴纳保证金', prop: 'name' },
			{ label: '缴纳手续费', prop: 'name' },
			{ label: '付款方式', prop: 'name' },
			{ label: '付款账号', prop: 'name' },
			{ slot: 'action' },
		]);
		const pageData = ref(initPageData());

		onMounted(() => {
			getActivityList();
		});
		const shopList = ref([]);
		const getActivityList = async () => {
			const [err, data = {}] = await to(api.getActivityList({ ...pageData.value, shopId: shopInfo.id }));
			if (err) return;
			if (data.status !== 200) return reqFail.call(proxy, data);
			let list = data.data || [];
			list.forEach((_l) => {
				_l.startTime = formatDate(_l.startTime, 'yyyy-MM-dd HH:mm:ss');
				_l.endTime = formatDate(_l.endTime, 'yyyy-MM-dd HH:mm:ss');
			});
			shopList.value = list;
		};
		const jumpUrl = (url) => {
			router.push(url);
		};

		return {
			searchList,
			colConfigs,
			shopList,
			jumpUrl,
			regionToText,
			shopInfo,
		};
	},
};
</script>
