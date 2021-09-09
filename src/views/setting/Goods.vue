<template>
	<div class="merchant page">
		<!-- <PageSearch :searchData="{}" :searchList="searchList">
			<template #searchItem>
				<el-cascader placeholder="请选择行政区域" v-model="value" :props="areaProps" @change="handleChange" @expand-change="expandChange"></el-cascader>
			</template>
		</PageSearch> -->
		<MyTable :data="shopList" stripe :colConfigs="colConfigs" style="margin-top: 0">
			<template #headerSlot>
				<el-button round style="margin-left: auto" type="primary" @click="(currId = ''), (shopModalFlag = true)"> 新增商品</el-button>
			</template>
			<template #region>
				<el-table-column label="所在区域" v-slot="{ row }">
					{{ regionToText(row.region) }}
				</el-table-column>
			</template>
			<template #action>
				<el-table-column label="操作" width="120px" v-slot="{ row }">
					<el-button type="text" size="default" @click="(currId = row._id), (shopModalFlag = true)">详情 </el-button>
					<el-button type="text" size="default" @click="updateStatus(row)">{{ row.status === 1 ? '下架' : '上架' }} </el-button>
				</el-table-column>
			</template>
		</MyTable>
		<el-pagination :page-size="10" :pager-count="11" layout="prev, pager, next" :total="count" @current-change="currChange"> </el-pagination>

		<el-dialog v-if="shopModalFlag" :title="currId ? '编辑' : '新增'" v-model="shopModalFlag" width="570px" :before-close="handleClose">
			<AddOrUpdateGoods ref="addGoods" :goodsId="currId" @saveSuccess="(shopModalFlag = false), getGoods()"></AddOrUpdateGoods>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="shopModalFlag = false">取 消</el-button>
					<el-button type="primary" @click="submitShop">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail, initPageData, regionToText, formatDate } from '@util/common';
import { onMounted, reactive, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import AddOrUpdateGoods from './AddOrUpdateGoods.vue';
export default {
	name: 'Goods',
	components: {
		AddOrUpdateGoods,
	},
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

		const colConfigs = reactive([
			// { label: '排序', prop: 'sort' },
			{ label: '商品名称', prop: 'name' },
			{ label: '价格', prop: 'price' },
			{ label: '描述', prop: 'description' },
			{ label: '创建时间', prop: 'createTimeStr' },
			{ slot: 'action' },
		]);
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
			getGoods();
		});
		const count = ref(0);
		const shopList = ref([]);
		const getGoods = async () => {
			const [err, data = {}] = await to(api.goods(pageData.value));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			let list = data.result.list || [];
			list.forEach((_l) => (_l.createTimeStr = formatDate(_l.createTime)));
			shopList.value = list;
			count.value = data.result.count || 0;
		};
		const jumpUrl = (url) => {
			router.push(url);
		};

		const shopModalFlag = ref(false);

		const addGoods = ref();
		const submitShop = () => {
			addGoods.value.submitForm((flag) => {});
		};

		const currId = ref();

		const currChange = (e) => {
			pageData.value.page = e;
			getGoods();
		};

		const updateStatus = async (row) => {
			row.status = row.status === 1 ? 0 : 1;
			const [err, data = {}] = await to(api.updateGoods(row));
			if (err) return (loading.value = false);
			if (!data.success) return reqFail.call(proxy, data);
			proxy.$message.success(row.status === 1 ? '上架成功' : '下架成功');
			getGoods();
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
			shopModalFlag,
			addGoods,
			submitShop,
			currId,
			getGoods,
			currChange,
			count,
			updateStatus,
		};
	},
};
</script>
