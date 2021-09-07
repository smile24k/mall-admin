import '@/style/base.less';
import router from '@/router';
import component from '@/components/index';
import elementPlus from '@/plugins/element-plus/index';
import { ElMessage } from 'element-plus';

import directive from '@util/directive';
import App from '@/App.vue';
import { createApp } from 'vue';
const app = createApp(App);
directive(app);
app.config.devtools = true;
app.config.globalProperties.$message = ElMessage;
app.use(component).use(router).use(elementPlus).mount('#app');
