import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../components/Index.vue';
import Home from '../components/Home.vue';

import CVPaper from '../components/CV/CVPaperList.vue';
import CVClassifier from '../components/CV/CVClassifier.vue';
import CVAttack from '../components/CV/CVAttack';
import CVAnalyse from '../components/CV/CVAnalyse';

import NLPAttack from '../components/NLP/NLPAttack';
import NLPPaperList from '../components/NLP/NLPPaperList';

import INExplain from '../components/Interpret/INExplain';
import INpaperList from '../components/Interpret/INpaperList';

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
        { path: '/cv-classifier', component: CVClassifier },
        { path: '/cv-attack', component: CVAttack },
        { path: '/cv-attack-result', component: CVAnalyse },
        { path: '/nlp-attack', component: NLPAttack },
        { path: '/nlp-papers', component: NLPPaperList },
        { path: '/in-explain', component: INExplain },
        { path: '/in-papers', component: INpaperList }]
    }
  ]
});

export default vueRouter;
