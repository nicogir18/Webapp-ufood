import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./index.css";
import { loadFonts } from "./plugins/webfontloader";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mdi/font/css/materialdesignicons.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vuetify } from "./plugins/vuetifyInstance";
import store from "./store";
import vue3GoogleLogin from "vue3-google-login";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

let googleIdClient =
  "452801698870-ts86i9j88jiemvplosurb67kbuj8m9gb.apps.googleusercontent.com";

loadFonts();

const app = createApp(App);

app.component("VueDatePicker", VueDatePicker);

app
  .use(ElementPlus)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(ToastPlugin)
  .use(vue3GoogleLogin, {
    clientId: googleIdClient,
  })
  .mount("#app");
