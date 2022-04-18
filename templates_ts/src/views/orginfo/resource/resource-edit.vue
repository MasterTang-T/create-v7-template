<!-- 资源编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    cancel-text="关闭"
    footer=""
    :title="isUpdate ? '资源详情' : '新建资源'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 7 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 17 }, sm: { span: 24 } }"
    >
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="应用标识:" name="appCode">
            <a-input v-model:value="form.appCode"/>
          </a-form-item>
          <a-form-item label="资源名称:" name="resourceName">
            <a-input v-model:value="form.resourceName" />
          </a-form-item>
          <a-form-item label="控制器类名:" name="className">
            <a-input v-model:value="form.className" />
          </a-form-item>
          <a-form-item label="所属模块:" name="modularCode">
            <a-input v-model:value="form.modularCode" />
          </a-form-item>
          <a-form-item label="初始化地址:" name="ipAddress">
            <a-input v-model:value="form.ipAddress" />
          </a-form-item>
          <a-form-item label="请求路径:" name="url">
            <a-input v-model:value="form.url" />
          </a-form-item>
          <a-form-item label="请求方法:" name="httpMethod">
            <a-input v-model:value="form.httpMethod" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="资源标识:" name="resourceCode">
            <a-input v-model:value="form.resourceCode" />
          </a-form-item>
          <a-form-item label="项目编码:" name="projectCode">
            <a-input v-model:value="form.projectCode" />
          </a-form-item>
          <a-form-item label="方法名称:" name="methodName">
            <a-input v-model:value="form.methodName" />
          </a-form-item>
          <a-form-item label="模块名称:" name="modularName">
            <a-input v-model:value="form.modularName" />
          </a-form-item>
          <a-form-item label="是否视图">
            <a-switch checked-children="是" un-checked-children="否" :checked="form.viewFlag === 'Y' ? true : false" />
          </a-form-item>
          <a-form-item label="是否需登录">
            <a-switch checked-children="是" un-checked-children="否" :checked="form.requiredLoginFlag === 'Y' ? true : false" />
          </a-form-item>
           <a-form-item label="是否需权限验证">
            <a-switch checked-children="是" un-checked-children="否" :checked="form.requiredPermissionFlag === 'Y' ? true : false" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'ResourceEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {},
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author jiawei
     * @date 2021/4/15 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
