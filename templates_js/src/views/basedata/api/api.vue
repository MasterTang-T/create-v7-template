<template>
  <div class='ele-body'>
    <a-row :gutter='16'>
      <!-- 左侧接口树 -->
      <a-col :lg='5' :md='10' :sm='24' :xs='24'>
        <a-card :bordered='false' style='overflow: auto;height: 1100px'>
          <a-space size='10'>
            <a-button type='primary' size='small' @click='isShowSettingGlobalToken=true'>全局Token</a-button>
            <a-modal
              v-model:visible='isShowSettingGlobalToken'
              title='设置全局Token'
              @ok='isShowSettingGlobalToken=false'
            >
              <a-input v-model:value='globalToken' allow-clear></a-input>
            </a-modal>
            <a-button style='margin: 5px' type='primary' size='small' @click='isShowSettingGlobalBaseUrl=true'>基础URL</a-button>
            <a-modal
              v-model:visible='isShowSettingGlobalBaseUrl'
              title='设置BaseUrl'
              @ok='isShowSettingGlobalBaseUrl=false'
            >
              <a-input v-model:value='globalBaseUrl' allow-clear></a-input>
            </a-modal>
          </a-space>

          <!-- 搜索框-->
          <div style='margin-top: 15px;'>
            <a-input-search v-model:value='apiGroupTreeSearchValue' style='margin-bottom: 8px' placeholder='请输入关键字' allow-clear @search='onApiGroupTreeSearchSearch' />
          </div>

          <a-spin tip='Loading...' :spinning='apiGroupTreeLoading' :delay='100'>
            <a-directory-tree
              :show-icon='true'
              v-model:selectedKeys='currentSelectKeys'
              v-model:expanded-keys='expandedKeys'
              @select='selectNode'
              :tree-data='apiData'
              :replace-fields="{ children: 'children', title: 'name', key: 'nodeId', value: 'nodeId' }"
              style='margin-top: 15px'
            >

              <template #title='{name:title,url:url}'>
                <a-tooltip :mouse-enter-delay='0.3'>
                  <template #title>{{ url }}</template>
                  <span>{{ title }}</span>
                </a-tooltip>
              </template>

              <!--资源图标-->
              <template #resource>
                <LinkOutlined />
              </template>
            </a-directory-tree>
          </a-spin>

        </a-card>
      </a-col>

      <!--右侧接口详情-->
      <a-col :lg='19' :md='14' :sm='24' :xs='24'>
        <div class='block-interval'>
          <a-card :bordered='false' style='overflow: auto'>

            <a-row>
              <a-col :span='20'>
                <a-input v-model:value='form.url'>

                  <!--请求方式-->
                  <template #addonBefore>
                    <a-select v-model:value='apiResourceDetail.requestMethod' style='width: 90px'>
                      <a-select-option value='GET'>GET</a-select-option>
                      <a-select-option value='POST'>POST</a-select-option>
                    </a-select>
                  </template>

                </a-input>
              </a-col>

              <!--发送按钮-->
              <a-col :span='4'>
                <a-button type='primary' @click='sendButtonClick'>Send</a-button>
              </a-col>

            </a-row>

            <a-row>
              <a-tabs v-model:activeKey='tabsActiveKey'>

                <a-tab-pane key='params' tab='在线调试'>
                  <a-form ref='formRef' :model='form'>
                    <a-table
                      style='height: 500px;overflow: auto'
                      :columns='requestParamColumns'
                      :pagination='false'
                      :data-source='form.tableResourceRequestFieldList'
                      row-key='fieldId'
                      size='middle'
                    >

                      <!--参数-->
                      <template #fieldCode='{ record,index }'>
                        <a-form-item
                          :required='fieldRequiredFlag(record.fieldRequired)'
                          label=' '
                          :colon='false'
                          :name="['tableResourceRequestFieldList',index,'fieldCode']"
                          :rules='{required:record.fieldRequired,message:"请填写参数名",trigger:"blur"}'
                          :label-col='{span:1}'>
                          <a-input style='width: 200px' v-model:value='record.fieldCode' allow-clear />
                        </a-form-item>
                      </template>

                      <!--字段值-->
                      <template #fieldValue='{ record,index }'>
                        <a-form-item
                          :colon='false'
                          :label-col='{span:1}'
                          :name="['tableResourceRequestFieldList', index,'fieldValue']"
                          :rules='{required:record.fieldRequired, message:"请填写值",trigger:"blur"}'>
                          <a-input style='width: 200px' v-model:value='record.fieldValue' allow-clear v-if='record.fieldType === "string"' />
                          <a-textarea style='width: 200px' v-model:value='record.fieldValue' allow-clear v-if='record.fieldType !== "string"' />
                        </a-form-item>
                      </template>

                      <!--字段中文说明-->
                      <template #fieldName='{ record }'>
                        <span style='width: 200px'>{{ record.fieldName }}</span>
                      </template>

                    </a-table>
                  </a-form>

                  <a-divider orientation='left'>响应结果</a-divider>
                  <!--json预览-->
                  <div style='height: 400px;overflow: auto'>
                    <json-viewer :expand-depth='10' v-if='requestResponseJson' :value='requestResponseJson' copyable boxed sort expanded />
                  </div>

                </a-tab-pane>

                <a-tab-pane key='header' tab='请求头' force-render>

                  <a-form ref='headerFormRef' :model='headerForm'>
                    <a-button type='primary' @click='headerFormAddClick'>
                      添加请求头
                    </a-button>

                    <a-table
                      style='height: 500px;overflow: auto'
                      :columns='[
                        {
                          title: "key",
                          dataIndex: "field",
                          width: 300,
                          slots: { customRender: "field" }
                        },
                        {
                          title: "value",
                          dataIndex: "value",
                          width: 300,
                          slots: { customRender: "value" }
                        },
                        {
                          title: "操作",
                          dataIndex: "action",
                          width: 100,
                          slots: { customRender: "action" }
                        },
                      ]'
                      :pagination='false'
                      :data-source='headerForm.headerFieldList'
                      :row-key='(record,index)=>index'
                      size='middle'
                    >

                      <!--key-->
                      <template #field='{ record,index }'>
                        <a-form-item
                          :colon='false'
                          :label-col='{span:1}'
                          :name="['headerFieldList',index,'field']">
                          <a-input style='width: 300px' v-model:value='record.field' allow-clear />
                        </a-form-item>
                      </template>

                      <!--value-->
                      <template #value='{ record,index }'>
                        <a-form-item
                          :colon='false'
                          :label-col='{span:1}'
                          :name="['headerFieldList',index,'value']">
                          <a-input style='width: 300px' v-model:value='record.value' allow-clear />
                        </a-form-item>
                      </template>

                      <!--操作-->
                      <template #action='{index}'>
                        <a-form-item>
                          <a-button danger @click='headerFormRemoveClick(index)'>移除</a-button>
                        </a-form-item>
                      </template>

                    </a-table>
                  </a-form>

                </a-tab-pane>
                <a-tab-pane key='paramDetail' tab='请求/响应参数详情参考' force-render>
                  <!--请求字段信息-->
                  <a-divider orientation='left'>请求字段信息</a-divider>
                  <a-row>
                    <a-table
                      style='width:100%;height: 500px;overflow: auto'
                      :dataSource='tableResourceRequestFieldList'
                      rowKey='fieldCode'
                      :pagination='false'
                      :columns='requestTableColumns'>

                      <!--序号-->
                      <template #index='{index}'>
                        <div style='width: 30px;'>{{ index + 1 }}</div>
                      </template>

                      <!--字段编码-->
                      <template #fieldCode='{ record }'>
                        <a-select style='width: 200px' v-model:value='record.fieldCode'>
                          <a-select-option
                            v-for='item in selectResourceRequestFieldList'
                            :key='item.fieldCode'
                            :value='item.fieldCode'>
                            {{ item.fieldCode }}
                          </a-select-option>
                        </a-select>
                      </template>

                      <!--字段名称-->
                      <template #fieldName='{ record }'>
                        <a-input style='width: 200px' v-model:value='record.fieldName' />
                      </template>

                      <!--字段类型-->
                      <template #fieldType='{ record }'>
                        <a-select style='width: 100px' v-model:value='record.fieldType'>
                          <a-select-option value='string'>string</a-select-option>
                          <a-select-option value='file'>file</a-select-option>
                          <a-select-option value='object'>object</a-select-option>
                          <a-select-option value='list'>list</a-select-option>
                        </a-select>
                      </template>

                      <!--是否必填-->
                      <template #fieldRequired='{ record }'>
                        <a-checkbox style='width: 80px' :checked='fieldRequiredFlag(record.fieldRequired)'></a-checkbox>
                      </template>

                    </a-table>
                  </a-row>

                  <!--响应字段信息-->
                  <a-divider orientation='left'>响应字段信息</a-divider>
                  <a-row>
                    <a-table
                      style='width:100%;height: 500px;overflow: auto'
                      :dataSource='tableResourceResponseFieldList'
                      rowKey='fieldCode'
                      :pagination='false'
                      :columns='responseTableColumns'>

                      <!--序号-->
                      <template #index='{index}'>
                        <div style='width: 30px;'>{{ index + 1 }}</div>
                      </template>

                      <!--字段编码-->
                      <template #fieldCode='{ record }'>
                        <a-select style='width: 200px' v-model:value='record.fieldCode'>
                          <a-select-option
                            v-for='item in selectResourceResponseFieldList'
                            :key='item.fieldCode'
                            :value='item.fieldCode'>
                            {{ item.fieldCode }}
                          </a-select-option>
                        </a-select>
                      </template>

                      <!--字段名称-->
                      <template #fieldName='{ record }'>
                        <a-input style='width: 200px' v-model:value='record.fieldName' />
                      </template>

                      <!--字段类型-->
                      <template #fieldType='{ record }'>
                        <a-select style='width: 100px' v-model:value='record.fieldType'>
                          <a-select-option value='string'>string</a-select-option>
                          <a-select-option value='file'>file</a-select-option>
                        </a-select>
                      </template>

                    </a-table>
                  </a-row>
                </a-tab-pane>


              </a-tabs>
            </a-row>

          </a-card>
        </div>
      </a-col>

    </a-row>

  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue';
