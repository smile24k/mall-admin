<template>
	<div class="search">
		<el-form :inline="true" :model="searchData" class="search-form-inline">
			<el-row>
				<el-col v-show="index < 3 || (index >= 3 && expandFlag)" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in searchListSort" :key="index">
					<el-form-item v-if="item.type == 'input'" :label="item.label + '：'">
						<el-input clearable v-model="searchData[item.val]" :placeholder="item.placeholder || item.label"> </el-input>
					</el-form-item>
					<el-form-item v-else-if="item.type == 'select'" :label="item.label + '：'">
						<el-select :value-key="item.valueKey" :filterable="item.filterable" :multiple="item.multiple" collapse-tags v-model="searchData[item.val]" :placeholder="item.placeholder || item.label">
							<el-option :label="obj.elLabel" :value="item.valueKey ? obj : obj.elValue" v-for="(obj, j) in item.options" :key="j"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item v-else-if="item.type == 'slot'" :label="item.label ? item.label + '：' : ''">
						<slot name="searchItem"></slot>
					</el-form-item>
				</el-col>
				<el-col class="col-btn" :class="colClass" id="col-btn-id" :sm="12" :md="12" :lg="8" :xl="6">
					<el-form-item class="last" :label="' '">
						<slot name="slotBtn"></slot>
						<!-- <el-button size="small" v-if="isReset" @click="ResetData" v-no-more-click round class="w80 w88"> 重置 </el-button>
						<el-button size="small" v-if="isReport" @click="exportData" v-no-more-click round class="w80 w88"> 导出 </el-button> -->
						<el-button round class="w80 w88" :loading="loading" type="primary" @click="searchSubmit"> 查询 </el-button>
						<span v-if="searchListSort.length > 3"
							>&nbsp;&nbsp;
							<span v-if="!expandFlag" class="expand" @click="expandFun">展开 <i class="icon-arrow-down-16"></i></span>
							<span v-else class="expand down" @click="expandFun">收起 <i class="icon-arrow-down-16"></i></span>
						</span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script>
import { toRefs, computed, ref } from 'vue';
import { compare } from '@util/common';
export default {
	name: 'PageSearch',
	setup(props, ctx) {
		const { searchData, searchList } = toRefs(ctx.attrs);
		const expandFlag = ref(false);
		const expandFun = () => (expandFlag.value = !expandFlag.value);
		const searchSubmit = () => {};

		const searchListSort = computed(() => {
			return searchList.value.sort(compare('sort'));
		});
		return {
			expandFlag,
			expandFun,
			searchData,
			searchSubmit,
			searchListSort,
		};
	},
};
</script>
<style lang="less" scoped>
.search {
	background-color: @white;
	padding: 20px 12px;
	border-radius: 8px;
	.el-form--inline .el-form-item {
		display: flex;
		margin-bottom: 0;
	}
	.el-select,
	/deep/.el-cascader {
		display: block;
	}
	/deep/.el-form-item__content {
		display: inline-block;
		max-width: 300px;
		flex: 1;
	}
}
</style>
