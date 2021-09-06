<template>
	<div class="geo-map" :style="{ width, height }">
		<div id="container"></div>
		<div id="tip">
			<input type="text" id="keyword" name="keyword" placeholder="请输入关键字：(选定后搜索)" value="" onfocus='this.value=""' />
		</div>
	</div>
</template>
<script>
import { onMounted } from 'vue';
export default {
	name: 'GeoMap',
	props: {
		width: {
			type: String,
			default: '100%',
		},
		height: {
			type: String,
			default: '400px',
		},
	},
	setup(props, { emit }) {
		onMounted(() => {
			const map = new AMap.Map('container', {
				resizeEnable: true,
			});
			const autoOptions = {
				input: 'keyword', //使用联想输入的input的id
			};
			const auto = new AMap.Autocomplete(autoOptions);
			const placeSearch = new AMap.PlaceSearch({
				map: map,
			}); //构造地点查询类
			AMap.event.addListener(auto, 'select', select); //注册监听，当选中某条记录时会触发
			function select(e) {
				placeSearch.setCity(e.poi.adcode);
				placeSearch.search(e.poi.name); //关键字查询查询
				emit('select', e);
			}
		});
	},
};
</script>
<style lang="less" scoped>
#container {
	height: 100%;
	width: 100%;
}
#tip {
	background-color: #ddf;
	color: #333;
	border: 1px solid silver;
	box-shadow: 3px 4px 3px 0px silver;
	position: absolute;
	top: 10px;
	right: 10px;
	border-radius: 5px;
	overflow: hidden;
	line-height: 20px;
	input[type='text'] {
		height: 40px;
		width: 400px;
		border: 0;
		padding-left: 5px;
		border-radius: 3px;
		outline: none;
		padding-left: 12px;
		font-size: 14px;
		color: #333;
	}
}
</style>
