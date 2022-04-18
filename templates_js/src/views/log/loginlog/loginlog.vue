<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="开始时间:">
              <a-date-picker v-model:value="where.beginTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
            </a-form-item>
            <a-form-item label="结束时间:">
              <a-date-picker v-model:value="where.endTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"/>
            </a-form-item>
            <a-form-item label="日志名称:">
              <a-input @keydown.enter="reload" v-model:value="where.llgName" allow-clear/>
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
        <ele-pro-table ref="table" row-key="llgId" :datasource="url" :columns="columns" :where="where" :scroll="{ x: 'max-content' }">
          <!-- table上边工具栏 -->
          <template #toolbar>

            <a-popconfirm
              title="是否清空所有日志？"
              @confirm="cleanAllLoginLog"
            >
              <template #icon>
                <question-circle-outlined/>
              </template>
              <a-button danger>
                <template #icon>
                  <delete-outlined/>
                </template>
                <span>清空日志</span>
              </a-button>
            </a-popconfirm>
          </template>

        </ele-pro-table>
      </a-card>
    </div>
  </div>

</template>

<script>
import {ref, toRefs, nextTick, reactive} from 'vue';
import {message} from 'ant-design-vue';
// 删除，感叹号，加号图标
import {DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons-vue';
import {LoginLogApi} from '@/api/LoginLogApi';

export default {
  name: 'loginlog',
  components: {
    DeleteOutlined,
    QuestionCircleOutlined
  },
  setup() {
    let table = ref(null)
    const data = reactive({
      // 表格数据接口
      url: '/loginLog/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({index}) => table.value.tableIndex + index,
        },
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '日志名称',
          dataIndex: 'llgName'
        },
        {
          title: '执行结果',
          dataIndex: 'llgSucceed'
        },
        {
          title: '时间',
          dataIndex: 'createTime'
        },
        {
          title: '具体消息',
          dataIndex: 'llgMessage'
        },
        {
          title: 'IP',
          dataIndex: 'llgIpAddress',
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前编辑数据
      current: null,
      // 是否显示详情弹窗
      showDetail: false
    });

    /**
     * 搜索按钮
     *
     * @author luojie
     * @date 2021/4/13 14:33
     */
    const reload = () => {
      table.value.reload({page: 1});
    }

    /**
     * 清空所有日志
     *
     * @author luojie
     * @date 2021/4/13 14:32
     */
    const cleanAllLoginLog = async () => {
      const result = await LoginLogApi.deleteAll(data.where);
      message.success(result.message);
      reload();
    }

    /**
     * 重置搜索
     *
     * @author luojie
     * @date 2021/4/13 14:33
     */
    const reset = () => {
      data.where = {};
      nextTick(() => {
        reload();
      });
    }

    return {
      ...toRefs(data),
      table,
      reload,
      reset,
      cleanAllLoginLog
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
