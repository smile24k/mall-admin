<template>
	<div :class="['table-box', className]">
		<div class="header-box">
			<slot name="headerSlot"></slot>
		</div>
		<!-- <el-table v-bind="$attrs" :data="data"> -->
		<el-table v-bind="$attrs" :data="data">
			<template v-for="(colConfig, index) in colConfigs" :key="index">
				<slot v-if="colConfig.slot" :name="colConfig.slot"></slot>
				<!-- <component v-else-if="colConfig.component" :is="colConfig.component" :colConfig="colConfig"></component> -->
				<el-table-column v-else v-bind="colConfig"></el-table-column>
			</template>
		</el-table>
	</div>
</template>

<script>
import { toRefs } from 'vue';
export default {
	setup(props, ctx) {
		const { colConfigs, data, className } = toRefs(ctx.attrs);
		return {
			colConfigs,
			data,
			className,
		};
	},
};
</script>
<style lang="less" scoped>
.table-box {
	margin-top: 20px;
	/deep/.el-table {
		border-radius: 6px;
	}
	.header-box {
		margin-bottom: 16px;
		display: flex;
	}
}
</style>
