<template>
  <a-spin :spinning="loading">
    <a-row>
      <a-col :span="12" :offset="6">
        <div class="ele-body">
          <a-card :bordered="false">
            <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
              <a-form-item v-for="(item, index) in configList" :key="index">
                <template #label>
                  <a-tooltip>
                    <template #title>{{ item.configDescription }}</template>
                    {{ item.configName }}
                  </a-tooltip>
                </template>
                <a-input :name="item.configCode" v-model:value="form[item.configCode]" :placeholder="item.configDescription" />
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button @click="onReset" style="margin-left: 10px">重置</a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { SysConfigApi } from '@/api/SysConfigApi';
import { message } from 'ant-design-vue';
import router from '@/router';

export default defineComponent({
  name: 'InitPage',
  components: {},
  setup() {
    let data = reactive({
      // 页面加载中标识
      loading: true,
      // 表单数据
      form: {},
      // 系统初始化的系统配置列表
      configList: []
    });

    onMounted(async () => {
      // 判断系统是否已经初始化过
      let initConfigFlag = await SysConfigApi.getInitConfigFlag();

      // 如果已经初始化过，则跳转到首页
      if (initConfigFlag) {
        router.push('/');
        return;
      }

      // 关闭加载中
      data.loading = false;

      // 获取需要初始化的系统配置
      data.configList = await SysConfigApi.getInitConfigList();
      for (const item of data.configList) {
        data.form[item.configCode] = item.configValue;
      }
    });

    // 提交初始化配置
    const onSubmit = async () => {
      let params = { sysConfigs: data.form };
      let result = await SysConfigApi.initConfig(params);
      message.success(result.message);

      // 跳转到首页
      router.push('/');
    };

    // 重置数据
    const onReset = async () => {
      // 加载中标识
      data.loading = true;

      // 获取需要初始化的系统配置
      data.configList = await SysConfigApi.getInitConfigList();

      // 加载中标识关闭
      data.loading = false;

      for (const item of data.configList) {
        data.form[item.configCode] = item.configValue;
      }
    };

    return {
      ...toRefs(data),
      onSubmit,
      onReset
    };
  }
});
</script>
