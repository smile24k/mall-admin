<template>
	<div>
		<el-page-header icon="el-icon-arrow-left" @back="goBack" content="详情页面" title="返回"></el-page-header>
	</div>
</template>
<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
	setup() {
		const router = useRouter();
		const goBack = () => {
			router.back(-1);
		};
		return {
			goBack,
		};
	},
});
</script>
