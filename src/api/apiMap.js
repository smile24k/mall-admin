const apiMap = {
	login: { method: 'post', url: '/login' },
	logout: { method: 'post', url: '/logout' },
	getMenu: { method: 'get', url: '/menus' },
	goods: { method: 'get', url: '/goods' },
	saveGoods: { method: 'post', url: '/goods/save' },
	getGoodsById: { method: 'get' },
	updateGoods: { method: 'post', url: '/goods/update' },
	getImgs: { method: 'get', url: '/openapi/imgs' },

	getArea: { method: 'get', url: '/district' },
	getMerchant: { method: 'get', url: '/merchant' },
	saveChain: { method: 'post', url: '/chain' },
	getChain: { method: 'get', url: '/chain' },
	getChainInfo: { method: 'get', url: '/chain/info' },
	saveShop: { method: 'post', url: '/shop' },
	getShop: { method: 'get', url: '/shop' },
	getShopInfo: { method: 'get', url: '/shop/info' },
	getCategory: { method: 'get', url: '/business/category' },
	getPayList: { method: 'get', url: '/activity/pay' },
	saveActivity: { method: 'post', url: '/activity' },
	getActivityList: { method: 'get', url: '/activity' },
};

export default apiMap;
