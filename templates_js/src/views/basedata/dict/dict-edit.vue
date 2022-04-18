<!-- 编辑弹窗 -->
<template>
  <a-modal
    :width='460'
    :visible='visible'
    :confirm-loading='loading'
    :title="isUpdate ? '修改字典类型' : '新建字典类型'"
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
      <a-form-item label='类型名称:' name='dictTypeName'>
        <a-input v-model:value='form.dictTypeName' placeholder='请输入字典类型名称' allow-clear/>
      </a-form-item>
      <a-form-item label='类型编码:' name='dictTypeCode'>
        <a-input v-model:value='form.dictTypeCode' placeholder='请输入字典类型编码' allow-clear :disabled='isUpdate'/>
      </a-form-item>
      <a-form-item label="业务类型:" name="dictTypeClass">
        <a-select v-model:value="form.dictTypeClass" placeholder="请选择业务类型" @change="handleChange" allow-clear>
          <a-select-option value="1">业务类型</a-select-option>
          <a-select-option value="2">系统类型</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="业务编码:" name="dictTypeBusCode" v-show="showDictTypeBusCode">
        <a-input v-model:value="form.dictTypeBusCode" placeholder="请输入业务编码" allow-clear />
      </a-form-item>
      <a-form-item label="排序:" name="dictTypeSort">
        <a-input-number style='width: 100%' v-model:value="form.dictTypeSort" placeholder="请输入字典类型排序" allow-clear autocomplete="off"/>
      </a-form-item>
      <a-form-item label="描述信息:" name="dictTypeDesc">
        <a-input v-model:value="form.dictTypeDesc" placeholder="请输入描述信息" allow-clear autocomplete="off"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { SysDictTypeApi } from '@/api/SysDictTypeApi';

export default {
  name: 'SysDictEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        dictTypeName: [{required: true, message: '请输入字典名称', type: 'string', trigger: 'blur'}],
        dictTypeCode: [{required: true, message: '请输入字典编码', type: 'string', trigger: 'blur'}],
        dictTypeClass: [{required: true, message: '请选择业务类型', type: 'string', trigger: 'blur'}],
        dictTypeSort: [{required: true, message: '请输入字典顺序', type: 'number', trigger: 'blur'}]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 是否显示字典业务代码
      showDictTypeBusCode: false,
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
        result = SysDictTypeApi.edit(this.form);
      } else {
        result = SysDictTypeApi.add(this.form);
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
    },
    handleChange(value) {

      if (value == 1) {
        console.log(111111)
        this.showDictTypeBusCode = true;
      } else {
        console.log(22222);
        this.showDictTypeBusCode = false;
      }

    }
  }
};
</script>

<style scoped></style>
