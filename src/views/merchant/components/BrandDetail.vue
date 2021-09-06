<template>
	<div class="brand-detail">
		<el-row :gutter="20">
			<el-col :span="8" :offset="0">
				<label> 品牌名称：</label><span>{{ chainInfo.brand }}</span>
			</el-col>
			<el-col :span="8" :offset="0">
				<label> 品牌地址：</label><span>{{ chainInfo.address }}</span></el-col
			>
			<el-col :span="8" :offset="0">
				<label> 主营类目：</label><span>{{ (chainInfo.category || {}).name }}</span></el-col
			>
			<el-col :span="8" :offset="0">
				<label> 门店数量：</label><span>{{ chainInfo.quantity || 1 }}家</span></el-col
			>
			<el-col :span="8" :offset="0">
				<label> 联系人：</label><span>{{ chainInfo.contact }}</span></el-col
			>
			<el-col :span="8" :offset="0">
				<label> 联系电话：</label><span>{{ chainInfo.contactPhone }}</span></el-col
			>
			<el-col :span="8" :offset="0">
				<label> 品牌简介：</label><span>{{ chainInfo.introduce }}</span></el-col
			>
			<el-col :span="8" :offset="0">
				<label> 其他信息：</label><span>{{ chainInfo.memo }}</span></el-col
			>
		</el-row>
		<slot name="edit"></slot>
	</div>
</template>
<script>
export default {
	setup(props, { attrs }) {
		const chainInfo = attrs.chainInfo;
		return {
			chainInfo,
		};
	},
};
</script>
<style lang="less" scoped>
.brand-detail {
	background-color: #fff;
	padding: 26px 12px;
	border-radius: 6px;
	min-height: 150px;
	box-shadow: @baseShadow;
	position: relative;
	.el-col {
		margin-bottom: 16px;
		label {
			color: #666;
			display: inline-block;
			width: 80px;
			text-align: right;
		}
	}
	:deep(.edit) {
		position: absolute;
		top: -4px;
		right: 24px;
	}
}
</style>
