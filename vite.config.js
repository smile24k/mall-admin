import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import analyze from 'rollup-plugin-analyzer';
import styleImport from 'vite-plugin-style-import';
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	return {
		build: {
			outDir: process.env.VITE_OUTPUT_DIR,
			rollupOptions: {
				plugins: [
					/* analyze() */
				],
			},
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'@api': resolve(__dirname, 'src/api'),
				'@c': resolve(__dirname, 'src/components'),
				'@util': resolve(__dirname, 'src/util'),
				'@view': resolve(__dirname, 'src/views'),
			},
		},
		plugins: [
			vue(),
			styleImport({
				libs: [
					{
						libraryName: 'element-plus',
						esModule: true,
						ensureStyleFile: true,
						resolveStyle: (name) => {
							return `element-plus/lib/theme-chalk/${name}.css`;
						},
						resolveComponent: (name) => {
							return `element-plus/lib/${name}`;
						},
					},
				],
			}),
		],
		css: {
			preprocessorOptions: {
				less: {
					modifyVars: {
						//less  全局变量配置
						hack: `true; @import (reference) "${resolve(__dirname, './src/style/variables.less')}";`,
					},
					javascriptEnabled: true,
				},
			},
		},
		// base: './',
		optimizeDeps: {
			include: ['lodash', 'dayjs', 'vue3-lazyload'],
		},
	};
});
