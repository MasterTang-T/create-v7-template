<template>
  <a-modal
    title='部署模型'
    :width='600'
    :visible='visible'
    @ok='handleSubmit'
    @cancel='handleCancel'
  >
    <a-form
      ref='form'
      :model='form'
      :rules='rules'
      :label-col='{ md: { span: 7 }, sm: { span: 24 } }'
      :wrapper-col='{ md: { span: 17 }, sm: { span: 24 } }'
    >
      <a-form-item label='模型名称:' name='name'>
        {{ this.form.name }}
      </a-form-item>
      <a-form-item label='模型分类' name='category' has-feedback>
        <a-select v-model:value='form.category' placeholder='请选择模型分类'>
          <a-select-option v-for='(item,index) in categoryList' :key='index' :value='item.categoryCode'>{{ item.categoryName }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>

import { CategoryApi } from '@/api/workflow/CategoryApi';
import { DefinitionApi } from '@/api/workflow/DefinitionApi';

export default {
  name: 'ModelDeployment',
  emits: ['done'],
  data() {
    return {
      // 表单验证规则
      rules: {
        category: [{ required: true, message: '请选择模型分类', type: 'string', trigger: 'blur' }]
      },
      visible: false,
      form: {},
      categoryList: []
    };
  },
  async created() {
    // 初始化分类选择列表
    this.categoryList = await CategoryApi.categoryList();
  },
  methods: {
    /**
     * 初始化弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 10:50
     */
    initModel(record) {
      this.form = record;
      this.visible = true;
    },

    /**
     * 提交流程发布
     *
     * @author fengshuonan
     * @date 2021/6/26 10:50
     */
    async handleSubmit() {
      // 校验表单
      await this.$refs.form.validate();

      // 执行编辑或修改方法
      DefinitionApi.definitionDeploy(this.form).then(result => {

        // 提示添加成功
        this.$message.success(result.message);

        // 触发父组件done事件
        this.$emit('done');

        // 关闭对话框
        this.handleCancel();
      });
    },

    /**
     * 关闭对话框
     *
     * @author fengshuonan
     * @date 2021/6/26 10:50
     */
    handleCancel() {
      this.form = {};
      this.visible = false;
    }
  }
};
</script>
