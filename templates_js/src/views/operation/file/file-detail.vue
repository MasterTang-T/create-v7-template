<!-- 文件详情弹框 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :body-style="{ paddingBottom: '8px' }"
    title="文件详情"
    @update:visible="updateVisible"
    :footer="null"
  >
    <a-form
      ref="form"
      :model="form"
      layout="horizontal"
      :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
    >
      <a-form-item label="文件编码" name="fileCode">
        <a-input v-model:value="form.fileCode" disabled />
      </a-form-item>
      <a-form-item label="文件仓库" name="fileBucket">
        <a-input v-model:value="form.fileBucket" disabled />
      </a-form-item>
      <a-form-item label="文件名称" name="fileOriginName">
        <a-input v-model:value="form.fileOriginName" disabled />
      </a-form-item>
      <a-form-item label="是否为机密文件" name="secretFlag">
        <a-input v-model:value="form.secretFlag" disabled />
      </a-form-item>
      <a-form-item label="文件后缀" name="fileSuffix">
        <a-input v-model:value="form.fileSuffix" disabled />
      </a-form-item>
      <a-form-item label="文件大小" name="fileSizeInfo">
        <a-input v-model:value="form.fileSizeInfo" disabled />
      </a-form-item>
      <a-form-item label="唯一标识" name="fileObjectName">
        <a-input v-model:value="form.fileObjectName" disabled />
      </a-form-item>
      <a-form-item label="存储路径" name="filePath">
        <a-input v-model:value="form.filePath" disabled />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'FileDetail',
  emits: ['update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data)
    };
  },
  watch: {
    data() {
      this.form = Object.assign({}, this.data);
      this.isUpdate = true;
    }
  },
  methods: {
    /**
     * 更新弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/4/9 16:03
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
