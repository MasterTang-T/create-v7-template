<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="任务名称:">
              <a-input @keydown="keydown" v-model:value.trim="where.timerName" placeholder="请输入任务名称" allow-clear/>
            </a-form-item>
            <a-form-item label="任务状态">
              <a-select v-model:value="where.jobStatus" style="width: 205px" placeholder="请选择" allow-clear>
                <a-select-option value="1">运行</a-select-option>
                <a-select-option value="2">停止</a-select-option>
              </a-select>
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
        <ele-pro-table
          ref="table"
          row-key="timerId"
          :datasource="url"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-button type="primary" @click="openEdit()">
                <template #icon>
                  <plus-outlined/>
                </template>
                <span>新建</span>
              </a-button>
            </a-space>
          </template>

          <!-- table列表状态栏 -->
          <!-- 1是运行，2是停止 -->
          <template #state="{ record }">
            <a-switch checked-children="运行" un-checked-children="停止" default-checked :checked="record.jobStatus === 1" @change="checked => editActive(checked, record)"/>
          </template>

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定要删除此定时任务吗？" @confirm="remove(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

  </div>

  <!-- 编辑弹窗 -->
  <sys-timer-edit v-model:visible="showEdit" :data="current" @done="reload"/>

</template>

<script>
import {reactive, toRefs, nextTick, ref} from 'vue'
import {message} from 'ant-design-vue'
import {SysTimerApi} from "@/api/SysTimerApi";
import SysTimerEdit from "./timer-edit";
import {PlusOutlined} from "@ant-design/icons-vue";

export default {
  name: "timer",
  components: {
    PlusOutlined,
    SysTimerEdit
  },
  setup() {
    let table = ref(null);
    const state = reactive({
      // 表格数据接口
      url: '/sysTimers/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({index}) => table.value.tableIndex + index
        },
        {
          title: '任务名称',
          dataIndex: 'timerName',
          width: 160,
          sorter: true
        },
        {
          title: '参数',
          dataIndex: 'params',
          width: 160,
          sorter: true
        },
        {
          title: 'cron表达式',
          dataIndex: 'cron',
          width: 160,
          sorter: true
        },
        {
          title: '任务class',
          dataIndex: 'actionClass',
          width: 160,
          sorter: true
        },
        {
          title: '备注信息',
          dataIndex: 'remark',
          width: 160,
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'jobStatus',
          sorter: true,
          width: 160,
          align: 'center',
          slots: {customRender: 'state'}
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
          align: 'center',
          slots: {customRender: 'action'}
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
    })

    /**
     * 搜索框按键监听
     *
     * @author luojie
     * @date 2021/4/13 11:24
     */
    const keydown = (e) => {
      let keyCode = e.keyCode;
      // 如果按下是回车则执行搜索
      if (keyCode === 13) {
        // 重载表格
        reload();
      }

      // 如果是删除按键 并且按下 ctrl
      if (keyCode === 8 && e.ctrlKey) {
        // 清空输入的内容
        state.where.timerName = ''
      }
    }

    /**
     * 搜索按钮
     *
     * @author luojie
     * @date 2021/4/13 11:24
     */
    const reload = () => {
      state.selection = [];
      table.value.reload({page: 1})
    }

    /**
     * 重置搜索
     *
     * @author luojie
     * @date 2021/4/13 10:35
     */
    const reset = () => {
      state.where = {};
      nextTick(() => {
        reload();
      });
    }

    /**
     * 删除单个
     *
     * @author luojie
     * @date 2021/4/13 10:35
     */
    const remove = async (row) => {
      const result = await SysTimerApi.delete({timerId: row.timerId});
      message.success(result.message);
      reload();
    }

    /**
     * 打开编辑弹窗
     *
     * @author luojie
     * @date 2021/4/13 11:25
     */
    const openEdit = (row) => {
      state.current = row;
      state.showEdit = true;
    }

    /**
     * 设置运行状态
     *
     * @author luojie
     * @date 2021/4/13 09:58
     */
    const editActive = async (checked, row) => {
      const timerId = row.timerId;
      let result = {}
      if (checked) {
        result = await SysTimerApi.start({timerId});
      } else {
        result = await SysTimerApi.stop({timerId});
      }
      message.success(result.message);
      reload();
    }

    return {
      ...toRefs(state),
      keydown,
      reset,
      remove,
      openEdit,
      editActive,
      table,
      reload
    }
  }
}
</script>

<style scoped>
/*搜索框与表格之间的间隙*/
.block-interval {
  margin-bottom: 10px;
}

/*重写顶部搜索表单的样式*/
.ant-form-item {
  margin-bottom: 0;
}
</style>
