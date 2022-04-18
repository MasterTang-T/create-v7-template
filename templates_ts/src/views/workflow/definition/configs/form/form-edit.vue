<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改表单' : '新建表单'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ xs: { span: 24 }, sm: { span: 5 } }"
      :wrapper-col="{ xs: { span: 24 }, sm: { span: 15 } }"
    >
      <a-form-item label="选择表单:" name="formResourceId">
        <a-select v-model:value="form.formResourceId" placeholder="请选择表单" allow-clear>
          <a-select-option v-for="(item, index) in formListData" :key="index" :value="item.formResourceId"
            >{{ item.formResourceName }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="节点类型:" name="nodeType">
        <a-radio-group v-model:value="form.nodeType" @change="nodeTypeChange">
          <a-radio v-for="(item, index) in nodeTypeData" :key="index" :value="item.code">{{ item.value }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="活动节点:" name="nodeType" v-show="actIdShow">
        <a-select placeholder="请选择活动节点" v-model:value="form.actId" @change="actIdSelectChange">
          <a-select-option v-for="(item, index) in actData" :key="index" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { DefinitionApi } from '@/api/workflow/DefinitionApi';
import { FormResourceApi } from '@/api/workflow/FormResourceApi';
import { FormApi } from '@/api/workflow/FormApi';

export default {
  name: 'FormEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 流程定义id
    definitionId: String
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        formResourceId: [{ required: true, message: '请选择表单', type: 'string', trigger: 'blur' }],
        nodeType: [{ required: true, message: '请选择节点类型', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 表单列表
      formListData: [],
      // 节点类型
      nodeTypeData: [
        { code: 1, value: '启动' },
        { code: 2, value: '全局' },
        { code: 3, value: '节点' }
      ],
      //
      actData: [],
      // 是否显示下拉活动类型
      actIdShow: false
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

      this.formResourceList();
      this.flowableDefinitionUserTasks();
    }
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      // 设置流程定义id
      this.form.processDefinitionId = this.definitionId;

      let result = null;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = FormApi.formEdit(this.form);
      } else {
        result = FormApi.formAdd(this.form);
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
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 表单节点类型切换
     *
     * @author fengshuonan
     * @date 2021/6/28 22:27
     */
    nodeTypeChange(item) {
      if (item.target.value === 3) {
        this.flowableDefinitionUserTasks();
        this.actIdShow = true;
        this.actIdRequired = true;
      } else {
        this.actIdShow = false;
        this.actIdRequired = false;

        this.form.actId = '';
        this.form.actName = '';
      }
    },

    /**
     * 获取活动节点下拉框数据
     *
     * @author fengshuonan
     * @date 2021/6/28 22:29
     */
    flowableDefinitionUserTasks() {
      DefinitionApi.flowableDefinitionUserTasks({ id: this.definitionId }).then(res => {
        this.actData = res;
      });
    },

    /**
     * 获取表单列表
     *
     * @author fengshuonan
     * @date 2021/6/28 22:38
     */
    formResourceList() {
      FormResourceApi.formResourceList().then(res => {
        this.formListData = res;
      });
    },

    /**
     * 活动节点选择事件
     *
     * @author fengshuonan
     * @date 2021/6/28 22:49
     */
    actIdSelectChange(id) {
      this.form.actName = this.actData.find(item => id === item.id).name;
    }
  }
};
</script>

<style scoped></style>
