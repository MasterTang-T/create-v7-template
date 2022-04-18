/** 主入口js */
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import { createPinia } from 'pinia'
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './config/axios-config';
import permission from './utils/permission';
import './styles/index.less';
import EleAdminPro from 'ele-admin-pro';
import ModalUtil from 'ele-admin-pro/packages/modal-util';
import i18n from './lang';
import * as antIcons from '@ant-design/icons-vue';
const app: any = createApp(App);
app.config.productionTip = false;
app.use(store);
app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.use(permission);
app.use(EleAdminPro, {
  request: {
    pageName: 'pageNo', // 页码的参数名称
    limitName: 'pageSize', // 每页数据量的参数名
    sortName: 'sort', // 排序字段参数名称
    orderName: 'order' // 排序方式的参数名称
  },
  response: {
    statusName: 'code', // 数据状态的字段名称，支持嵌套写法(xxx.xxx)/sys/role
    statusCode: '00000', // 成功的状态码，例如改成200
    msgName: 'message', // 信息的字段名称，支持嵌套
    dataName: 'data.rows', // 数据列表的字段名称，支持嵌套，例如：result.list
    countName: 'data.totalRows' // 数据总数的字段名称，支持嵌套
  }
});
app.use(ModalUtil);
app.use(i18n);
app.mount('#app');


// 注册图标组件到全局
// const objKeys = Object.keys(antIcons)
// objKeys.forEach(key => {
//   app.component(key, antIcons[key]);
// });
for (const key in antIcons) {
  app.component(key, antIcons[key as keyof typeof antIcons]);
}
app.config.globalProperties.$antIcons = antIcons;
