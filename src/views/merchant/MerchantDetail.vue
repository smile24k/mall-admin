<template>
	<div class="merchant-detail page">
		<BrandDetail :chainInfo="chainInfo" v-if="chainInfo.id">
			<template #edit>
				<el-button type="text" class="edit" size="default" @click="brandModalFlag = true">编辑</el-button>
			</template>
		</BrandDetail>

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="门店列表" name="first">
				<MyTable :data="shopList" stripe :colConfigs="colConfigs">
					<template #region>
						<el-table-column label="所在区域" v-slot="{ row }">
							{{ regionToText(row.region) }}
						</el-table-column>
					</template>
					<template #action>
						<el-table-column label="操作" width="120px" v-slot="{ row }">
							<el-button type="text" size="default" @click="getShopDetail(row)">编辑 </el-button>
						</el-table-column>
					</template>
				</MyTable>
			</el-tab-pane>
			<el-tab-pane label="数据概况" name="second">数据概况</el-tab-pane>
			<el-tab-pane label="活动列表" name="third">
				<ActivityList v-if="shopInfo.id" :shopInfo="shopInfo"></ActivityList>
			</el-tab-pane>
			<el-tab-pane label="保证金记录" name="fourth">保证金记录</el-tab-pane>
		</el-tabs>
		<!-- 编辑品牌 -->
		<el-dialog v-if="brandModalFlag" title="编辑" v-model="brandModalFlag" width="570px" :before-close="handleClose">
			<AddBrand :chainInfo="cloneDeep(chainInfo)" @setChainInfo="setChainInfo" ref="addBrand"></AddBrand>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="brandModalFlag = false">取 消</el-button>
					<el-button type="primary" :loading="loading" @click="submitChain">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 编辑品牌 -->
		<el-dialog v-if="shopModalFlag" title="编辑" v-model="shopModalFlag" width="570px" :before-close="handleClose">
			<AddShop v-if="shopDetail.id" :shopDetail="shopDetail" @saveSuccess="saveSuccess" ref="addShop"></AddShop>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="shopModalFlag = false">取 消</el-button>
					<el-button type="primary" :loading="loading" @click="submitShop">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail, regionToText } from '@util/common';
import BrandDetail from './components/BrandDetail.vue';
import ActivityList from './components/ActivityList.vue';
import AddBrand from './components/AddBrand.vue';
import AddShop from './components/AddShop.vue';

import { cloneDeep } from 'lodash-es';
export default {
	name: 'MerchantDetail',
	components: {
		BrandDetail,
		ActivityList,
		AddBrand,
		AddShop,
	},
	setup() {
		const { proxy } = getCurrentInstance();
		const router = useRouter();
		const route = useRoute();
		const { id } = route.query;
		if (!id) return router.back(-1);
		const shopInfo = ref({});
		let chainInfo = reactive({});
		const shopList = ref([]);

		const colConfigs = reactive([{ label: '商户名称', prop: 'name' }, { slot: 'region' }, { label: '门店位置', prop: 'address' }, { label: '保证金余额', prop: 'c' }, { slot: 'action' }]);

		const activeName = ref('first');
		const handleClick = (tab, event) => {
			console.log(tab, event);
		};
		onMounted(() => {
			getShopInfo(id);
		});
		const getShopInfo = async (id, cb) => {
			let postData = { id };

			const [err, data = {}] = await to(api.getShopInfo(postData));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			if (data.data.chainId) getChainInfo(data.data.chainId);
			shopInfo.value = data.data;
			cb && typeof cb === 'function' && cb(data.data);
		};
		const getShop = async (chainId) => {
			let postData = { chainId, page: 0 };
			const [err, data = {}] = await to(api.getShop(postData));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			let list = data.data || [];
			shopList.value = list;
			chainInfo.quantity = list.length;
		};
		const getChainInfo = async (id, type = 'init') => {
			const [err, data = {}] = await to(api.getChainInfo({ id }));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			chainInfo = Object.assign(chainInfo, data.data);
			if (type === 'init') getShop(data.data.id);
		};
		const brandModalFlag = ref(false);
		const shopModalFlag = ref(false);

		const handleClose = () => {
			brandModalFlag.value = false;
			shopModalFlag.value = false;
		};
		const addBrand = ref();
		let loading = ref();
		const submitChain = () => {
			loading.value = true;
			addBrand.value.submitForm((flag) => {
				if (!flag) loading.value = false;
			});
		};
		const addShop = ref();
		const submitShop = () => {
			loading.value = true;
			addShop.value.submitForm((flag) => {
				if (!flag) loading.value = false;
			});
		};
		const setChainInfo = (chain) => {
			proxy.$message.success('更新数据成功');
			brandModalFlag.value = false;
			getChainInfo(chainInfo.id, '');
		};

		let shopDetail = reactive({});
		const getShopDetail = (row) => {
			shopModalFlag.value = true;
			getShopInfo(row.id, (res) => {
				shopDetail = Object.assign(shopDetail, res);
			});
		};

		const saveSuccess = () => {
			shopModalFlag.value = false;
			getShopInfo(id);
		};
		return {
			getShopInfo,
			handleClick,
			activeName,
			shopInfo,
			chainInfo,
			colConfigs,
			shopList,
			regionToText,
			brandModalFlag,
			shopModalFlag,
			handleClose,
			submitChain,
			submitShop,
			addBrand,
			addShop,
			setChainInfo,
			cloneDeep,
			shopDetail,
			getShopDetail,
			saveSuccess,
		};
	},
};
</script>
<style lang="less" scoped>
.merchant-detail {
	height: 100%;
	:deep(.el-tabs) {
		height: calc(100% - 175px);
		border-radius: 6px;
		background: #fff;
		padding: 0 12px;
		margin-top: 20px;
		box-shadow: @baseShadow;
	}
}
</style>
