import Vue from 'vue';
import VueRouter from 'vue-router';
import EstateForSell from '../pages/estate-manage/EstateForSell.vue';
import LocForSearch from '../pages/loc-manage/LocForSearch.vue';
Vue.use(VueRouter);

const routes = [
	{
		path: '/estate-buy',
		component: EstateForSell,
	},
	{
		path: '/loc-manage',
		component: LocForSearch,
	},
];

const router = new VueRouter({
    routes,
});

export default router;