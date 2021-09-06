module.exports = {
	extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		parser: 'babel-eslint',
	},
	plugins: ['vue'],
	rules: {
		indent: [2, 'tab'],
		trim_trailing_whitespace: true, //除去换行行首的任意空白字符
		'no-tabs': 0,
		'generator-star-spacing': 'off', // allow async-await
		'no-console': import.meta.env.NODE_ENV === 'production' ? 'error' : 'off', // allow debugger during development
		'no-debugger': import.meta.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-redeclare': 2, //禁止重复声明变量
	},
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				//这里写覆盖vue文件的规则
			},
		},
	],
};
