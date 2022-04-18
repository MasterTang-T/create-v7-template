<!-- 应用编辑弹窗 -->
<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改事件' : '新建事件'"
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
      <a-form-item label="事件名称:" name="eventName">
        <a-input v-model:value="form.eventName" placeholder="请输入事件名称" allow-clear />
      </a-form-item>

      <a-form-item label="事件节点类型:" name="nodeType">
        <a-radio-group v-model:value="form.nodeType" allow-clear>
          <a-radio :value="1" @click="nodeTypeClick(1)">全局</a-radio>
          <a-radio :value="2" @click="nodeTypeClick(2)">节点</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item v-show="actIdShow" label="活动节点" name="actId">
        <a-select v-model:value="form.actId" placeholder="请选择活动节点">
          <a-select-option v-for="(item, index) in actData" :key="index" :value="item.id" @click="actIdSelectChange(item.id)"
            >{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="事件类型" name="eventType">
        <a-select v-model:value="form.eventType" placeholder="请选择事件类型">
          <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.code">{{ item.value }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="脚本" name="script">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            选择已有脚本或下方填写新脚本
          </a-col>
          <a-col :md="12" :sm="24">
            <a-select placeholder="选择已有脚本">
              <a-select-option
                v-for="(item, index) in scriptData"
                :key="index"
                :value="item.scriptId"
                @click="scriptSelectClick(item.scriptId)"
                >{{ item.scriptName }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-textarea v-model:value="form.script" :rows="6" placeholder="请输入脚本内容"></a-textarea>
      </a-form-item>

      <a-form-item label="执行顺序">
        <a-input-number v-model:value="form.execSort" style="width: 100%" :min="1" :max="1000" />
      </a-form-item>

      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="form.remark" :rows="4" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { DefinitionApi } from '@/api/workflow/DefinitionApi';
import { ScriptApi } from '@/api/workflow/ScriptApi';
import { EventApi } from '@/api/workflow/EventApi';

export default {
  name: 'EventEdit',
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
        eventName: [{ required: true, message: '请输入事件名称！' }],
        nodeType: [{ required: true, message: '请选择事件节点类型！' }],
        actId: [{ required: this.actIdRequired, message: '请选择活动节点！' }],
        eventType: [{ required: true, message: '请选择事件类型！' }],
        script: [{ required: true, message: '请输入脚本内容！' }],
        execSort: [{ required: true, message: '请输入顺序！' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 活动节点下拉是否选择
      actIdShow: false,
      // 活动节点是否必填
      actIdRequired: false,
      // 活动节点下拉框数据
      actData: [],
      // 事件类型下拉框数据
      typeData: [
        { code: 'ACTIVITY_CANCELLED', value: '活动取消' },
        { code: 'PROCESS_STARTED', value: '流程启动' },
        { code: 'ACTIVITY_COMPLETED', value: '活动完成' },
        { code: 'PROCESS_CANCELLED', value: '流程取消' },
        { code: 'SEQUENCEFLOW_TAKEN', value: '连接线' },
        {
          code: 'PROCESS_COMPLETED',
          value: '流程完成'
        },
        { code: 'ACTIVITY_STARTED', value: '活动开始' },
        { code: 'TASK_ASSIGNED', value: '任务分配' },
        { code: 'TASK_COMPLETED', value: '任务完成' },
        { code: 'TASK_CREATED', value: '任务创建' }
      ],
      scriptData: []
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

      this.flowableScriptList();
      this.flowableDefinitionUserTasks();

      // 如果是时间节点类型是节点
      if (this.isUpdate && this.form.nodeType === 2) {
        this.actIdShow = true;
      } else {
        this.actIdShow = false;
      }

      this.form.processDefinitionId = this.definitionId;

      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 保存和编辑事件
     *
     * @author fengshuonan
     * @date 2021/6/28 15:53
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 设置流程定义id
      this.form.processDefinitionId = this.definitionId;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = EventApi.eventEdit(this.form);
      } else {
        result = EventApi.eventAdd(this.form);
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
     * 事件节点类型，radio选择事件
     *
     * @author fengshuonan
     * @date 2021/6/28 14:50
     */
    nodeTypeClick(code) {
      // 如果选择是2（节点），则显示出来节点下拉框
      if (code === 2) {
        // 获取活动节点下拉数据框
        this.flowableDefinitionUserTasks();
        this.actIdShow = true;
        this.actIdRequired = true;
      } else {
        this.actIdShow = false;
        this.actIdRequired = false;
      }
    },

    /**
     * 获取活动节点下拉框数据
     *
     * @author fengshuonan
     * @date 2021/6/28 15:00
     */
    flowableDefinitionUserTasks() {
      DefinitionApi.flowableDefinitionUserTasks({ id: this.definitionId }).then(res => {
        this.actData = res;
      });
    },

    /**
     * 活动节点下拉框事件
     *
     * @author fengshuonan
     * @date 2021/6/28 15:05
     */
    actIdSelectChange(id) {
      this.form.actName = this.actData.find(item => id === item.id).name;
    },

    /**
     * 获取待选脚本列表
     *
     * @author fengshuonan
     * @date 2021/6/28 15:09
     */
    flowableScriptList() {
      ScriptApi.flowableScriptList().then(res => {
        this.scriptData = res;
      });
    },

    /**
     * 脚本下拉框事件
     *
     * @author fengshuonan
     * @date 2021/6/28 15:13
     */
    scriptSelectClick(id) {
      this.form.script = this.scriptData.find(item => id === item.scriptId).content;
    }
  }
};
</script>

<style scoped></style>
