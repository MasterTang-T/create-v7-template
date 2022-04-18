<template>
  <a-spin />
</template>

<script>
import router from '@/router';
import { defineComponent } from 'vue';
import { SsoUtil } from '@/utils/sso';
import { message } from 'ant-design-vue';
import store from '@/store';

export default defineComponent({
  name: 'sso',
  setup() {
    // 获取到url上单点登录服务端返回的token
    const caToken = SsoUtil.getUrlParam('token');

    // 跳转到首页
    const goHome = () => {
      if (router.query && router.query.from) {
        router.push(String(router.query.from));
      } else {
        router.push('/').catch(() => {
        });
      }
    };

    // 将caToken转化为系统可以识别的token（通过全局会话创建局部会话）
    SsoUtil.tokenExchange(caToken).then(token => {
      message.success('登录成功');
      store
        .dispatch('user/setToken', {
          token: token,
          remember: true
        })
        .then(() => {
          goHome();
        });
    });
  }
});
</script>