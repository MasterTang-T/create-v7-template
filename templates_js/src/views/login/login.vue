<template>
  <div :class="['login-wrapper', ['', 'login-form-right', 'login-form-left'][direction]]">
    <a-form ref="loginForm" :model="form" :rules="rules" layout="vertical" class="login-form ele-bg-white">
      <h4>用户登录</h4>
      <a-form-item label="租户选择：" name="tenantCode" v-if="saasFlag">
        <a-select placeholder="请选择租户" v-model:value="form.tenantCode">
          <a-select-option v-for="item in saasList" :key="item.tenantCode" :value="item.tenantCode">
            {{ item.companyName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="username">
        <a-input placeholder="默认账号：admin" v-model:value="form.account" allow-clear size="large">
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password placeholder="默认密码：123456" v-model:value="form.password" size="large">
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="form.remember">记住密码</a-checkbox>
        <router-link to="/forget" class="ele-pull-right" style="line-height: 22px;">忘记密码</router-link>
      </a-form-item>
      <a-form-item>
        <a-button block size="large" type="primary" :loading="loading" @click="imageVerify ? showModal() : doSubmit()">
          {{ loading ? '登录中' : '登录' }}
        </a-button>
      </a-form-item>
      <div class="ele-text-center" style="padding-bottom: 32px;">
        <qq-outlined class="login-oauth-icon" style="background: #3492ed;" />
        <wechat-outlined class="login-oauth-icon" style="background: #4daf29;" />
        <weibo-outlined class="login-oauth-icon" style="background: #CF1900;" />
      </div>
    </a-form>
    <a-modal
      :width="480"
      :visible="visible"
      :title="'登录验证'"
      :body-style="{ paddingBottom: '8px' }"
      :footer="null"
      @cancel="cancel"
      centered
    >
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center ">
        <div style="width: 300px; user-select: none;">
          <div :style="'position:relative;background-color:#ddd;height:150px;background-image:url(' + srcImage + ')'">
            <div
              :style="
                'position: absolute;top:' +
                  locationY +
                  'px;width:50px;height:50px;background-image:url(' +
                  cutImage +
                  ');left: ' +
                  currX +
                  'px'
              "
            ></div>
          </div>
        </div>
        <div class="reload-container">
          <a-button class="reload-wrapper" @click="reLoad">
            <redo-outlined />
            <span class="reload-tips">刷新验证</span>
          </a-button>
        </div>
        <div class="slider-wrapper" @mousemove="onMoving" @mouseleave="onMoveEnd">
          <div class="slider-bar">按住滑块，拖动完成拼图</div>
          <div class="slider-button" @mousedown="onMoveStart" @mouseup="onMoveEnd" :style="'left:' + currX + 'px'"></div>
        </div>
      </div>
    </a-modal>
    <div class="login-copyright">copyright © 2021 stylefeng.cn all rights reserved.</div>
  </div>
</template>

<script>
import router from '@/router';
import store from '@/store';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

import { LockOutlined, QqOutlined, RedoOutlined, UserOutlined, WechatOutlined, WeiboOutlined } from '@ant-design/icons-vue';

import { LoginApi } from '@/api/LoginApi';
import setting from '@/config/setting';
import { SsoUtil } from '@/utils/sso';
import { SysTenantApi } from '@/api/SysTenantApi';

export default defineComponent({
  name: 'login',
  components: {
    UserOutlined,
    LockOutlined,
    QqOutlined,
    WechatOutlined,
    WeiboOutlined,
    RedoOutlined
  },
  //图片验证码的变量
  data() {
    return {
      visible: false,
      srcImage: '',
      cutImage: '',
      locationY: 0,
      isMovable: false,
      startX: 0,
      oldX: 0,
      currX: 0,
      status: 1,
      uuid: ''
    };
  },
  setup() {
    // saas开关和租户列表
    const saasFlag = ref(setting.saasFlag);
    const saasList = ref([]);
    const imageVerify = setting.imageVerify;

    const direction = ref(0);
    let loading = ref(false);
    const form = reactive({
      account: '',
      password: '',
      remember: true,
      tenantCode: 'master'
    });

    // 如果开启了saas，则获取saas的列表
    onMounted(async () => {
      if (saasFlag.value) {
        saasList.value = await SysTenantApi.dropDownList();
      }
    });

    // 表单验证规则
    const rules = {
      account: [{ required: true, message: '请输入账号', type: 'string', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', type: 'string', trigger: 'blur' }]
    };
    //原登录逻辑，保留
    const doSubmit = async () => {
      loading.value = true;
      const data = await LoginApi.login(form).catch(() => {
        loading.value = false;
      });
      if (data?.success) {
        // 如果没开启单点登录，则直接将token
        if (!setting.ssoFlag) {
          // 清除回车事件
          document.onkeydown = null;
          message.success('登录成功');
          store
            .dispatch('user/setToken', {
              token: data.data.token,
              remember: form.remember
            })
            .then(() => {
              goHome();
            });
        }
        // 如果开启了单点登录，则根据loginCode跳转到单点服务器
        else {
          SsoUtil.activateByLoginCode(data.data.ssoLoginCode);
        }
      }
    };

    /* 跳转到首页 */
    const goHome = () => {
      if (router.query && router.query.from) {
        router.push(String(router.query.from));
      } else {
        router.push('/').catch(() => {});
      }
    };

    return {
      saasFlag,
      saasList,
      direction,
      loading,
      form,
      rules,
      doSubmit,
      goHome,
      imageVerify
    };
  },
  mounted() {
    document.onkeydown = () => {
      let _key = window.event.keyCode;
      //!this.clickState是防止用户重复点击回车
      if (_key === 13) {
        this.doSubmit();
      }
    };
  },
  methods: {
    /**
     * 关闭弹窗
     */
    cancel() {
      this.visible = false;
    },
    /**
     * 重新加载图片
     */
    async reLoad() {
      const temp = await LoginApi.getVerifyInfo();
      this.cutImage = temp.data.cutImage;
      this.srcImage = temp.data.srcImage;
      this.locationY = temp.data.locationY;
      this.uuid = temp.data.key;
      this.isMovable = false;
      this.startX = 0;
      this.oldX = 0;
      this.currX = 0;
      this.status = 1;
    },
    /**
     * 显示图片验证码弹窗
     */
    async showModal() {
      const temp = await LoginApi.getVerifyInfo();
      this.visible = true;
      this.cutImage = temp.data.cutImage;
      this.srcImage = temp.data.srcImage;
      this.locationY = temp.data.locationY;
      this.uuid = temp.data.key;
    },
    /**
     * 鼠标移动
     */

    onMoving(e) {
      if (this.status !== 1 || !this.isMovable) {
        return;
      }
      const distance = e.clientX - this.startX;
      let tempX = this.oldX + distance;

      const minX = 0;
      const maxX = 250;
      tempX = tempX < minX ? 0 : tempX > maxX ? maxX : tempX;

      this.currX = tempX;
    },

    /**
     * 鼠标开始滑动
     */
    onMoveStart(e) {
      if (this.status !== 1) {
        return;
      }
      // 记录滑动开始时的绝对坐标x
      this.isMovable = true;
      this.startX = e.clientX;
    },
    /**
     * 鼠标滑动结束
     */
    onMoveEnd() {
      if (this.status !== 1 || !this.isMovable) {
        return;
      }
      // 将旧的固定坐标x更新
      this.isMovable = false;
      this.oldX = pre => pre.currX;
      const pushInfo = this.form;
      pushInfo.verKey = this.uuid;
      pushInfo.verCode = this.currX;

      //doSubmit中的登录失败判断无效（已在request中拦截，故绕过request）
      fetch(process.env.VUE_APP_API_BASE_URL + '/loginApi', {
        method: 'POST',
        body: JSON.stringify(pushInfo),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            // 如果没开启单点登录，则直接将token
            if (!setting.ssoFlag) {
              // 清除回车事件
              document.onkeydown = null;
              message.success('登录成功');
              store
                .dispatch('user/setToken', {
                  token: res.data.token,
                  remember: this.form.remember
                })
                .then(() => {
                  this.cancel();
                  this.goHome();
                });
            }
            // 如果开启了单点登录，则根据loginCode跳转到单点服务器
            else {
              SsoUtil.activateByLoginCode(res.data.ssoLoginCode);
            }
          } else {
            message.error(res.message);
            this.reLoad();
          }
        });
    }
  }
});
</script>

<style scoped>
/* 背景 */
.login-wrapper {
  padding: 48px 16px 0 16px;
  position: relative;
  box-sizing: border-box;
  background-image: url('~@/assets/bg-login.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}

.login-wrapper:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
}

/* 卡片 */
.login-form {
  width: 360px;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 28px;
  box-sizing: border-box;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  position: relative;
  z-index: 2;
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

.login-form h4 {
  padding: 22px 0;
  text-align: center;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;
}

/*.login-input-group :deep(.ant-input-affix-wrapper) {
    flex: 1;
  }*/

.login-input-group .login-captcha {
  width: 102px;
  height: 40px;
  margin-left: 10px;
  padding: 0;
}

.login-input-group .login-captcha > img {
  width: 100%;
  height: 100%;
}

/* 第三方登录图标 */
.login-oauth-icon {
  color: #fff;
  padding: 5px;
  margin: 0 12px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  text-align: center;
  padding: 48px 0 22px 0;
  position: relative;
  z-index: 1;
}

.reload-container {
  margin: 20px 0;
}

.reload-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.reload-tips {
  font-size: 14px;
  color: #666;
}

.slider-wrapper {
  position: relative;
  margin: 10px 0;
  width: 300px;
}

.slider-bar {
  padding: 10px;
  font-size: 14px;
  text-align: center;
  color: #999;
  background-color: #ddd;
  overflow: hidden;
}

.slider-button {
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  transform: translateY(-50%);
  cursor: pointer;
  background: #fff center/80% 80% no-repeat;
  box-shadow: 0 2px 10px 0 #333;
}

/* 响应式 */
@media screen and (min-height: 640px) {
  .login-wrapper {
    padding-top: 0;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -230px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -230px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

@media screen and (max-width: 768px) {
  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    margin-left: 0;
    margin-right: auto;
    transform: translateX(-50%);
  }
}
</style>
