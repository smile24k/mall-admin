<template>
	<div class="add-shop">
		<el-form :model="formData" :rules="formRules" ref="shopForm" label-width="100px">
			<el-form-item label="品牌名称" prop="brand">
				<el-input v-model="formData.brand"></el-input>
			</el-form-item>

			<el-form-item label="主营类目" prop="category">
				<el-select v-model="formData.category" value-key="id" placeholder="请选择主营类目">
					<el-option :label="item.name" :value="item" v-for="item in categoryList" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌简介">
				<el-input maxlength="200" v-model="formData.introduce"></el-input>
			</el-form-item>
			<el-form-item label="所在区域">
				<RegionSelect @regionSelect="regionSelect" :codes="codes" />
			</el-form-item>
			<el-form-item label="详细地址">
				<el-input maxlength="50" v-model="formData.address"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="contact">
				<el-input maxlength="6" v-model="formData.contact"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="contact">
				<el-input maxlength="11" v-model.number="formData.contactPhone"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input maxlength="80" v-model="formData.memo"></el-input>
			</el-form-item>
			<slot name="submit"></slot>
		</el-form>
	</div>
</template>

<script>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import RegionSelect from '@c/RegionSelect.vue';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail } from '@util/common';
export default {
	name: 'AddBrand',
	components: {
		RegionSelect,
	},
	setup(props, { emit, attrs }) {
		const { proxy } = getCurrentInstance();
		let formData = reactive({
			brand: '',
			region: {},
			category: {},
			introduce: '', //简介
			address: '',
			contact: '',
			contactPhone: '',
			memo: '',
		});
		const formRules = reactive({
			brand: [
				{ required: true, message: '请输入品牌名称', trigger: 'blur' },
				{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
			],
			contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
			contactPhone: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
			category: [{ required: true, message: '请选择类别', trigger: 'change' }],
			region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
		});
		const shopForm = ref(null);
		const submitForm = (cb) => {
			shopForm.value.validate((valid) => {
				if (!valid) return proxy.$message.error('请输入必填项'), cb(false);
				saveChain();
			});
		};

		const saveChain = async () => {
			const [err, data = {}] = await to(api.saveChain(formData));
			if (err) return (loading.value = false);
			if (!data.success) return reqFail.call(proxy, data);
			proxy.$message.success('品牌设置成功');
			emit('setChainInfo', data.data);
		};

		onMounted(() => getCategory());

		const categoryList = ref([]);
		const getCategory = async () => {
			const [err, data = {}] = await to(api.getCategory());
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			categoryList.value = data.data;
		};
		const regionSelect = (e) => {
			console.log(e);
			formData.region = e;
		};
		let codes = ref([]);
		if (attrs.chainInfo) {
			let chainInfo = reactive(attrs.chainInfo);
			formData = chainInfo;
			if (attrs.chainInfo.region) {
				const { provinceCode, cityCode, districtCode, townCode } = attrs.chainInfo.region;
				codes.value = [provinceCode, cityCode, districtCode, townCode];
			}
		}

		return {
			formData,
			formRules,
			shopForm,
			submitForm,
			saveChain,
			regionSelect,
			categoryList,
			codes,
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
