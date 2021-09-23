/**
 * 请求失败处理
 * @param {Object} res
 */
function reqFail(res) {
	if (res.msg) this.$message.warning(res.msg);
	checkAuth.call(this, res.status);
}

/**
 * 权限验证
 * @param {Number} code
 */
function checkAuth(code) {
	if (code === 403 && location.pathname !== '/login') {
		localStorage.removeItem('loginRes');
		localStorage.removeItem('token');
		// location.href = '/';
	}
}

function getToken() {
	return localStorage.getItem('token');
}

function getLoginRes() {
	const res = localStorage.getItem('loginRes');
	return res ? JSON.parse(res) : {};
}
function compare(property) {
	return function (obj1, obj2) {
		var value1 = obj1[property];
		var value2 = obj2[property];
		return value1 - value2; // 升序
	};
}

function initPageData(size = 10, page = 1) {
	return {
		page,
		size,
	};
}

function regionToText(region = {}) {
	if (!region.townName) return '';
	const { provinceName, cityName = '', districtName = '', townName = '' } = region;
	return `${provinceName}/${cityName}/${districtName}/${townName}`;
}

function formatDate(date, format) {
	if (!format) {
		if (!date) return date;
		return new Date(date).toLocaleString();
	}
	date = new Date(date);
	var o = {
		'M+': date.getMonth() + 1, //month
		'd+': date.getDate(), //day
		'h+': date.getHours(), //hour
		'H+': date.getHours(), //hour
		'm+': date.getMinutes(), //minute
		's+': date.getSeconds(), //second
		'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
		S: date.getMilliseconds(), //millisecond
	};

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
		}
	}
	return format;
}
export { reqFail, getToken, getLoginRes, compare, initPageData, regionToText, formatDate };