import { InterfaceApi } from '@/api/InterfaceApi';
import { ApiGroupApi } from '@/api/ApiGroupApi';
import { ApiResourceApi } from '@/api/ApiResourceApi';
import { LinkOutlined } from '@ant-design/icons-vue';
import { JsonViewer } from 'vue3-json-viewer';
import setting from '@/config/setting';
import { message } from 'ant-design-vue';

export default {
  name: 'ApiManager',
  components: {
    LinkOutlined,
    JsonViewer
  },
  setup() {
    // ref
    let formRef = ref(null);

    // data
    let data = reactive({
      // 资源请求下拉字段列表
      selectResourceRequestFieldList: [],
      // 资源响应下拉字段列表
      selectResourceResponseFieldList: [],
      // 请求字段表字段列
      requestTableColumns: [{
        key: 'index',
        dataIndex: 'index',
        width: 100,
        title: '序号',
        slots: { customRender: 'index' }
      },
        {
          title: '字段编码',
          dataIndex: 'fieldCode',
          key: 'fieldCode',
          width: 200,
          slots: { customRender: 'fieldCode' }
        }, {
          title: '字段名称',
          dataIndex: 'fieldName',
          key: 'fieldName',
          width: 200,
          slots: { customRender: 'fieldName' }
        }, {
          title: '字段类型',
          dataIndex: 'fieldType',
          key: 'fieldType',
          width: 150,
          slots: { customRender: 'fieldType' }
        },
        {
          title: '是否必填',
          dataIndex: 'fieldRequired',
          key: 'fieldRequired',
          width: 150,
          slots: { customRender: 'fieldRequired' }
        }
      ],
      // 响应字段表字段列
      responseTableColumns: [{
        key: 'index',
        dataIndex: 'index',
        width: 100,
        title: '序号',
        slots: { customRender: 'index' }
      },
        {
          title: '字段编码',
          dataIndex: 'fieldCode',
          key: 'fieldCode',
          width: 200,
          slots: { customRender: 'fieldCode' }
        }, {
          title: '字段名称',
          dataIndex: 'fieldName',
          key: 'fieldName',
          width: 200,
          slots: { customRender: 'fieldName' }
        }, {
          title: '字段类型',
          dataIndex: 'fieldType',
          key: 'fieldType',
          width: 100,
          slots: { customRender: 'fieldType' }
        }
      ],
      // 资源请求表格字段列表
      tableResourceRequestFieldList: [],
      // 资源响应表格字段列表
      tableResourceResponseFieldList: [],
      // 接口树搜索
      apiGroupTreeLoading: true,
      apiGroupTreeSearchValue: '',
      // 是否显示设置全局请求token弹窗
      isShowSettingGlobalToken: false,
      // 是否显示设置全局请求baseUrl弹窗
      isShowSettingGlobalBaseUrl: false,
      // 调试页 全局请求token
      globalToken: setting.takeToken(),
      // 调试页 全局请求baseUrl
      globalBaseUrl: 'http://localhost:8080',
      // 请求响应结果
      requestResponseJson: undefined,
      // 请求头 form
      headerForm: {
        // 请求头字段列表
        headerFieldList: []
      },
      // 选项卡选中 默认是请求参数选项卡选中
      tabsActiveKey: 'params',
      // 选中的接口详情
      apiResourceDetail: {},
      // 表单数据
      form: {
        // 资源请求表格字段列表
        tableResourceRequestFieldList: []
      },
      // 当前选择的节点
      currentSelectKeys: [],
      // api数据
      apiData: [],
      // 展开的节点
      expandedKeys: [],
      // 请求参数
      requestParamColumns: [
        {
          title: '参数',
          dataIndex: 'fieldCode',
          width: 200,
          slots: { customRender: 'fieldCode' }
        },
        {
          title: '值',
          dataIndex: 'fieldValue',
          width: 200,
          slots: { customRender: 'fieldValue' }
        },
        {
          title: '说明',
          dataIndex: 'fieldName',
          width: 200,
          slots: { customRender: 'fieldName' }
        },
        {
          title: '可能出现的验证提示',
          width: 200,
          dataIndex: 'fieldValidationMsg'
        }
      ],
      // 响应参数
      responseParamColumns: [
        {
          title: '中文名称',
          dataIndex: 'chineseName'
        },
        {
          title: '字段类型',
          dataIndex: 'fieldClassType'
        },
        {
          title: '字段名称',
          dataIndex: 'fieldName'
        },
        {
          title: '可能出现的参数错误提示',
          dataIndex: 'validationMessages'
        }
      ]
    });

    // 获取接口分组树
    data.apiGroupTreeLoading = true;
    ApiGroupApi.apiGroupTree({ groupName: data.apiGroupTreeSearchValue }).then(res => {
      data.apiData = res;
      data.expandedKeys = ['1000000000000000000'];
    }).finally(() => {
      data.apiGroupTreeLoading = false;
    });

    /**
     * 选择节点时候触发的事件
     */
    const selectNode = async (selectedKeys, metadata) => {
      if (metadata.node.children.length === 0) {
        if (metadata.selectedNodes.length === 1) {
          let selectedNode = metadata.selectedNodes[0];

          let resourceCode = selectedNode.dataRef.data.resourceCode;
          if (resourceCode) {
            // 获取接口详情
            data.form = await InterfaceApi.getDetail({ resourceCode });

            // 设置全局请求路径
            data.form.url = data.globalBaseUrl + data.form.url;

            // 设置默认请求头
            data.headerForm.headerFieldList = [];
            data.headerForm.headerFieldList.push({
              field: setting.tokenHeaderName,
              value: ''
            });

            // 获取资源所有字段列表
            ApiResourceApi.allField({ resourceCode }).then(res => {
              let requestFieldConversion = resourceFieldConversion(res);
              data.selectResourceRequestFieldList = requestFieldConversion.requestFieldList;
              data.selectResourceResponseFieldList = requestFieldConversion.responseFieldList;
            });

          }

          let apiResourceId = selectedNode.dataRef.data.apiResourceId;
          if (apiResourceId) {
            ApiResourceApi.detail({ apiResourceId }).then(res => {
              data.apiResourceDetail = res;
              data.form.tableResourceRequestFieldList = resourceFieldConversion(res.apiResourceFieldList).requestFieldList;

              // 处理必填字段
              let arr = data.form.tableResourceRequestFieldList;
              arr.forEach((item, index, arr) => {
                arr[index].fieldRequired = item.fieldRequired === 'Y';
              });

              data.tableResourceRequestFieldList = resourceFieldConversion(res.apiResourceFieldList).requestFieldList;
              data.tableResourceResponseFieldList = resourceFieldConversion(res.apiResourceFieldList).responseFieldList;

              // 回显上一次请求内容
              let lastRequestContent = res.lastRequestContent;
              if (lastRequestContent) {
                let lastRequestContentObj = JSON.parse(lastRequestContent);
                if (lastRequestContentObj) {
                  data.form.tableResourceRequestFieldList.forEach(item => {
                    let value = lastRequestContentObj[item.fieldCode];
                    if (value) {
                      if (value.length > 0) {
                        item.fieldValue = value;
                      }
                    }
                  });
                }
              }

              // 回显上一次请求头中的内容
              let lastRequestHeader = res.lastRequestHeader;
              if (lastRequestHeader) {
                let lastRequestHeaderObj = JSON.parse(lastRequestHeader);
                if (lastRequestHeaderObj) {
                  data.headerForm.headerFieldList = [];
                  let keys = Object.keys(lastRequestHeaderObj);
                  keys.forEach(key => {
                    let value = lastRequestHeaderObj[key];
                    if (key === setting.tokenHeaderName) {
                      data.headerForm.headerFieldList.push({
                        field: key,
                        value: ''
                      });
                    } else {
                      data.headerForm.headerFieldList.push({
                        field: key,
                        value: value
                      });
                    }

                  });
                }
              }

              // 回显上一次响应的内容
              let lastResponseContent = res.lastResponseContent;
              if (lastResponseContent) {
                try {
                  data.requestResponseJson = JSON.parse(lastResponseContent);
                } catch (e) {
                  data.requestResponseJson = '';
                }
              }

            });
          }

          // 清除响应结果
          data.requestResponseJson = undefined;

        }

      }
    };

    // 资源字段转换
    const resourceFieldConversion = (apiResourceFieldList) => {
      let resourceField = {
        requestFieldList: [],
        responseFieldList: []
      };
      apiResourceFieldList.forEach(item => {
        // 判断资源字段类型是响应还是请求
        let fieldLocation = item.fieldLocation;
        if (fieldLocation === 'request') {
          resourceField.requestFieldList.push(item);
        }
        if (fieldLocation === 'response') {
          resourceField.responseFieldList.push(item);
        }

      });

      return resourceField;
    };

    // 发送请求按钮点击事件
    const sendButtonClick = async () => {
      // 验证请求表单是否填写
      await formRef.value.validate();

      let url = data.form.url;
      let requestMethod = data.apiResourceDetail.requestMethod;

      // 构建进行请求的请求体
      let reqData = {};
      data.form.tableResourceRequestFieldList.forEach(item => {

        // 用户这个字段啥也没输入，跳过这个字段
        if(!item.fieldValue){
          return;
        }

        // 数据如果是非string类型，则输入必须是json字符串，如果不是json字符串则提示用户从新输入
        if (item.fieldType !== 'string') {
          try {
            reqData[item.fieldCode] = JSON.parse(item.fieldValue);
          } catch (e) {
            const messageTip = item.fieldCode + '字段必须填写为标准json字符串';
            message.error(messageTip);
            throw(messageTip);
          }
        }else{
          // 其他类型，是string类型的直接赋值即可
          reqData[item.fieldCode] = item.fieldValue ? item.fieldValue : '';
        }
      });

      // 构建请求头
      let headerData = {};
      if (data.headerForm.headerFieldList.length === 0) {
        // 设置默认请求头
        data.headerForm.headerFieldList = [];
        data.headerForm.headerFieldList.push({
          field: setting.tokenHeaderName,
          value: ''
        });
      }
      data.headerForm.headerFieldList.forEach(item => {
        headerData[item.field] = item.value ? item.value : '';

        // 判断是否设置了全局token 如果接口中设置了token以接口中的为准
        if (item.field === setting.tokenHeaderName) {
          if (item.value.length === 0) {
            headerData[item.field] = data.globalToken;
          }
        }
      });


      let reqParam = {};
      reqParam.apiResourceId = data.apiResourceDetail.apiResourceId;
      reqParam.requestUrl = url;
      reqParam.requestMethod = requestMethod;
      reqParam.lastRequestHeader = headerData;
      reqParam.lastRequestContent = JSON.stringify(reqData);

      // 发送请求
      let resp = await ApiResourceApi.record(reqParam);
      let lastResponseContent = resp.data.lastResponseContent;
      try {
        data.requestResponseJson = JSON.parse(lastResponseContent);
      } catch (e) {
        data.requestResponseJson = lastResponseContent;
      }

    };

    // 添加请求头按钮点击事件
    const headerFormAddClick = () => {
      data.headerForm.headerFieldList.push({
        field: '',
        value: ''
      });
    };

    // 移除请求头按钮点击事件
    const headerFormRemoveClick = (index) => {
      data.headerForm.headerFieldList.splice(index, 1);
    };

    // 接口树搜索
    const onApiGroupTreeSearchSearch = async () => {
      // 获取接口树数据
      data.apiGroupTreeLoading = true;
      data.apiData = await ApiGroupApi.apiGroupTree({ groupName: data.apiGroupTreeSearchValue });
      data.expandedApiGroupTreeKeys = ['1000000000000000000'];
      data.apiGroupTreeLoading = false;
    };

    // 处理是否必填
    const fieldRequiredFlag = (fieldRequired) => {
      if (typeof fieldRequired === 'string') {
        return fieldRequired === 'Y';
      } else {
        return fieldRequired;
      }
    };

    return {
      ...toRefs(data),
      selectNode,
      resourceFieldConversion,
      sendButtonClick,
      headerFormAddClick,
      headerFormRemoveClick,
      onApiGroupTreeSearchSearch,
      formRef,
      fieldRequiredFlag
    };
  }
};
</script>

<style scoped></style>
