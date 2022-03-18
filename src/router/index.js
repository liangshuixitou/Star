import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../components/Index.vue';
import Home from '../components/Home.vue';

import CVPaper from '../components/CV/CVPaperList.vue';
import CVClassify from '../components/CV/CVClassify.vue';

Vue.use(VueRouter);

// eslint-disable-next-line no-undef
const vueRouter = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      redirect: '/index',
      children: [
        { path: '/index', component: Index },
        { path: '/cv-papers', component: CVPaper },
        { path: '/cv-classify', component: CVClassify }]
    }
  ]
});

export default vueRouter;
