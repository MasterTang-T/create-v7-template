<template>
  <div class='ele-body'>

    <a-row style='margin-bottom: 10px'>
      <a-col :span='4' :offset='10'>
        <div>
          <a-radio-group v-model:value='migrationType' size='large'>
            <a-radio-button value='1'>导出</a-radio-button>
            <a-radio-button value='2'>导入</a-radio-button>
          </a-radio-group>
        </div>
      </a-col>
    </a-row>

    <div v-show='migrationType === "1"'>
      <a-row>
        <a-col :span='24'>
          <div>
            <a-select
              mode='multiple'
              :maxTagCount='5'
              :allowClear='true'
              :showSearch='true'
              v-model:value='appAndModuleNameList'
              placeholder='请选择迁移模块'
              style='width: 100%'>
              <template #dropdownRender='{ menuNode: menu }'>
                <v-nodes :vnodes='menu' />
                <a-divider style='margin: 4px 0;' />
                <div style='padding: 4px 8px; cursor: pointer;' @mousedown='e => e.preventDefault()'>
                  <a-button type='link' @click='selectAll'>全选</a-button>
                  <a-button type='link' @click='clearAll'>清空</a-button>
                </div>
              </template>

              <a-select-opt-group
                v-for='item in values'
                :key='item.appName'
                :label='item.appName'>
                <a-select-option
                  v-for='moduleName in item.moduleNames'
                  :key='item.appName+"#"+moduleName'
                  :value='item.appName+"#"+moduleName'>{{ moduleName }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
        </a-col>
      </a-row>
      <a-row style='margin-top: 20px'>
        <a-col :span='4' :offset='10'>
          <div>
            <a-button type='primary' shape='round' size='large' @click='download'>
              <template #icon>
                <DownloadOutlined />
                下载迁移文件
              </template>
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div v-show='migrationType === "2"'>
      <a-row>
        <a-col :span='24'>
          <div>
            <a-upload-dragger
              accept='application/json'
              v-model:fileList='fileList'
              name='file'
              :before-upload='beforeUpload'
            >
              <p class='ant-upload-drag-icon'>
                <inbox-outlined></inbox-outlined>
              </p>
              <p class='ant-upload-text'>单击或拖动文件到此区域进行上传</p>
            </a-upload-dragger>
          </div>
        </a-col>
      </a-row>

      <a-row style='margin-top: 10px'>
        <a-col :span='4' :offset='10'>
          <div>
            <a-radio-group v-model:value='type'>
              <a-tooltip>
                <template #title>如果数据库中已存在则替换掉数据库中的数据</template>
                <a-radio value='FULL'>全量导入</a-radio>
              </a-tooltip>
              <a-tooltip>
                <template #title>只新增数据库中不存在的数据</template>
                <a-radio value='INCREMENTAL'>增量导入</a-radio>
              </a-tooltip>
            </a-radio-group>
          </div>
        </a-col>
      </a-row>

      <a-row style='margin-top: 10px'>
        <a-col :span='4' :offset='10'>
          <div>
            <a-button type='primary' shape='round' size='large' @click='submit'>
              <template #icon>
                <UploadOutlined />
                开始导入
              </template>
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>

  </div>
</template>

<script>
import { MigrationApi } from '@/api/MigrationApi';
import { reactive, toRefs } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default {
  name: 'migrationList',
  components: {
    InboxOutlined,
    VNodes: (_, { attrs }) => {
      return attrs.vnodes;
    }
  },
  setup() {

    const data = reactive({
      // 应用和模块名称
      appAndModuleNameList: [],
      // 下拉选择列表
      values: [],
      // 导入类型，默认全量导入
      type: 'FULL',
      // 上传文件
      file: null,
      // 迁移类型 1-导出，2-导入
      migrationType: '1',
      // 文件列表
      fileList: []
    });

    MigrationApi.getAllMigrationList().then((res) => {
      for (let item of res.data) {
        data.values.push(item);
      }
    });

    // 下载事件
    const download = () => {
      if (data.appAndModuleNameList.length === 0) {
        message.error('请选择迁移模块！');
        return;
      }
      MigrationApi.migrationSelectData({ appAndModuleNameList: data.appAndModuleNameList }).then((res) => {
        if (res.code === '00000') {
          let blob = new Blob([res.data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
          a.download = new Date().getTime() + '数据迁移.json';
          a.href = window.URL.createObjectURL(blob);
          a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
          e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(e);
        }
      });
    };

    const beforeUpload = file => {
      if (file.type !== 'application/json') {
        message.error('请上传正确的迁移文件!(只允许上传json文件)');
        data.fileList = [];
        data.file = null;
        return true;
      }
      data.fileList[0] = file;
      data.file = file;
      return false;
    };

    // 提交事件
    const submit = () => {
      if (!data.file) {
        message.error('请先选择迁移文件!');
        return;
      }
      const formData = new FormData();
      formData.set('file', data.file);
      formData.set('type', data.type);
      MigrationApi.restoreData(formData).then((res) => {
        if (res.code === '00000') {
          message.success('迁移成功！');
        } else {
          message.error('迁移失败!' + res.message);
        }
      });
    };

    // 全选
    const selectAll = () => {
      const arr = [];
      (data.values).forEach(item => {
        item.moduleNames.forEach(module => {
          arr.push(item.appName + '#' + module);
        });
      });

      data.appAndModuleNameList = arr;
    };

    // 清空
    const clearAll = () => {
      data.appAndModuleNameList = [];
    };

    return {
      ...toRefs(data),
      download,
      submit,
      selectAll,
      clearAll,
      beforeUpload
    };
  }
};
</script>

<style scoped>

</style>
