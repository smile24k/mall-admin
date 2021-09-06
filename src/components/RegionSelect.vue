<template>
	<div>
		<el-cascader placeholder="请选择行政区域" v-model="value" :props="areaProps" @change="handleChange" ref="cascaderRef"></el-cascader>
	</div>
</template>
<script>
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail } from '@util/common';
import { reactive, getCurrentInstance, ref } from 'vue';
export default {
	name: 'RegionSelect',
	setup(props, { emit, attrs }) {
		const { proxy } = getCurrentInstance();
		const codes = ref([]); //区域查询code
		let value = ref([]);
		if (attrs.codes) value = attrs.codes;
		const handleChange = (value) => {
			codes.value = value;
			const textList = cascaderRef.value.inputValue.split(' / ');
			const obj = {
				provinceCode: value[0],
				provinceName: textList[0],
				cityCode: value[1],
				cityName: textList[1],
				districtCode: value[2],
				districtName: textList[2],
				townCode: value[3],
				townName: textList[3],
			};
			emit('regionSelect', obj);
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
			if (data.status !== 200) return reqFail.call(proxy, data);
			cb && typeof cb === 'function' && cb(data.data);
		};
		const cascaderRef = ref();
		return {
			areaProps,
			codes,
			value,
			getArea,
			handleChange,
			cascaderRef,
		};
	},
};
</script>
