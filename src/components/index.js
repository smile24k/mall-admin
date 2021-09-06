import PageSearch from '@c/PageSearch.vue';
import MyTable from '@c/MyTable.vue';

export default {
	install(app) {
		app.component('PageSearch', PageSearch);
		app.component('MyTable', MyTable);
	},
};
