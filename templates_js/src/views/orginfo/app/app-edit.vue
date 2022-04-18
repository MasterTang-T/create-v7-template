<!-- 应用编辑弹窗 -->
<template>
  <a-modal
    :width='460'
    :visible='visible'
    :confirm-loading='loading'
    :title="isUpdate ? '修改应用' : '新建应用'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible='updateVisible'
    @ok='save'
  >
    <a-form
      ref='form'
      :model='form'
      :rules='rules'
      :label-col='{ md: { span: 7 }, sm: { span: 24 } }'
      :wrapper-col='{ md: { span: 17 }, sm: { span: 24 } }'
    >
      <a-form-item label='应用名称:' name='appName'>
        <a-input v-model:value='form.appName' placeholder='请输入应用名称' allow-clear />
      </a-form-item>
      <a-form-item label='应用编码:' name='appCode'>
        <a-input v-model:value='form.appCode' placeholder='请输入应用编码' allow-clear :disabled='isUpdate' />
      </a-form-item>
      <a-form-item label='应用图标:' name='appIcon'>
        <ele-icon-picker v-model:value="form.appIcon" placeholder="请选择应用图标" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import EleIconPicker from 'ele-admin-pro/packages/ele-icon-picker';
import { SysAppApi } from '@/api/SysAppApi';

export default {
  name: 'SysAppEdit',
  components:{
    EleIconPicker
  },
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
        appName: [{ required: true, message: '请输入应用名称', type: 'string', trigger: 'blur' }],
        appCode: [{ required: true, message: '请输入应用编码', type: 'string', trigger: 'blur' }]
      },
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
     * 保存和编辑
     *
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = SysAppApi.edit(this.form);
      } else {
        result = SysAppApi.add(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          this.$message.success(result.message);

          // 如果是新增，则form表单置空
          if (!this.isUpdate) {
            this.form = {};
          }

          // 关闭弹框，通过控制visible的值，传递给父组件
          this.updateVisible(false);

          // 触发父组件done事件
          this.$emit('done');
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
