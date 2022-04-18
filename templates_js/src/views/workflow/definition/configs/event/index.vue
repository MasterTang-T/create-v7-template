<template>
  <!-- 表格 -->
  <ele-pro-table
    ref="table"
    row-key="eventId"
    :datasource="url"
    :columns="columns"
    :where="where"
    v-model:selection="selection"
    :scroll="{ x: 'max-content' }"
    :initLoad="false"
    :needPage="false"
    :response="{
      dataName: 'data'
    }"
  >
    <!-- table上边工具栏 -->
    <template #toolbar>
      <a-space>
        <a-button type="primary" @click="openEdit()">
          <template #icon>
            <plus-outlined />
          </template>
          <span>新增事件</span>
        </a-button>
      </a-space>
    </template>

    <!-- 事件节点类型 -->
    <template #nodeType="{ record }">
      <a-tag color="green" v-if="record.nodeType === 1">全局</a-tag>
      <a-tag color="blue" v-if="record.nodeType === 2">节点</a-tag>
    </template>

    <!-- 事件类型 -->
    <template #eventType="{ record }">
      <a-tag v-if="record.eventType === 'ACTIVITY_CANCELLED'">活动取消</a-tag>
      <a-tag v-if="record.eventType === 'PROCESS_STARTED'">流程启动</a-tag>
      <a-tag v-if="record.eventType === 'ACTIVITY_COMPLETED'">活动完成</a-tag>
      <a-tag v-if="record.eventType === 'PROCESS_CANCELLED'">流程取消</a-tag>
      <a-tag v-if="record.eventType === 'SEQUENCEFLOW_TAKEN'">连接线</a-tag>
      <a-tag v-if="record.eventType === 'PROCESS_COMPLETED'">流程完成</a-tag>
      <a-tag v-if="record.eventType === 'ACTIVITY_STARTED'">活动开始</a-tag>
      <a-tag v-if="record.eventType === 'TASK_ASSIGNED'">任务分配</a-tag>
      <a-tag v-if="record.eventType === 'TASK_COMPLETED'">任务完成</a-tag>
      <a-tag v-if="record.eventType === 'TASK_CREATED'">任务创建</a-tag>
    </template>

    <!-- table操作栏按钮 -->
    <template #action="{ record }">
      <a-space>
        <a @click="openEdit(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定要删除此事件吗？" @confirm="remove(record)">
          <a class="ele-text-danger">删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </ele-pro-table>

  <!-- 编辑弹窗 -->
  <event-edit v-model:visible="showEdit" :data="current" :definition-id="where.processDefinitionId" @done="reload" />
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import EventEdit from '@/views/workflow/definition/configs/event/event-edit';
import { EventApi } from '@/api/workflow/EventApi';

export default {
  name: 'EventIndex',
  components: {
    EventEdit,
    PlusOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/flowableEvent/list',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '事件名称',
          dataIndex: 'eventName'
        },
        {
          title: '事件节点类型',
          dataIndex: 'nodeType',
          slots: { customRender: 'nodeType' }
        },
        {
          title: '事件类型',
          dataIndex: 'eventType',
          slots: { customRender: 'eventType' }
        },
        {
          title: '执行顺序',
          dataIndex: 'execSort'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  methods: {
    /**
     * 初始化显示
     *
     * @author fengshuonan
     * @date 2021/6/27 16:01
     */
    eventIndex(record) {
      this.where.processDefinitionId = record.id;
      this.reload();
    },

    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload();
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      let result = await EventApi.eventDelete({ eventId: row.eventId });
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    }
  }
};
</script>

<style scoped>
/*搜索框与表格之间的间隙*/
.block-interval {
  margin-bottom: 10px;
}
</style>
