<template>
	<div class="index">
		<Home />
	</div>
</template>
<script>
import Menu from '@c/Menu.vue';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail } from '@util/common';
import { useRouter } from 'vue-router';
import Home from './Home.vue';
export default {
	name: 'Index',
	components: { Menu, Home },
	setup() {},
};
</script>

<style lang="less" scoped>
.index {
	height: 100%;
	// background: url('@{staticHost}/food/index_bg_640.png') center center no-repeat;
	// background: url('https://cdn.pixabay.com/photo/2016/06/13/09/57/meeting-1453895_640.png') center center no-repeat;
}
</style>
