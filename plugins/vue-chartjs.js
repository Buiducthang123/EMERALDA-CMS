// plugins/vue-chartjs.js
import Vue from 'vue';
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';

Vue.component('BarChart', Bar);
Vue.component('LineChart', Line);
Vue.component('PieChart', Pie);
Vue.component('DoughnutChart', Doughnut);