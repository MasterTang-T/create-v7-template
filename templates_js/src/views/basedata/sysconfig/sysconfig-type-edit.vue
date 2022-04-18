<!-- 配置类型弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    title="新增配置类型"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 7 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 17 }, sm: { span: 24 } }"
    >
      <a-form-item label="类型名称:" name="dictName">
        <a-input v-model:value="form.dictName" placeholder="请输入类型名称" allow-clear />
      </a-form-item>
      <a-form-item label="类型编码:" name="dictCode">
        <a-input v-model:value="form.dictCode" placeholder="请输入类型编码" allow-clear />
      </a-form-item>
      <a-form-item label="排序号:" name="dictSort">
        <a-input-number v-model:value="form.dictSort" placeholder="请输入排序号" :min="0" class="ele-fluid" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { SysConfigApi } from '@/api/SysConfigApi';

export default {
  name: 'SysConfigTypeEdit',
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
      rules: {
        dictName: [{ required: true, message: '请输入类型名称', type: 'string', trigger: 'blur' }],
        dictCode: [{ required: true, message: '请输入类型编码', type: 'string', trigger: 'blur' }],
        dictSort: [{ required: true, message: '请输入排序号', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false
    };
  },
  watch: {
    visible() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.form = Object.assign({}, this.data);
    }
  },
  methods: {
    /**
     * 保存或编辑
     *
     * @author fengshuonan
     * @date 2021/4/9 13:42
     */
    async save() {
      await this.$refs.form.validate();

      // 执行新增
      let result = SysConfigApi.addConfigType(this.form);
      result.then(result => {
        // 提示添加成功
        this.$message.success(result.message);

        // 如果是新增，则form表单置空
        this.form = {};

        // 关闭弹框，通过控制visible的值，传递给父组件
        this.updateVisible(false);

        // 触发父组件done事件
        this.$emit('done');
      });
    },

    /**
     * 更新弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/4/9 13:42
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
