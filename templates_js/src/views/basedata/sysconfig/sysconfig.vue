<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :lg="5" :md="10" :sm="24" :xs="24">
        <a-card :bordered="false" :body-style="{ padding: '24px 24px' }">
          <!-- 界面左侧系统配置类型表格 -->
          <ele-pro-table
            ref="table"
            row-key="dictCode"
            :datasource="url"
            :columns="columns"
            v-model:current="current"
            :need-page="true"
            :toolkit="[]"
            @done="done"
            :row-selection="{ columnWidth: 40 }"
            :custom-row="customRow"
          >
            <template #toolbar>
              <a-space size="middle">
                <a-button type="primary" @click="openEdit()">
                  <plus-outlined />
                  <span>新建</span>
                </a-button>
                <a-button danger @click="remove" :disabled="!current">
                  <delete-outlined />
                  <span>删除</span>
                </a-button>
              </a-space>
            </template>
          </ele-pro-table>
        </a-card>
      </a-col>
      <a-col :lg="19" :md="14" :sm="24" :xs="24">
        <a-card :bordered="false">
          <!-- 具体的系统配置table -->
          <sys-config-table v-if="current" :groupCode="current.dictCode" />
        </a-card>
      </a-col>
    </a-row>
  </div>
  <!-- 编辑系统配置分类的弹框 -->
  <sys-config-type-edit v-model:visible="showEdit" :data="editData" @done="reload" />
</template>

<script>
import { createVNode } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import SysConfigTable from './sysconfig-table';
import SysConfigTypeEdit from './sysconfig-type-edit';
import { SysConfigApi } from '@/api/SysConfigApi';

export default {
  name: 'SysConfig',
  components: {
    SysConfigTable,
    SysConfigTypeEdit,
    PlusOutlined,
    DeleteOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/dict/getConfigGroupPage',
      // 表格列配置
      columns: [
        {
          title: '配置类型',
          dataIndex: 'dictName'
        },
        {
          title: '字典编码',
          dataIndex: 'dictCode'
        }
      ],
      // 表格选中数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null,
      // 配置类型的字典数据
      configTypeDict: {}
    };
  },
  async mounted() {
    // 加载字典数据
    const result = await SysConfigApi.getConfigDictTypeDetail();
    this.configTypeDict.dictTypeCode = result.dictTypeCode;
    this.configTypeDict.dictTypeId = result.dictTypeId;
    this.configTypeDict.dictTypeName = result.dictTypeName;
  },
  methods: {
    /**
     * 系统配置分类 表格渲染完成
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    done(res) {
      if (res.data.rows.length > 0) {
        this.current = res.data.rows[0];
      }
    },

    /**
     * 刷新系统配置分类表格
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    reload() {
      this.$refs.table.reload();
    },

    /**
     * 打开编辑系统配置分类
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    openEdit() {
      this.editData = this.configTypeDict;
      this.showEdit = true;
    },

    /**
     * 删除系统配置分类
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    remove() {
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的类型吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let result = await SysConfigApi.deleteConfigType({ dictId: this.current.dictId });
          this.$message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 点击行的事件监听
     *
     * @author fengshuonan
     * @date 2021/4/9 23:35
     */
    customRow(record) {
      return {
        onClick: () => {
          this.current = record;
        }
      };
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .ant-card {
    min-height: calc(100vh - 122px);
  }
}
</style>
