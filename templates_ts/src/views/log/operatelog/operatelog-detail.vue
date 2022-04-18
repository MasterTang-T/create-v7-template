<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    title="日志详情"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    :footer="null"
  >
    <a-descriptions bordered :column="2" size="default">
      <a-descriptions-item label="服务名称">{{ form.appName }}</a-descriptions-item>
      <a-descriptions-item label="日志名称">{{ form.logName }}</a-descriptions-item>
      <a-descriptions-item label="日志内容" :span="2">{{ form.logContent }}</a-descriptions-item>
      <a-descriptions-item label="请求地址">{{ form.requestUrl }}</a-descriptions-item>
      <a-descriptions-item label="请求方式">{{ form.httpMethod }}</a-descriptions-item>
      <a-descriptions-item label="服务IP">{{ form.serverIp }}</a-descriptions-item>
      <a-descriptions-item label="客户端IP">{{ form.clientIp }}</a-descriptions-item>
      <a-descriptions-item label="用户名称">{{ form.realName }}</a-descriptions-item>
      <a-descriptions-item label="浏览器">{{ form.clientBrowser }}</a-descriptions-item>
      <a-descriptions-item label="操作系统">{{ form.clientOs }}</a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <a-collapse :active-key="['1', '2']">
      <a-collapse-panel key="1" header="请求参数">
        <p>{{ form.requestParams }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="响应参数">
        <p>{{ form.requestResult }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-modal>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue';

export default {
  name: 'OperateLogDetail',
  emits: ['update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 详情数据
    detail: Object
  },
  setup(props, context) {
    const data = reactive({
      form: {}
    });

    const watch = watchEffect(() => {
      if (props.detail) {
        data.form = Object.assign({}, props.detail);
      }
    });

    const updateVisible = value => {
      context.emit('update:visible', value);
    };

    return {
      ...toRefs(data),
      watch,
      updateVisible
    };
  }
};
</script>

<style scoped></style>
