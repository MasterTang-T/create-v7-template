<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="标题:">
              <a-input v-model:value.trim="where.messageTitle" placeholder="请输入通知标题" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center" :wrapper-col="{ span: 24 }">
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
        <ele-pro-table
          ref="table"
          row-key="messageId"
          :datasource="url"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-button type="primary" @click="setAlready()">
                <template #icon>
                  <CheckOutlined />
                </template>
                <span>全部已读</span>
              </a-button>
            </a-space>
          </template>

          <!-- table列表已读状态 -->
          <template #state="{ record }">
            <a-tag color="green" v-if="record.readFlag === 0">未读</a-tag>
            <a-tag v-else> 已读</a-tag>
          </template>

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openEdit(record)">查看</a>
              <a-divider type="vertical" />
              <a class="ele-text-danger" @click="deleteMessage(record)">删除</a>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>
  <mynotice-detail v-model:visible="showDetail" :data="current" @done="reload"></mynotice-detail>
</template>

<script>
import { CheckOutlined } from '@ant-design/icons-vue';
import { NoticeApi } from '@/api/NoticeApi';
import MynoticeDetail from '@/views/notice/mynotice/mynotice-detail';

export default {
  name: 'Publish',
  components: {
    MynoticeDetail,
    CheckOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/sysMessage/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '标题',
          dataIndex: 'messageTitle'
        },
        {
          title: '发消息人',
          dataIndex: 'sendUserName'
        },
        {
          title: '消息发送时间',
          dataIndex: 'messageSendTime'
        },
        {
          title: '已读状态',
          dataIndex: 'readFLag',
          slots: { customRender: 'state' }
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
      // 是否显示详情
      showDetail: false
    };
  },
  methods: {
    /**
     * 重新加载
     *
     * @author laihongliang
     * @date 2021/04/19 00:21
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置
     *
     * @author laihongliang
     * @date 2021/04/19 00:21
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 设置为已读
     *
     * @author fengshuonan
     * @date 2021/6/15 23:08
     */
    async setAlready() {
      let result = await NoticeApi.setAlreadyReadState();
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑页面
     *
     * @author fengshuonan
     * @date 2021/6/15 23:14
     */
    openEdit(record) {
      this.current = record;
      this.showDetail = true;
    },

    /**
     * 删除消息
     *
     * @author fengshuonan
     * @date 2021/6/14 22:31
     */
    async deleteMessage(record) {
      let result = await NoticeApi.deleteMessage(record);
      this.$message.success(result.message);
      this.reload();
    }
  }
};
</script>
