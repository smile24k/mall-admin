<template>
	<div class="login">
		<div class="login-form-box">
			<el-form ref="loginForm" :label-position="labelPosition" label-width="80px" :model="formData" :rules="rules">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="formData.username" placeholder="手机号/账号" maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="formData.password" placeholder="密码" maxlength="12" type="password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="medium" round style="width: 100%" @click="submitForm" :disabled="loading">登 录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import api from '@/api/index';
import to from 'await-to-js';
import { reqFail } from '@util/common';
import { useRouter } from 'vue-router';
export default {
	name: 'Login',
	setup() {
		const { proxy } = getCurrentInstance();
		const router = useRouter();
		const loginForm = ref(null);
		const labelPosition = ref('top');
		let loading = ref();

		onMounted(() => {
			localStorage.removeItem('token');
			localStorage.removeItem('loginRes');
		});

		const formData = reactive({
			username: '',
			password: '',
		});
		const rules = {
			username: [
				{ required: true, message: '请输入用户名', trigger: 'blur' },
				{ min: 5, max: 50, message: '用户名长度在 5 到 20 个字符', trigger: 'blur' },
			],
			password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
		};

		const submitForm = () => {
			loginForm.value.validate((valid) => {
				if (!valid) return proxy.$message.error('请输入账号/密码错误');
				login();
			});
		};

		const login = async () => {
			if (loading.value) return;
			loading.value = true;
			const [err, data = {}] = await to(api.login(formData));

			if (err) return (loading.value = false);
			if (!data.success) {
				reqFail.call(proxy, data);
				loading.value = false;
				return;
			}
			if (data.result) {
				localStorage.setItem('token', data.result.token);
				localStorage.setItem('loginRes', JSON.stringify(data.result));
				proxy.$message.success('登录成功');
				setTimeout(() => {
					location.href = '/';
				}, 1500);
			}
		};

		return {
			labelPosition,
			formData,
			rules,
			loginForm,
			loading,
			submitForm,
		};
	},
};
</script>
<style lang="less" scoped>
.login {
	width: 100%;
	height: 100%;
	background-image: url('@{staticHost}/food/login_bg_1920.jpeg');
	// background-image: url('https://cdn.pixabay.com/photo/2017/09/25/17/38/chart-2785979_1280.jpg');
	background-size: cover;
	background-repeat: no-repeat;
	position: relative;
	&-form-box {
		height: 400px;
		width: 480px;
		background: #fff;
		padding: 54px;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		transform: translateY(50%);
		position: absolute;
		right: 50px;
	}
}
</style>
