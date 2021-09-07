<template>
	<div class="add-shop">
		<el-form :model="formData" :rules="formRules" ref="shopForm" label-width="100px">
			<div class="form-item-title">基本信息</div>
			<el-form-item label="活动品牌">
				<span>{{ chainInfo.brand }}</span>
			</el-form-item>
			<el-form-item label="活动门店" prop="shopId">
				<el-select v-model="formData.shopId" value-key="id" placeholder="请选择活动门店">
					<el-option :label="item.name" :value="item.id" v-for="item in shopList" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动时间">
				<el-date-picker v-model="formData.startTime" type="datetime" placeholder="选择日期时间"> </el-date-picker> 至
				<el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择日期时间"> </el-date-picker>
			</el-form-item>
			<el-form-item label="活动说明">
				<el-input maxlength="200" type="textarea" v-model="formData.introduce"></el-input>
			</el-form-item>
			<div class="form-item-title">基本信息</div>
			<el-form-item label="返利订单数">
				<el-input-number v-model="formData.rule.rebateOrderNum" :min="1" :max="10"></el-input-number>
			</el-form-item>
			<el-form-item label="返利金额上限">
				<el-input v-model.number="formData.rule.rebateAmountUpper"></el-input>
			</el-form-item>
			<el-form-item label="保证金金额">
				<el-input v-model.number="formData.rule.bondAmount"></el-input>
			</el-form-item>
			<el-form-item label="手续费">
				<el-input disabled v-model="formData.rule.serviceCharge"></el-input>
			</el-form-item>

			<div class="form-item-title">付款信息</div>

			<el-row :gutter="20">
				<el-col :span="12" :offset="0">
					<el-form-item label="保证金入账">
						<el-radio-group v-model="formData.bondAmountPayment.isEntry">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="付款时间">
						<el-date-picker v-model="formData.bondAmountPayment.payTime" type="datetime" placeholder="选择日期时间"> </el-date-picker>
					</el-form-item>
					<el-form-item label="付款方式">
						<el-select v-model="formData.bondAmountPayment.payType" value-key="id" placeholder="请选择付款方式">
							<el-option :label="item.name" :value="item.type" v-for="item in payList" :key="item.type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="付款账户" prop="contact">
						<el-input maxlength="24" v-model.number="formData.bondAmountPayment.payUserAccount"></el-input>
					</el-form-item>
					<el-form-item label="付款人姓名">
						<el-input maxlength="5" v-model="formData.bondAmountPayment.payUserName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" :offset="0">
					<el-form-item label="手续费入账">
						<el-radio-group v-model="formData.serviceChargePayment.isEntry">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="付款时间">
						<el-date-picker v-model="formData.serviceChargePayment.payTime" type="datetime" placeholder="选择日期时间"> </el-date-picker>
					</el-form-item>
					<el-form-item label="付款方式">
						<el-select v-model="formData.serviceChargePayment.payType" value-key="id" placeholder="请选择付款方式">
							<el-option :label="item.name" :value="item.type" v-for="item in payList" :key="item.type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="付款账户" prop="contact">
						<el-input maxlength="24" v-model.number="formData.serviceChargePayment.payUserAccount"></el-input>
					</el-form-item>
					<el-form-item label="付款人姓名">
						<el-input maxlength="5" v-model="formData.serviceChargePayment.payUserName"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

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
	name: 'Activity',
	setup(props, { emit, attrs }) {
		let chainData = attrs.chainInfo || {};
		const chainInfo = reactive(chainData);

		const { proxy } = getCurrentInstance();
		const formData = reactive({
			shopId: '',
			startTime: new Date(),
			endTime: new Date(),
			rule: {
				bondAmount: '',
				rebateAmountUpper: '',
				rebateOrderNum: 1,
				serviceCharge: 2,
			},
			bondAmountPayment: {
				isEntry: 0,
				payTime: new Date(),
				payType: '',
				payUserAccount: '',
				payUserName: '',
			},
			serviceChargePayment: {
				isEntry: 0,
				payTime: new Date(),
				payType: '',
				payUserAccount: '',
				payUserName: '',
			},

			introduce: '', //简介
		});
		const formRules = reactive({
			shopId: [{ required: true, message: '请选择活动门店', trigger: 'change' }],
		});
		const shopForm = ref(null);
		const submitForm = (cb) => {
			shopForm.value.validate((valid) => {
				if (!valid) return proxy.$message.error('请输入必填项'), cb(false);
				saveActivity();
			});
		};

		const saveActivity = async () => {
			const [err, data = {}] = await to(api.saveActivity({ ...formData, chainId: chainInfo.id }));
			if (err) return (loading.value = false);
			if (!data.success) return reqFail.call(proxy, data);
			proxy.$message.success('活动添加成功');
			emit('saveSuccess');
		};
		onMounted(() => {
			getShop();
			getPayList();
		});
		const shopList = ref([]);
		const getShop = async () => {
			const [err, data = {}] = await to(api.getShop({ chainId: chainInfo.id }));
			if (err) return;
			if (!data.success) return reqFail.call(proxy, data);
			shopList.value = data.data;
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
			formRules,
			shopForm,
			submitForm,
			saveActivity,
			regionSelect,
			shopList,
			chainInfo,
			getShop,
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
