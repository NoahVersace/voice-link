import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueMeta from "vue-meta";
import Home from "./views/Home.vue";
import Record from "./views/Record.vue";
import Listen from "./views/Listen.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  { path: "/record", component: Record },
  { path: "/listen/:id", component: Listen },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "./views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
