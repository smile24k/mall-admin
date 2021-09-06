import { createRouter, createWebHistory } from 'vue-router';
import { getToken, getLoginRes } from '@util/common';

const Index = import('@view/Index.vue');
const About = import('@view/About.vue');
const Block = import('@view/Block.vue');
const Login = import('@view/Login.vue');

const Merchant = import('@view/merchant/Index.vue');
const MerchantInit = import('@view/merchant/MerchantInit.vue');
const MerchantDetail = import('@view/merchant/MerchantDetail.vue');
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/home',
			name: 'Index',
			component: () => Index,
			meta: {
				auth: '/home',
			},
		},
		{
			path: '/merchant',
			name: 'Merchant',
			component: () => Merchant,
			meta: {
				auth: '/merchant',
			},
			children: [],
		},
		{
			path: '/merchant/init',
			name: 'MerchantInit',
			component: () => MerchantInit,
			meta: {
				auth: '/merchant',
			},
		},
		{
			path: '/merchant/detail',
			name: 'MerchantDetail',
			component: () => MerchantDetail,
			meta: {
				auth: '/merchant',
			},
		},
		{
			path: '/login',
			name: 'Login',
			component: () => Login,
			meta: {
				fullScreen: true,
			},
		},
		{
			path: '/about',
			name: 'About',
			component: () => About,
			meta: {
				fullScreen: true,
			},
		},
		{
			path: '/block',
			name: 'Block',
			component: () => Block,
			meta: {
				fullScreen: true,
			},
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: '/home',
		},
	],
});

router.beforeEach((to, from, next) => {
	let loginRes = getLoginRes();
	let doLogin = to.name == 'Login' || from.name == 'Login';
	if (!doLogin && !loginRes) {
		next('/login');
		return;
	}
	// if (to.meta.keepAlive) {
	// 	store.commit('keepAlive', to.name);
	// }
	next();
});

export default router;
