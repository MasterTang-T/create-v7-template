<template>
  <div>
    <!--模型管理界面-->
    <div class='ele-body' v-show='indexShow'>
      <!-- 搜索表单 -->
      <div class='block-interval'>
        <a-card :bordered='false'>
          <a-form layout='inline' :model='where'>
            <a-row>
              <a-form-item label='流程名称:'>
                <a-input v-model:value.trim='where.name' placeholder='请输入流程名称' allow-clear />
              </a-form-item>
              <a-form-item class='ele-text-center'>
                <a-space>
                  <a-button type='primary' @click='reload'>查询</a-button>
                  <a-button @click='reset'>重置</a-button>
                </a-space>
              </a-form-item>
            </a-row>
          </a-form>
        </a-card>
      </div>

      <!-- 表格 -->
      <div>
        <a-card :bordered='false'>
          <ele-pro-table
            ref='table'
            row-key='id'
            :datasource='url'
            :columns='columns'
            :where='where'
            v-model:selection='selection'
            :scroll="{ x: 'max-content' }"
            :needPage='false'
            :response="{
            dataName: 'data'
          }"
          >
            <!-- table上边工具栏 -->
            <template #toolbar>
              <a-space>
                <a-button type='primary' @click='openEdit()'>
                  <template #icon>
                    <plus-outlined />
                  </template>
                  <span>新建模型</span>
                </a-button>
                <a-upload
                  accept='.bpmn,.bpmn20.xml'
                  name='file'
                  :multiple='true'
                  :customRequest='importModel'
                  :showUploadList='false'
                >
                  <a-button>
                    <template #icon>
                      <UploadOutlined />
                    </template>
                    <span>导入模型</span></a-button>
                </a-upload>
              </a-space>
            </template>

            <!-- 版本 -->
            <template #version='{ record }'>
              <a @click='openVersion(record)'>V{{ record.version }}.0</a>
            </template>

            <!-- table操作栏按钮 -->
            <template #action='{ record }'>
              <a-space>
                <a @click='openDesign(record)'>设计</a>
                <a-divider type='vertical' />
                <a @click='deployForm(record)'>部署</a>
                <a-divider type='vertical' />
                <a-dropdown>
                  <a class='ant-dropdown-link' @click.prevent>
                    更多
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a @click='modelPreview(record)'>预览</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click='openEdit(record)'>修改</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a-popconfirm title='确定要删除此记录吗？' @confirm='remove(record)'>
                          <a class='ele-text-danger'>删除</a>
                        </a-popconfirm>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </ele-pro-table>
        </a-card>
      </div>
      <!--编码和新增模型-->
      <model-edit v-model:visible='showEdit' :data='current' @done='reload'></model-edit>

      <!--预览界面-->
      <model-design ref='modelDesign' />

      <!--部署流程-->
      <model-deployment ref='modelDeployment' @done='reload' />

      <!--流程预览xml-->
      <model-preview ref='preview' />
    </div>

    <!--版本管理界面-->
    <div class='ele-body' v-show='versionShow'>
      <a-card :bordered='false'>
        <model-version ref='version' @done='closeVersion'></model-version>
      </a-card>
    </div>

  </div>
</template>

<script>
import { PlusOutlined, UploadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { ModelApi } from '@/api/workflow/ModelApi';
import ModelEdit from '@/views/workflow/model/model-edit';
import ModelDesign from '@/views/workflow/model/design';
import ModelDeployment from '@/views/workflow/model/deployment';
import ModelPreview from '@/views/workflow/model/preview';
import ModelVersion from '@/views/workflow/model/version';

export default {
  name: 'Category',
  components: {
    ModelVersion,
    ModelPreview,
    ModelDeployment,
    ModelDesign,
    ModelEdit,
    PlusOutlined,
    UploadOutlined,
    DownOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/flowableModel/list',
      // 表格列配置
      columns: [
        {
          key: 'index',
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '模型名称',
          dataIndex: 'name'
        },
        {
          title: '唯一编码',
          dataIndex: 'key'
        },
        {
          title: '版本',
          dataIndex: 'version',
          slots: { customRender: 'version' }
        },
        {
          title: '创建时间',
          dataIndex: 'created'
        },
        {
          title: '创建人',
          dataIndex: 'createdBy'
        },
        {
          title: '描述',
          dataIndex: 'description'
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
      showEdit: false,
      // 是否显示模型管理界面
      indexShow: true,
      // 是否显示版本管理界面
      versionShow: false
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 删除
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    async remove(row) {
      const result = await ModelApi.delete({ id: row.id });
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增或编辑弹窗
     *
     * @author stylefeng
     * @date 2021/06/25 22:17
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 导入模型
     *
     * @author fengshuonan
     * @date 2021/6/25 22:50
     */
    async importModel(data) {
      const formData = new FormData();
      formData.append('file', data.file);
      let result = await ModelApi.modelImportModel(formData);
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 打开设计器页面
     *
     * @author fengshuonan
     * @date 2021/6/26 10:26
     */
    openDesign(record) {
      this.$refs.modelDesign.initModel(record);
    },

    /**
     * 部署流程
     *
     * @author fengshuonan
     * @date 2021/6/26 10:46
     */
    deployForm(record) {
      this.$refs.modelDeployment.initModel(record);
    },

    /**
     * 流程预览
     *
     * @author fengshuonan
     * @date 2021/6/26 10:46
     */
    modelPreview(record) {
      this.$refs.preview.initModel(record);
    },

    /**
     * 打开version界面
     *
     * @author fengshuonan
     * @date 2021/6/26 12:49
     */
    openVersion(record) {
      this.indexShow = false;
      this.versionShow = true;
      this.$refs.version.openVersion(record);
    },

    /**
     * 关闭version界面
     *
     * @author fengshuonan
     * @date 2021/6/26 12:23
     */
    closeVersion() {
      this.indexShow = true;
      this.versionShow = false;
      this.reload();
    }
  }
};
</script>
