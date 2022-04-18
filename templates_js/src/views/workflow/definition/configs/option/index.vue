<template>
  <div>
    <!--流程定义-选项表格-->
    <a-table :columns="columns" :dataSource="loadData" :pagination="false" :loading="tableLoading" :rowKey="record => record.optionId">
      <template #jumpFirst="{ record }">
        <a-tag color="green" v-if="record.jumpFirst === 'Y'">是</a-tag>
        <a-tag v-else>否</a-tag>
      </template>

      <template #smartComplete="{ record }">
        <a-tag color="green" v-if="record.smartComplete === 'Y'">是</a-tag>
        <a-tag v-else>否</a-tag>
      </template>

      <template #action="{ record }">
        <a-space>
          <a @click="handleDetail(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
        </a-space>
      </template>
    </a-table>

    <!--流程定义-选项详情对话框-->
    <a-modal title="选项详情" :width="900" :visible="visibleDetail" :footer="null" @cancel="handleCancelDetail">
      <a-spin :spinning="detailLoading">
        <a-form ref="detailForm">
          <a-form-item label="标题规则" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ currentSelection.title }}
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="自动完成第一个任务">
            <a-tag v-if="currentSelection.jumpFirst === 'Y'" :color="'green'">
              {{ currentSelection.jumpFirst }}
            </a-tag>
            <div v-else>{{ currentSelection.jumpFirst }}</div>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="跳过相同处理人">
            <a-tag v-if="currentSelection.smartComplete === 'Y'" :color="'green'">
              {{ currentSelection.smartComplete }}
            </a-tag>
            <div v-else>{{ currentSelection.smartComplete }}</div>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!--流程定义-选项详情的编辑-->
    <a-modal title="编辑选项" :width="900" :visible="visibleEdit" @ok="editHandSubmit" @cancel="handleCancelEdit">
      <a-spin :spinning="editLoading">
        <a-form ref="editForm" :model="currentSelection" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-form-item label="标题规则:" name="title">
            <a-input v-model:value="currentSelection.title" placeholder="请输入标题规则" allow-clear />
          </a-form-item>

          <a-form-item label="自动完成第一个任务" name="jumpFirst">
            <a-radio-group v-model:value="currentSelection.jumpFirst">
              <a-radio value="Y">是</a-radio>
              <a-radio value="N">否</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="跳过相同处理人" name="smartComplete">
            <a-radio-group v-model:value="currentSelection.smartComplete">
              <a-radio value="Y">是</a-radio>
              <a-radio value="N">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { OptionApi } from '@/api/workflow/OptionApi';

export default {
  data() {
    return {
      // 表单label宽度
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      // table正在加载标识
      tableLoading: false,
      // 详情是否显示
      visibleDetail: false,
      // 详情正在加载标识
      detailLoading: false,
      // 当前所选行的内容
      currentSelection: {},
      // 编辑是否显示
      visibleEdit: false,
      // 编辑弹框正在加载标识
      editLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '标题规则',
          dataIndex: 'title'
        },
        {
          title: '自动完成第一个任务',
          dataIndex: 'jumpFirst',
          slots: { customRender: 'jumpFirst' }
        },
        {
          title: '跳过相同处理人',
          dataIndex: 'smartComplete',
          slots: { customRender: 'smartComplete' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' }
        }
      ],
      // 表格加载的内容
      loadData: [],
      // 表单验证规则
      rules: {
        title: [{ required: true, type: 'string', message: '请输入标题规则', trigger: 'blur' }],
        jumpFirst: [{ required: true, type: 'string', message: '是否自动完成第一个任务', trigger: 'blur' }],
        smartComplete: [{ required: true, type: 'string', message: '是否跳过相同处理人', trigger: 'blur' }]
      }
    };
  },
  methods: {
    /**
     * 初始化界面
     *
     * @author fengshuonan
     * @date 2021/6/27 11:13
     */
    optionIndex(id) {
      this.queryParam.processDefinitionId = id;
      this.getOptionList();
    },

    /**
     * 获取选项集合
     *
     * @author fengshuonan
     * @date 2021/6/27 11:13
     */
    getOptionList() {
      this.tableLoading = true;
      OptionApi.optionList(this.queryParam).then(res => {
        this.tableLoading = false;
        this.loadData = res;
      });
    },

    /**
     * 清理临时数据
     *
     * @author fengshuonan
     * @date 2021/6/27 11:13
     */
    handleCancel() {
      this.loadData = [];
    },

    /**
     * 打开详情框
     *
     * @author fengshuonan
     * @date 2021/6/27 11:14
     */
    handleDetail(detail) {
      this.currentSelection = detail;
      this.visibleDetail = true;
    },

    /**
     * 关闭详情框
     *
     * @author fengshuonan
     * @date 2021/6/27 11:14
     */
    handleCancelDetail() {
      this.visibleDetail = false;
    },

    /**
     * 打开编辑框
     *
     * @author fengshuonan
     * @date 2021/6/27 11:14
     */
    handleEdit(record) {
      this.visibleEdit = true;
      this.currentSelection = record;
    },

    /**
     * 关闭编辑弹框
     *
     * @author fengshuonan
     * @date 2021/6/27 11:27
     */
    handleCancelEdit() {
      this.visibleEdit = false;
      this.currentSelection = {};
    },

    /**
     * 编辑提交
     *
     * @author fengshuonan
     * @date 2021/6/27 11:27
     */
    async editHandSubmit() {
      // 校验表单
      await this.$refs.editForm.validate();

      // 修改加载框为正在加载
      this.editLoading = true;

      // 执行编辑或修改方法
      OptionApi.edit(this.currentSelection)
        .then(() => {
          // 移除加载框
          this.editLoading = false;

          // 当前选择的内容
          this.currentSelection = {};
          this.$message.success('编辑成功');
          this.getOptionList();
          this.handleCancelEdit();
        })
        .catch(() => {
          this.editLoading = false;
        });
    }
  }
};
</script>
