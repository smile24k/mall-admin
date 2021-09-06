import { request } from '@/plugins/axios/index';
import apiMap from './apiMap';
/**
 * API统一管理
 * @param {Object} apiObj
 * @returns requestMap
 */
function injectRequest(apiObj) {
	const requestMap = {};
	Object.keys(apiObj).forEach((alias) => {
		let { method, url, config } = apiObj[alias];
		method = method.toUpperCase();
		requestMap[alias] = (dataOrParams = {}, instanceConf = {}) => {
			const keyName = ['PUT', 'POST', 'PATCH'].includes(method) ? 'data' : 'params';
			return request({
				method,
				url,
				[keyName]: dataOrParams,
				...Object.assign(config || {}, instanceConf),
			});
		};
	});
	return requestMap;
}

export default injectRequest(apiMap);
