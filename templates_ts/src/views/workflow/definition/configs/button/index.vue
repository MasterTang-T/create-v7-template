<template>
  <div>
    <!--新增按钮-->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary">
        <plus-outlined />
        新增按钮
      </a-button>
    </div>

    <!--表格-->
    <div>
      <a-table :columns="columns" :dataSource="loadData" :pagination="false" :loading="tableLoading" :rowKey="record => record.buttonId">
        <template #buttonTag="{ text }">
          <a-tag color="green" v-if="text === 'Y'">是</a-tag>
          <a-tag v-else>否</a-tag>
        </template>

        <template #action="{ record }">
          <a-space>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm placement="topRight" title="确定删除？" @confirm="() => handleDel(record)">
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>

    <!--新增按钮弹框-->
    <div>
      <a-modal title="新增按钮" :width="900" :visible="visibleAdd" @ok="handAddSubmit" @cancel="handleCancelAdd">
        <a-spin :spinning="addLoading">
          <a-form ref="addForm" :model="currentSelection" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-form-item name="actId" label="活动节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-model:value="currentSelection.actId" placeholder="请选择活动节点" @change="actSelect">
                <a-select-option v-for="(item, index) in userTasks" :key="index" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="按钮">
              <div>
                <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                  <a-checkbox :indeterminate="addIndeterminate" :checked="addCheckAll" @change="addOnCheckAllChange">
                    全选
                  </a-checkbox>
                </div>
                <a-checkbox-group v-model:value="addCheckedList" @change="addOnChange">
                  <a-row>
                    <a-col style="padding-top: 5px;padding-bottom: 5px" v-for="(item, index) in columnsButtonTitle" :key="index" :span="6">
                      <a-checkbox :checked="true" :value="item.dataIndex">{{ item.title }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </div>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
    </div>

    <!--编辑按钮弹框-->
    <div>
      <a-modal title="编辑选项" :width="900" :visible="visibleEdit" @ok="editHandSubmit" @cancel="handleCancelEdit">
        <a-spin :spinning="editLoading">
          <a-form ref="editForm" :model="currentSelection" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-form-item name="actId" label="活动节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-model:value="currentSelection.actId" placeholder="请选择活动节点" :disabled="true">
                <a-select-option v-for="(item, index) in userTasks" :key="index" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="按钮">
              <div>
                <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                  <a-checkbox :indeterminate="addIndeterminate" :checked="addCheckAll" @change="addOnCheckAllChange">
                    全选
                  </a-checkbox>
                </div>
                <a-checkbox-group v-model:value="addCheckedList" @change="addOnChange">
                  <a-row>
                    <a-col style="padding-top: 5px;padding-bottom: 5px" v-for="(item, index) in columnsButtonTitle" :key="index" :span="6">
                      <a-checkbox :checked="true" :value="item.dataIndex">{{ item.title }}</a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </div>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { ButtonManageApi } from '@/api/workflow/ButtonManageApi';
import { DefinitionApi } from '@/api/workflow/DefinitionApi';

export default {
  name: 'ButtonManage',
  components: {
    PlusOutlined
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      visible: false,
      tableLoading: false,
      visibleButton: {},
      actData: [],
      userTasks: [],
      // 新增
      visibleAdd: false,
      addLoading: false,
      // 所有的选项
      totalOptions: [
        'submitFlag',
        'saveFlag',
        'backFlag',
        'turnFlag',
        'nextFlag',
        'entrustFlag',
        'endFlag',
        'traceFlag',
        'suspendFlag',
        'jumpFlag',
        'addSignFlag',
        'deleteSignFlag'
      ],
      // 新增多选按钮
      addCheckedList: [],
      addIndeterminate: true,
      addCheckAll: false,
      // 编辑参数
      visibleEdit: false,
      editLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        { title: '节点名称', dataIndex: 'actName' },
        { title: '提交', dataIndex: 'submitFlag', slots: { customRender: 'buttonTag' } },
        { title: '保存', dataIndex: 'saveFlag', slots: { customRender: 'buttonTag' } },
        { title: '退回', dataIndex: 'backFlag', slots: { customRender: 'buttonTag' } },
        { title: '转办', dataIndex: 'turnFlag', slots: { customRender: 'buttonTag' } },
        { title: '指定', dataIndex: 'nextFlag', slots: { customRender: 'buttonTag' } },
        { title: '委托', dataIndex: 'entrustFlag', slots: { customRender: 'buttonTag' } },
        { title: '终止', dataIndex: 'endFlag', slots: { customRender: 'buttonTag' } },
        { title: '追踪', dataIndex: 'traceFlag', slots: { customRender: 'buttonTag' } },
        { title: '挂起', dataIndex: 'suspendFlag', slots: { customRender: 'buttonTag' } },
        { title: '跳转', dataIndex: 'jumpFlag', slots: { customRender: 'buttonTag' } },
        { title: '加签', dataIndex: 'addSignFlag', slots: { customRender: 'buttonTag' } },
        { title: '减签', dataIndex: 'deleteSignFlag', slots: { customRender: 'buttonTag' } },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          slots: { customRender: 'action' }
        }
      ],
      columnsButtonTitle: [
        { title: '提交', dataIndex: 'submitFlag' },
        { title: '保存', dataIndex: 'saveFlag' },
        { title: '退回', dataIndex: 'backFlag' },
        { title: '转办', dataIndex: 'turnFlag' },
        { title: '指定', dataIndex: 'nextFlag' },
        { title: '委托', dataIndex: 'entrustFlag' },
        { title: '终止', dataIndex: 'endFlag' },
        { title: '追踪', dataIndex: 'traceFlag' },
        { title: '挂起', dataIndex: 'suspendFlag' },
        { title: '跳转', dataIndex: 'jumpFlag' },
        { title: '加签', dataIndex: 'addSignFlag' },
        { title: '减签', dataIndex: 'deleteSignFlag' }
      ],
      loadData: [],
      textData: [],
      // 当前选择的行信息
      currentSelection: {},
      // 表单验证规则
      rules: {
        actId: [{ required: true, type: 'string', message: '请选择活动节点', trigger: 'blur' }]
      }
    };
  },
  methods: {
    /**
     * 初始化此标签
     *
     * @author fengshuonan
     * @date 2021/6/27 16:01
     */
    buttonIndex(button) {
      this.visibleButton = button;
      this.queryParam.processDefinitionId = button.id;
      this.getButtonList();
      this.flowableDefinitionUserTasks();
    },

    /**
     * 获取table的按钮列表
     *
     * @author fengshuonan
     * @date 2021/6/27 15:59
     */
    getButtonList() {
      this.tableLoading = true;
      ButtonManageApi.buttonList(this.queryParam).then(res => {
        this.tableLoading = false;
        this.loadData = res;
      });
    },

    /**
     * 获取活动节点下拉框数据
     *
     * @author fengshuonan
     * @date 2021/6/27 16:03
     */
    flowableDefinitionUserTasks() {
      DefinitionApi.flowableDefinitionUserTasks({ id: this.visibleButton.id }).then(res => {
        this.userTasks = res;
      });
    },

    /**
     * 关闭此整个界面
     *
     * @author fengshuonan
     * @date 2021/6/27 16:30
     */
    handleCancel() {
      this.loadData = [];
      this.columns = [];
      this.columnsButtonTitle = [];
    },

    /**
     * 打开新增框
     *
     * @author fengshuonan
     * @date 2021/6/27 16:30
     */
    handleAdd() {
      this.visibleAdd = true;
      this.currentSelection = {};
      this.currentSelection.processDefinitionId = this.visibleButton.id;
    },

    /**
     * 关闭新增框
     *
     * @author fengshuonan
     * @date 2021/6/27 16:30
     */
    handleCancelAdd() {
      this.visibleAdd = false;
      this.currentSelection = {};
      this.addCheckedList = [];
      this.addCheckAll = false;
      this.addIndeterminate = false;
    },

    /**
     * 设置actName属性的值
     *
     * @author fengshuonan
     * @date 2021/6/27 17:34
     */
    actSelect(code) {
      this.currentSelection.actName = this.userTasks.find(item => code === item.id).name;
    },

    /**
     * 新增提交
     *
     * @author fengshuonan
     * @date 2021/6/27 16:30
     */
    async handAddSubmit() {
      // 校验表单
      await this.$refs.addForm.validate();

      // 修改加载框为正在加载
      this.addLoading = true;

      // 根据选中的按钮，设置参数
      for (const item of this.addCheckedList) {
        this.currentSelection[item] = 'Y';
      }

      // 执行编辑或修改方法
      ButtonManageApi.add(this.currentSelection)
        .then(() => {
          // 移除加载框
          this.addLoading = false;

          // 当前选择的内容
          this.currentSelection = {};
          this.$message.success('新增成功');
          this.handleCancelAdd();
          this.getButtonList();
        })
        .catch(() => {
          this.addLoading = false;
        });
    },

    /**
     * 打开编辑框
     *
     * @author fengshuonan
     * @date 2021/6/27 18:37
     */
    handleEdit(record) {
      this.visibleEdit = true;
      this.currentSelection = record;
      for (const item in record) {
        if (record[item] === 'Y') {
          this.addCheckedList.push(item);
        }
      }
    },

    /**
     * 关闭编辑框
     *
     * @author fengshuonan
     * @date 2021/6/27 19:09
     */
    handleCancelEdit() {
      this.addCheckAll = false;
      this.addIndeterminate = false;
      this.addCheckedList = [];
      this.visibleEdit = false;
    },

    /**
     * 编辑提交
     *
     * @author fengshuonan
     * @date 2021/6/27 19:09
     */
    async editHandSubmit() {
      // 校验表单
      await this.$refs.editForm.validate();

      // 修改加载框为正在加载
      this.editLoading = true;

      // 先清空已经选过的Y的值
      for (const item in this.currentSelection) {
        if (this.currentSelection[item] === 'Y') {
          this.currentSelection[item] = 'N';
        }
      }

      // 根据选中的按钮，设置参数
      for (const item of this.addCheckedList) {
        this.currentSelection[item] = 'Y';
      }

      // 执行编辑或修改方法
      ButtonManageApi.buttonEdit(this.currentSelection)
        .then(() => {
          // 移除加载框
          this.editLoading = false;

          // 当前选择的内容
          this.currentSelection = {};
          this.$message.success('新增成功');
          this.handleCancelEdit();
          this.getButtonList();
        })
        .catch(() => {
          this.editLoading = false;
        });
    },

    /**
     * 多选框点击
     *
     * @author fengshuonan
     * @date 2021/6/27 19:10
     */
    addOnChange(checkedList) {
      this.addIndeterminate = !!checkedList.length && checkedList.length < this.totalOptions.length;
      this.addCheckAll = checkedList.length === this.totalOptions.length;
    },

    /**
     * 全选
     *
     * @author fengshuonan
     * @date 2021/6/27 19:10
     */
    addOnCheckAllChange(e) {
      Object.assign(this, {
        addCheckedList: e.target.checked ? this.columnsButtonTitle : [],
        addIndeterminate: false,
        addCheckAll: e.target.checked
      });
      const obj = JSON.parse(JSON.stringify(this.addCheckedList));
      if (this.addCheckedList.length > 0) {
        this.addCheckedList = [];
        obj.forEach(item => {
          this.addCheckedList.push(item.dataIndex);
        });
      }
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2021/6/27 19:10
     */
    handleDel(record) {
      this.tableLoading = true;
      ButtonManageApi.buttonDelete({ buttonId: record.buttonId }).then(() => {
        this.tableLoading = false;
        this.$message.success('删除成功');
        this.getButtonList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.table-operator {
  margin-bottom: 18px;
}

button {
  margin-right: 8px;
}
</style>
