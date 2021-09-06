<template>
	<div class="merchant-init page">
		<el-steps :active="active" finish-status="success">
			<el-step title="品牌"> </el-step>
			<el-step title="添加门店"></el-step>
			<el-step title="保证金和活动"></el-step>
			<el-step title="完成"></el-step>
		</el-steps>
		<div class="merchant-content">
			<AddBrand v-show="active === 0" @setChainInfo="setChainInfo" ref="addBrand">
				<template #submit>
					<el-button :loading="loading" v-btn="'max'" type="primary" style="margin-top: 12px" @click="next(1)">下一步</el-button>
				</template>
			</AddBrand>
			<AddShop v-show="active === 1" @saveSuccess="saveSuccess" ref="addShop">
				<template #submit>
					<el-button :loading="loading" v-btn="'max'" type="primary" style="margin-top: 12px" @click="next(2)">下一步</el-button>
				</template>
			</AddShop>
			<Activity v-if="active === 2 && chainInfo.id" @saveSuccess="saveSuccess" ref="addActivity" :chainInfo="chainInfo">
				<template #submit>
					<el-button :loading="loading" v-btn="'max'" type="primary" style="margin-top: 12px" @click="next(3)">下一步</el-button>
				</template>
			</Activity>
			<el-button v-show="active === 3" v-btn="'max'" type="primary" style="margin-top: 12px" @click="router.go(-1)">完成</el-button>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue';
import AddShop from './components/AddShop.vue';
import AddBrand from './components/AddBrand.vue';
import Activity from './components/Activity.vue';
import { useRouter } from 'vue-router';
export default {
	name: 'MerchantInit',
	components: {
		AddShop,
		AddBrand,
		Activity,
	},
	setup() {
		const router = useRouter();
		const active = ref(0);
		const addBrand = ref();
		const addShop = ref();
		const addActivity = ref();
		const chainInfo = ref({});
		let loading = ref();
		const next = (id) => {
			loading.value = true;
			if (id === 1) {
				addBrand.value.submitForm((flag) => {
					if (!flag) loading.value = false;
				});
				return;
			} else if (id === 2) {
				addShop.value.submitForm((flag) => {
					if (!flag) loading.value = false;
				});
				return;
			} else if (id === 3) {
				addActivity.value.submitForm((flag) => {
					if (!flag) loading.value = false;
				});
				return;
			}
			setTimeout(() => {
				loading.value = false;
			}, 2000);
			if (active.value++ > 3) router.go(-1);
		};

		const saveSuccess = () => {
			active.value++;
			loading.value = false;
		};

		const setChainInfo = (e) => {
			addShop.value.setChainId(e.id);
			chainInfo.value = e;
			active.value++;
			loading.value = false;
		};

		return {
			active,
			addBrand,
			addShop,
			addActivity,
			loading,
			chainInfo,
			next,
			setChainInfo,
			saveSuccess,
			router,
		};
	},
};
</script>
<style lang="less" scoped>
.merchant {
	&-init {
		margin-top: 20px;
		:deep(.el-select),
		:deep(.el-cascader) {
			display: block;
		}
	}
	&-content {
		margin-top: 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		> .add-shop {
			width: 1000px;
		}
	}
}
</style>
