import { createApp } from 'vue';
import App from './App.vue';
import services from './services';

const app = createApp(App);
app.config.globalProperties.$services = services;

app.mount('#app');
