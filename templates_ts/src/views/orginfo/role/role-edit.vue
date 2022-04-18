<!-- 编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改角色' : '新建角色'"
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
      <a-form-item label="角色名称:" name="roleName">
        <a-input v-model:value="form.roleName" placeholder="请输入角色名称" allow-clear />
      </a-form-item>
      <a-form-item label="角色编码:" name="roleCode">
        <a-input v-model:value="form.roleCode" placeholder="请输入角色编码" allow-clear />
      </a-form-item>
      <a-form-item label="排序号:" name="roleSort">
        <a-input-number v-model:value="form.roleSort" placeholder="请输入排序号" :min="0" class="ele-fluid"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { SysRoleApi } from '@/api/SysRoleApi';

export default {
  name: 'SysRoleEdit',
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
        roleName: [{ required: true, message: '请输入角色名称', type: 'string', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色编码', type: 'string', trigger: 'blur' }],
        roleSort: [{required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}]
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

      // 设置数据范围为空，不能在这里修改数据范围
      this.form.dataScopeType = null;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = SysRoleApi.edit(this.form);
      } else {
        result = SysRoleApi.add(this.form);
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
