/**
 * @param {axios} axios实例
 * @param {config} 自定义配置对象，可覆盖掉默认的自定义配置
 */
import constant from '@util/constant';
import { getToken } from '@util/common';
export default (axios, config = {}) => {
	const defaultConfig = {
		baseURL: import.meta.env.VITE_APP_URL,
		timeout: 60000,
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'custom-defined-header-key': 'custom-defined-header-value',
			// 自定义请求头：对所有请求方法生效
			common: {
				'common-defined-key-b': 'custom value: for all methods',
			},
			// 自定义请求头：只对post方法生效
			post: {
				'post-custom-key': 'custom value: only for post method',
			},
			// 自定义请求头：只对get方法生效
			get: {
				'get-custom-key': 'custom value: only for get method',
			},
			authorization: getToken(),
			device_id: constant.deviceId,
			product: constant.product,
		},
		withCredentials: false,
	};

	Object.assign(axios.defaults, defaultConfig, config);
	return axios;
};
