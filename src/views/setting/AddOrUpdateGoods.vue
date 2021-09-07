<template>
	<div class="add-shop">
		<el-form :model="formData" ref="shopForm" label-width="100px">
			<el-form-item label="商品名称">
				<el-input maxlength="15" v-model="formData.name"></el-input>
			</el-form-item>
			<el-form-item label="商品价格">
				<el-input maxlength="15" v-model.number="formData.price"></el-input>
			</el-form-item>
			<el-form-item label="商品描述">
				<el-input maxlength="200" type="textarea" v-model="formData.description"></el-input>
			</el-form-item>

			<slot name="submit"></slot>
		</el-form>
	</div>
</template>

<script>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail } from '@util/common';
export default {
	name: 'AddOrUpdateGoods',
	setup(props, { emit, attrs }) {
		let goodsId = ref(attrs.goodsId);

		const { proxy } = getCurrentInstance();
		let formData = reactive({
			name: '',
			description: '',
			price: undefined,
			type: 1,
			category: '12jif93',
		});
		const shopForm = ref(null);
		const submitForm = (cb) => {
			shopForm.value.validate((valid) => {
				if (!valid) return proxy.$message.error('请输入必填项'), cb(false);
				saveActivity();
			});
		};

		const saveActivity = async () => {
			const [err, data = {}] = goodsId.value ? await to(api.updateGoods(formData)) : await to(api.saveGoods(formData));
			if (err) return (loading.value = false);
			if (!data.success) return reqFail.call(proxy, data);
			proxy.$message.success(goodsId.value ? '编辑成功' : '活动添加成功');
			emit('saveSuccess');
		};
		onMounted(() => {
			getGoodsById();
		});
		const shopList = ref([]);
		const getGoodsById = async () => {
			const [err, data = {}] = await to(api.getGoodsById({ id: goodsId.value, url: '/api/goods/id/' + goodsId.value }));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			formData = Object.assign(formData, data.result);
		};

		const payList = ref([]);
		const getPayList = async () => {
			const [err, data = {}] = await to(api.getPayList());
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			payList.value = data.data;
		};
		const regionSelect = (e) => {
			console.log(e);
			formData.region = e;
		};

		return {
			formData,
			shopForm,
			submitForm,
			saveActivity,
			regionSelect,
			shopList,
			goodsId,
			getGoodsById,
			payList,
			getPayList,
		};
	},
};
</script>
<style lang="less" scoped>
.add-shop {
	margin-top: 20px;
	max-width: 800px;
}
</style>
