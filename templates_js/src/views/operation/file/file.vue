<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="存储位置:">
              <a-select v-model:value="where.fileLocation" style="width: 205px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="4">本地</a-select-option>
                <a-select-option value="1">阿里云</a-select-option>
                <a-select-option value="2">腾讯云</a-select-option>
                <a-select-option value="3">minio</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="文件名称:">
              <a-input v-model:value.trim="where.fileOriginName" allow-clear />
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
        <ele-pro-table ref="table" row-key="fileId" :datasource="url" :columns="columns" :where="where" :scroll="{ x: 'max-content' }">
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-upload name="file" :action="FileUploadUrl" :headers="headers" @change="reload" :showUploadList="false">
              <a-button type="primary">
                <template #icon>
                  <CloudUploadOutlined />
                </template>
                <span>上传图片</span>
              </a-button>
            </a-upload>
          </template>

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="download(record)">下载</a>
              <a-divider type="vertical" />
              <a @click="detail(record)">详情</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除此文件吗？" @confirm="remove(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>

          <!-- table存储位置列 -->
          <template #fileLocation="{ record }">
            <a-tag color="orange" v-if="record.fileLocation === 1">阿里云</a-tag>
            <a-tag color="blue" v-if="record.fileLocation === 2">腾讯云</a-tag>
            <a-tag color="red" v-if="record.fileLocation === 3">minio</a-tag>
            <a-tag color="green" v-if="record.fileLocation === 4">本地</a-tag>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <file-detail v-model:visible="showEdit" :data="current" />
</template>

<script>
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { FileApi, FileUploadUrl } from '@/api/FileApi';
import FileDetail from '@/views/operation/file/file-detail';
import setting from '@/config/setting';

export default {
  name: 'FileManager',
  components: {
    FileDetail,
    CloudUploadOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/sysFileInfo/fileInfoListPage',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '文件id',
          dataIndex: 'fileId'
        },
        {
          title: '文件名称',
          dataIndex: 'fileOriginName'
        },
        {
          title: '存储位置',
          dataIndex: 'fileLocation',
          slots: { customRender: 'fileLocation' }
        },
        {
          title: '是否机密',
          dataIndex: 'secretFlag',
          customRender: function({ text }) {
            if ('Y' === text) {
              return '是';
            } else {
              return '否';
            }
          }
        },
        {
          title: '文件大小',
          dataIndex: 'fileSizeInfo'
        },
        {
          title: '文件后缀',
          dataIndex: 'fileSuffix'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '创建人',
          dataIndex: 'createUserName'
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 上传文件的url
      FileUploadUrl: `/api${FileUploadUrl}?secretFlag=N`,
      // 上传文件时候要带header
      headers: {
        Authorization: setting.takeToken()
      }
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
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await FileApi.delete({ fileCode: row.fileCode });
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 下载文件
     *
     * @author fengshuonan
     * @date 2021/4/12 22:11
     */
    download(row) {
      FileApi.download({
        fileId: row.fileId,
        secretFlag: row.secretFlag,
        token: setting.takeToken()
      });
    },

    /**
     * 打开详情界面
     *
     * @author fengshuonan
     * @date 2021/4/12 22:29
     */
    detail(row) {
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

/*重写顶部搜索表单的样式*/
.ant-form-item {
  margin-bottom: 0;
}
</style>
