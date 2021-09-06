<template>
	<div class="add-shop">
		<el-form :model="formData" :rules="formRules" ref="shopForm" label-width="100px">
			<el-form-item label="门店名称" prop="name">
				<el-input v-model="formData.name"></el-input>
			</el-form-item>
			<el-form-item label="门店类型">
				<el-radio-group v-model="formData.type">
					<el-radio :label="0">直营店</el-radio>
					<el-radio :label="1">加盟店</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="门店简介">
				<el-input maxlength="200" v-model="formData.introduce"></el-input>
			</el-form-item>
			<el-form-item label="所在区域" prop="region">
				<RegionSelect @regionSelect="regionSelect" :codes="codes" :key="regionKey" />
			</el-form-item>

			<el-form-item label="地图选点">
				<GeoMap @select="select"></GeoMap>
			</el-form-item>

			<el-form-item label="详细地址">
				<el-input maxlength="50" v-model="formData.address"></el-input>
			</el-form-item>
			<el-form-item label="经度">
				<el-input maxlength="12" v-model="formData.loc.lat"></el-input>
			</el-form-item>
			<el-form-item label="纬度">
				<el-input maxlength="12" v-model="formData.loc.lng"></el-input>
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
			<!-- <el-form-item>
				<el-button type="primary" @click="submitForm">立即创建</el-button>
			</el-form-item> -->
		</el-form>
	</div>
</template>

<script>
import { reactive, ref, getCurrentInstance } from 'vue';
import RegionSelect from '@c/RegionSelect.vue';
import GeoMap from '@c/GeoMap.vue';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail } from '@util/common';
export default {
	name: 'AddShop',
	components: {
		RegionSelect,
		GeoMap,
	},
	setup(props, { emit, attrs }) {
		const { proxy } = getCurrentInstance();
		let formData = reactive({
			name: '',
			region: '',
			category: '',
			introduce: '', //简介
			address: '',
			contact: '',
			contactPhone: '',
			loc: {
				lat: '',
				lng: '',
			},
			memo: '',
			chainId: '',
		});
		const regionKey = ref(0);
		const formRules = reactive({
			name: [
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
				if (!valid) return proxy.$message.error('请录入完成数据'), cb(false);
				saveShop();
			});
		};
		const regionSelect = (e) => {
			formData.region = e;
		};
		const select = (e) => {
			const { poi = {} } = e;
			if (!(poi.location || {}).lat) return proxy.$message.error('未定位到经纬度,请从新搜索');
			formData.loc.lat = poi.location.lat;
			formData.loc.lng = poi.location.lng;
			formData.address = poi.name;
		};
		const saveShop = async () => {
			const [err, data = {}] = await to(api.saveShop(formData));
			if (err) return (loading.value = false);
			if (data.status !== 200) return reqFail.call(proxy, data);
			proxy.$message.success('门店设置成功');
			emit('saveSuccess');
		};

		const setChainId = (id) => {
			regionKey.value++;
			formData.chainId = id;
		};

		let codes = ref([]);
		if (attrs.shopDetail) {
			console.log({ ...attrs.shopDetail });
			let shopDetail = reactive(attrs.shopDetail);
			formData = shopDetail;
			if (attrs.shopDetail.region) {
				const { provinceCode, cityCode, districtCode, townCode } = attrs.shopDetail.region;
				codes.value = [provinceCode, cityCode, districtCode, townCode];
			}
		}

		return {
			formData,
			formRules,
			shopForm,
			submitForm,
			regionSelect,
			select,
			setChainId,
			saveShop,
			regionKey,
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
