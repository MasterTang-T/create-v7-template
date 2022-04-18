<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="开始时间:">
              <a-date-picker v-model:value="where.beginDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item label="结束时间:">
              <a-date-picker v-model:value="where.endDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item label="服务名称:">
              <a-select v-model:value="where.appName" style="width: 205px">
                <a-select-option value="guns">guns</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="日志名称:">
              <a-input v-model:value="where.logName" />
            </a-form-item>
            <a-form-item class="ele-text-center">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </a-card>
    </div>

    <!-- 表格 -->
    <div>
      <a-card :bordered="false">
        <ele-pro-table ref="table" row-key="logId" :datasource="url" :columns="columns" :where="where" :scroll="{ x: 'max-content' }">
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-button danger @click="removeBatch()">
                <template #icon>
                  <delete-outlined />
                </template>
                <span>清空日志</span>
              </a-button>
            </a-space>
          </template>

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openDetail(record)">详情</a>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 操作日志详情 -->
  <operate-log-detail v-model:visible="showDetail" :detail="current"></operate-log-detail>
</template>

<script>
import { createVNode } from 'vue';
// 删除，感叹号，加号图标
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { OperateLogApi } from '@/api/OperateLogApi';
import OperateLogDetail from '@/views/log/operatelog/operatelog-detail';

export default {
  name: 'Position',
  components: {
    OperateLogDetail,
    DeleteOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/logManager/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '日志分类',
          dataIndex: 'logName'
        },
        {
          title: '执行接口',
          dataIndex: 'requestUrl'
        },
        {
          title: '具体消息',
          dataIndex: 'logContent'
        },
        {
          title: '操作用户',
          dataIndex: 'realName'
        },
        {
          title: '服务名称',
          dataIndex: 'appName'
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          align: 'center'
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
      // 当前编辑数据
      current: null,
      // 是否显示详情弹窗
      showDetail: false
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reload() {
      this.$refs.table.reload({ page: 1 });
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
     * 批量删除
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    removeBatch() {
      if (!this.where.beginDate || !this.where.endDate || !this.where.appName) {
        this.$message.error('清空日志需要填写开始时间，结束时间以及app名称');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要清空指定日期的操作日志吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          const result = await OperateLogApi.delete(this.where);
          this.$message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 打开详情窗口
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async openDetail(row) {
      this.current = await OperateLogApi.detail({ logId: row.logId });
      this.showDetail = true;
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
