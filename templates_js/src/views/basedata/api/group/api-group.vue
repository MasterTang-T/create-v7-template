<template>
  <div class='ele-body'>
    <a-row :gutter='16'>
      <!-- 左侧资源树 -->
      <a-col :lg='6' :md='6' :sm='24' :xs='24'>
        <a-card title='资源树' :bordered='false' style='overflow: auto;height: 1000px'>
          <a-button type='primary' @click='openGenerateApi'>生成接口</a-button>

          <div style='margin-top: 15px;'>
            <a-input-search v-model:value='resourcesTreeSearchValue' style='margin-bottom: 8px' placeholder='请输入关键字' allow-clear @search='onResourcesTreeSearch' />
          </div>

          <a-spin tip='Loading...' :spinning='resourcesTreeLoading'>
            <a-directory-tree
              :tree-data='resourcesTreeData'
              v-model:selectedKeys='currentSelectResourcesTreeKeys'
              v-model:expanded-keys='expandedResourcesTreeKeys'
              :replace-fields="{ children: 'children', title: 'title', key: 'nodeId', value: 'nodeId' }"
              style='margin-top: 15px'>

              <template #title='{ nodeId: nodeId, title:title,url:url }'>
                <a-dropdown :trigger="['contextmenu']">

                  <span v-if='url===null'>{{ title }}</span>
                  <span v-else> <span>{{ title }} <span style='color: #ccc'>{{ url }}</span></span> </span>

                  <template #overlay>
                    <a-menu @click='({ key: menuKey }) => onResourcesTreeContextMenuClick(nodeId, menuKey)'>
                      <a-menu-item key='1'>生成接口</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>

              <!--资源图标-->
              <template #resource>
                <LinkOutlined />
              </template>

            </a-directory-tree>
          </a-spin>

        </a-card>
      </a-col>

      <!--中间接口树-->
      <a-col :lg='6' :md='10' :sm='24' :xs='24'>
        <div class='block-interval'>
          <a-card title='接口树' :bordered='false' style='overflow: auto;height: 1000px'>

            <a-space :size='10'>
              <a-tooltip placement='top'>
                <template #title>
                  <span>新增分组</span>
                </template>
                <a-button type='primary' @click='openAddApiGroupAddEdit'>
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  <span>新增</span>
                </a-button>
              </a-tooltip>

              <a-tooltip placement='top'>
                <template #title>
                  <span>修改分组</span>
                </template>
                <a-button type='default' @click='openEditApiGroupAddEdit'>
                  <template #icon>
                    <EditOutlined />
                  </template>
                  <span>修改</span>
                </a-button>
              </a-tooltip>

              <a-button danger @click='openDeleteApiGroupAddEdit'>
                <template #icon>
                  <DeleteOutlined />
                </template>
                <span>删除</span>
              </a-button>

            </a-space>

            <div style='margin-top: 15px;'>
              <a-input-search v-model:value='apiGroupTreeSearchValue' style='margin-bottom: 8px' placeholder='请输入关键字' allow-clear @search='onApiGroupTreeSearchSearch' />
            </div>

            <a-spin tip='Loading...' :spinning='apiGroupTreeLoading' :delay='1000'>
              <a-directory-tree
                draggable
                :show-icon='true'
                :tree-data='apiGroupTreeData'
                v-model:expanded-keys='expandedApiGroupTreeKeys'
                v-model:selectedKeys='currentSelectApiGroupTreeKeys'
                :replace-fields="{ children: 'children', title: 'name', key: 'nodeId', value: 'nodeId' }"
                style='margin-top: 15px'
                @drop='apiGroupTreeDrop'
                @select='apiGroupTreeSelect'
              >
                <template #title='{ nodeId: nodeId, name:title,type:type,url:url}'>
                  <a-dropdown :trigger="['contextmenu']">

                    <span v-if='url===null'>{{ title }}</span>
                    <span v-else> <span>{{ title }} <span style='color: #ccc'>{{ url }}</span></span> </span>

                    <template #overlay>
                      <a-menu @click='({ key: menuKey }) => onApiGroupTreeContextMenuClick(type,nodeId, menuKey)'>
                        <a-menu-item v-if='type==="1"' key='1'>新增分组</a-menu-item>
                        <a-menu-item v-if='type==="1"' key='2'>修改分组</a-menu-item>
                        <a-menu-item key='3'>删除{{ type === '1' ? '分组' : '资源' }}</a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>

                <!--资源图标-->
                <template #resource>
                  <LinkOutlined />
                </template>

              </a-directory-tree>
            </a-spin>

          </a-card>
        </div>
      </a-col>

      <!--右侧接口详情-->
      <a-col :lg='12' :md='10' :sm='24' :xs='24'>
        <div class='block-interval'>
          <a-card :bordered='false' style='overflow: auto;height: 1000px'>

            <a-form
              ref='resourceFormData'
              :model='resourceForm'
              :rules='resourceFormRules'>

              <a-form-item label='接口别名:' name='apiAlias'>
                <a-input style='width: 100%' v-model:value='resourceForm.apiAlias' placeholder='请输入接口别名' allow-clear @change='()=>saveResourceFormButtonDot=true' />
              </a-form-item>

              <a-space :size='10'>
                <a-button type='primary' @click='addResourceFieldList'>
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  <span>新增列</span>
                </a-button>

                <a-badge :dot='saveResourceFormButtonDot'>
                  <a-button type='primary' @click='saveResourceForm'>
                    <template #icon>
                      <SaveOutlined />
                    </template>
                    <span>保存</span>
                  </a-button>
                </a-badge>

                <a-button danger @click='resetResource'>
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                  <span>重置</span>
                </a-button>

              </a-space>

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
                    <a-select show-search @change='()=>saveResourceFormButtonDot=true' style='width: 200px' v-model:value='record.fieldCode'>
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
                    <a-input @change='()=>saveResourceFormButtonDot=true' style='width: 200px' v-model:value='record.fieldName' />
                  </template>

                  <!--字段类型-->
                  <template #fieldType='{ record }'>
                    <a-select @change='()=>saveResourceFormButtonDot=true' style='width: 100px' v-model:value='record.fieldType'>
                      <a-select-option value='string'>string</a-select-option>
                      <a-select-option value='file'>file</a-select-option>
                      <a-select-option value='object'>object</a-select-option>
                      <a-select-option value='list'>list</a-select-option>
                    </a-select>
                  </template>

                  <!--是否必填-->
                  <template #fieldRequired='{ record }'>
                    <a-checkbox @change='()=>saveResourceFormButtonDot=true' style='width: 80px' v-model:checked='record.fieldRequired'></a-checkbox>
                  </template>

                  <!-- table操作栏按钮 -->
                  <template #action='{ record }'>
                    <a-space>
                      <a-button danger size='small' @click='deleteResourceField(record)'>删除字段</a-button>
                    </a-space>
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
                    <a-select show-search style='width: 200px' v-model:value='record.fieldCode'>
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

            </a-form>

          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>

  <!--生成接口弹窗-->
  <generate-api
    v-model:visible='isShowGenerateApi'
    :resource-code='currentSelectResourcesTreeKeys.toString()'
    @done='refreshApiGroupTreeData'>
  </generate-api>

  <!--API分组新增修改弹窗-->
  <api-group-add-edit
    v-model:visible='isShowApiGroupAddEdit'
    :group-id='currentSelectApiGroupNodeGroupId'
    :group-pid='currentSelectApiGroupNodeGroupPid'
    @done='refreshApiGroupTreeData'></api-group-add-edit>

</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { InterfaceApi } from '@/api/InterfaceApi';
import GenerateApi from './generate-api';
import ApiGroupAddEdit from './api-group-add-edit';
import { ApiGroupApi } from '@/api/ApiGroupApi';
import { message, Modal } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined, EditOutlined, ReloadOutlined, SaveOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { ApiResourceApi } from '@/api/ApiResourceApi';

export default {
  name: 'ApiManageGroup',
  components: {
    GenerateApi,
    ApiGroupAddEdit,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    ReloadOutlined,
    SaveOutlined,
    LinkOutlined
  },
  async created() {
    // 获取资源树数据
    this.resourcesTreeLoading = true;
    this.resourcesTreeData = await InterfaceApi.getResourceTree();
    this.expandedResourcesTreeKeys = ['guns'];
    this.resourcesTreeLoading = false;

    // 获取接口树数据
    this.refreshApiGroupTreeData();
    this.expandedApiGroupTreeKeys = ['1000000000000000000'];
  },
  setup() {
    // ref
    let resourceFormData = ref(null);

    // data
    const data = reactive({
      // 接口树搜索
      apiGroupTreeSearchValue: '',
      // 接口树加载
      apiGroupTreeLoading: false,
      // 资源树加载
      resourcesTreeLoading: false,
      // 资源树搜索
      resourcesTreeSearchValue: '',
      // 当前选择的资源树节点
      currentSelectResourcesTreeKeys: [],
      // 展开的节点
      expandedResourcesTreeKeys: [],
      // 资源树数据
      resourcesTreeData: [],
      // 是否展示生成接口弹窗
      isShowGenerateApi: false,
      // 接口树数据
      apiGroupTreeData: [],
      // 是否展示接口分组新增编辑弹窗
      isShowApiGroupAddEdit: false,
      // 当前选择的接口分组树节点key
      currentSelectApiGroupTreeKeys: [],
      // 当前选择的接口树节点
      currentSelectApiGroupNode: undefined,
      // 当前选择的接口树节点分组id
      currentSelectApiGroupNodeGroupId: undefined,
      // 当前选择的接口树节点父级分组id
      currentSelectApiGroupNodeGroupPid: undefined,
      // 接口树展开的节点
      expandedApiGroupTreeKeys: [],
      // 资源表单
      resourceForm: {
        url: ''
      },
      // 资源表单验证规则
      resourceFormRules: {},
      // 资源请求表格字段列表
      tableResourceRequestFieldList: [],
      // 资源响应表格字段列表
      tableResourceResponseFieldList: [],
      // 资源请求下拉字段列表
      selectResourceRequestFieldList: [],
      // 资源响应下拉字段列表
      selectResourceResponseFieldList: [],
      // 保存按钮加载状态
      saveResourceFormLoading: false,
      // 保存按钮小红点
      saveResourceFormButtonDot: false,
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
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          slots: { customRender: 'action' }
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
      ]
    });

    // 刷新接口树数据
    const refreshApiGroupTreeData = async () => {
      // 获取接口树数据
      data.apiGroupTreeLoading = true;
      data.apiGroupTreeData = await ApiGroupApi.apiGroupTree();
      data.apiGroupTreeLoading = false;
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
          // 处理下字段值
          item.fieldRequired = item.fieldRequired === 'Y';

          resourceField.requestFieldList.push(item);
        }
        if (fieldLocation === 'response') {
          // 处理下字段值
          item.fieldRequired = item.fieldRequired === 'Y';

          resourceField.responseFieldList.push(item);
        }
      });

      return resourceField;
    };

    // 接口树节点点击事件
    const apiGroupTreeSelect = (selectedKeys, event) => {
      let selectedNodes = event.selectedNodes;

      if (selectedNodes.length > 0) {
        let selectedNode = selectedNodes[0].dataRef;

        data.currentSelectApiGroupTreeKeys = [];
        data.currentSelectApiGroupTreeKeys.push(selectedNode.nodeId);
        data.currentSelectApiGroupNode = selectedNode;

        // 判断当前接口树节点类型
        let type = selectedNode.type;
        if (type === '2') {
          data.saveResourceFormButtonDot = false;

          let apiResourceId = selectedNode.data.apiResourceId;
          let resourceCode = selectedNode.data.resourceCode;

          // 获取api资源详情
          apiResourceDetail(apiResourceId, resourceCode);

        }

      }
    };

    // 获取api资源详情
    const apiResourceDetail = (apiResourceId, resourceCode) => {

      // 获取资源详情
      ApiResourceApi.detail({ apiResourceId }).then(res => {

        data.resourceForm = res;
        let apiResourceFieldList = res.apiResourceFieldList;

        // 资源字段转换
        let requestFieldConversion = resourceFieldConversion(apiResourceFieldList);

        data.tableResourceRequestFieldList = requestFieldConversion.requestFieldList;
        data.tableResourceResponseFieldList = requestFieldConversion.responseFieldList;

      });

      // 获取资源所有字段列表
      ApiResourceApi.allField({ resourceCode }).then(res => {

        let requestFieldConversion = resourceFieldConversion(res);
        data.selectResourceRequestFieldList = requestFieldConversion.requestFieldList;
        data.selectResourceResponseFieldList = requestFieldConversion.responseFieldList;
      });

    };

    // 生成接口按钮点击事件
    const openGenerateApi = () => {
      let currentSelectResourcesTreeKeys = data.currentSelectResourcesTreeKeys;
      if (currentSelectResourcesTreeKeys) {
        if (currentSelectResourcesTreeKeys.length > 0) {
          data.isShowGenerateApi = true;
          return;
        }
      }
      message.error('请选择资源');

    };

    // 新增分组按钮点击事件
    const openAddApiGroupAddEdit = () => {
      let currentSelectApiGroupNode = data.currentSelectApiGroupNode;
      if (currentSelectApiGroupNode) {
        data.currentSelectApiGroupNodeGroupPid = currentSelectApiGroupNode.nodeId;
      } else {
        // 设置默认的父级分组id为顶级节点
        data.currentSelectApiGroupNodeGroupPid = '1000000000000000000';
      }
      data.currentSelectApiGroupNodeGroupId = undefined;
      data.isShowApiGroupAddEdit = true;
    };

    // 修改分组按钮点击事件
    const openEditApiGroupAddEdit = () => {
      let currentSelectApiGroupNode = data.currentSelectApiGroupNode;
      if (currentSelectApiGroupNode) {
        let nodeId = currentSelectApiGroupNode.nodeId;
        if (nodeId === '1000000000000000000') {
          message.error('顶级节点无法编辑，请重新选择!');
        } else {
          if (currentSelectApiGroupNode.type === '2') {
            message.error('该节点是数据节点,请重新选择!');
          } else {
            data.currentSelectApiGroupNodeGroupId = nodeId;
            data.currentSelectApiGroupNodeGroupPid = nodeId;
            data.isShowApiGroupAddEdit = true;
          }
        }
      } else {
        message.error('请选择接口分组');
      }
    };

    // 删除分组按钮点击事件
    const openDeleteApiGroupAddEdit = () => {
      let currentSelectApiGroupNode = data.currentSelectApiGroupNode;
      if (currentSelectApiGroupNode) {
        let nodeId = currentSelectApiGroupNode.nodeId;
        if (nodeId === '1000000000000000000') {
          message.error('顶级节点无法删除，请重新选择!');
        } else {
          let type = data.currentSelectApiGroupNode.type;

          if (type === '1') {
            // 删除分组
            ApiGroupApi.delete({ groupId: nodeId }).then(() => {
              message.success('删除成功');
              refreshApiGroupTreeData();
              data.currentSelectApiGroupNode = undefined;
              data.currentSelectApiGroupNodeGroupId = undefined;
              data.currentSelectApiGroupNodeGroupPid = undefined;
            });
          } else {
            // 删除资源
            ApiResourceApi.delete({ apiResourceId: nodeId }).then(() => {
              message.success('删除成功');
              refreshApiGroupTreeData();
              data.currentSelectApiGroupNode = undefined;
              data.currentSelectApiGroupNodeGroupId = undefined;
              data.currentSelectApiGroupNodeGroupPid = undefined;
            });
          }

        }
      } else {
        message.error('请选择需要删除的接口或分组');
      }
    };

    // 删除资源字段点击事件
    const deleteResourceField = (record) => {
      data.saveResourceFormButtonDot = true;

      // 被删除的字段类型 是请求还是响应
      let fieldLocation = record.fieldLocation;

      if (fieldLocation === 'request') {
        // 遍历找到对应fieldId并删除1个元素
        data.tableResourceRequestFieldList.splice(
          data.tableResourceRequestFieldList.findIndex(item => item.fieldCode === record.fieldCode),
          1
        );
      }

      if (fieldLocation === 'response') {
        // 遍历找到对应fieldId并删除1个元素
        data.tableResourceResponseFieldList.splice(
          data.tableResourceResponseFieldList.findIndex(item => item.fieldCode === record.fieldCode),
          1
        );
      }

    };

    // 新增列按钮点击事件
    const addResourceFieldList = () => {
      if (!data.resourceForm.apiAlias) {
        return;
      }
      let field = {
        apiResourceId: '',
        fieldCode: '',
        fieldId: '',
        fieldLocation: 'request',
        fieldName: '',
        fieldRequired: false,
        fieldType: 'string',
        fieldValidationMsg: ''
      };
      data.tableResourceRequestFieldList.push(field);
    };

    // 更新接口按钮点击事件
    const resetResource = () => {
      if (!data.currentSelectApiGroupNode) {
        return;
      }

      Modal.confirm({
        title: '确定要重置吗？',
        onOk: () => {

          let resourceCode = data.currentSelectApiGroupNode.data.resourceCode;
          let apiResourceId = data.currentSelectApiGroupNode.data.apiResourceId;
          let groupId = data.currentSelectApiGroupNode.data.groupId;

          // 调用重置接口
          ApiResourceApi.reset({ apiResourceId, groupId, resourceCode }).then(res => {
            // 更新接口别名和请求方式
            data.resourceForm.apiAlias = res.resourceName;
            data.resourceForm.requestMethod = res.httpMethod;

            // 获取api资源详情
            apiResourceDetail(apiResourceId, resourceCode);

            // 不显示小红点
            data.saveResourceFormButtonDot = false;

            // 刷新接口分组树
            refreshApiGroupTreeData();

          });

        }
      });

    };

    // 保存按钮点击事件
    const saveResourceForm = async () => {
      if (!data.currentSelectApiGroupNode) {
        return;
      }

      // 构建请求数据
      let reqData = Object.assign({}, data.resourceForm);
      delete reqData.apiResourceFieldList;

      // 字段列表
      reqData.apiResourceFieldRequestList = [];
      data.tableResourceResponseFieldList.forEach(item => {
        reqData.apiResourceFieldRequestList.push(Object.assign({}, item));
      });
      data.tableResourceRequestFieldList.forEach(item => {
        reqData.apiResourceFieldRequestList.push(Object.assign({}, item));
      });

      reqData.apiResourceFieldRequestList.forEach(item => {
        let fieldRequired = item.fieldRequired;
        if (fieldRequired) {
          item.fieldRequired = 'Y';
        } else {
          item.fieldRequired = 'N';
        }
      });

      // 不更新排序字段
      delete reqData.resourceSort;
      delete reqData.lastRequestHeader;
      delete reqData.lastResponseContent;
      delete reqData.lastRequestContent;

      // 发送请求
      ApiResourceApi.edit(reqData).then(() => {
        // 刷新接口树
        message.success('保存成功!');
        refreshApiGroupTreeData();
        data.saveResourceFormButtonDot = false;
      }).catch(() => {
      });

    };

    // 资源树右键菜单点击
    const onResourcesTreeContextMenuClick = (nodeId, menuKey) => {
      // 判断菜单key是否是生成接口
      if (menuKey === '1') {
        if (nodeId === 'guns') {
          message.error('根节点无法生成，请重新选择');
        } else {
          data.currentSelectResourcesTreeKeys = [];
          data.currentSelectResourcesTreeKeys.push(nodeId);
          data.isShowGenerateApi = true;
        }

      }

    };

    // API分组树右键菜单点击
    const onApiGroupTreeContextMenuClick = (type, nodeId, menuKey) => {
      data.currentSelectApiGroupTreeKeys = [];
      data.currentSelectApiGroupTreeKeys.push(nodeId);

      // 新增分组
      if (menuKey === '1') {
        // 设置父级分组id
        data.currentSelectApiGroupNodeGroupPid = nodeId;
        data.currentSelectApiGroupNodeGroupId = undefined;
        data.isShowApiGroupAddEdit = true;
      }

      // 修改分组
      if (menuKey === '2') {
        if (nodeId === '1000000000000000000') {
          message.error('顶级节点无法编辑，请重新选择!');
        } else {
          if (type === '2') {
            message.error('该节点是数据节点,请重新选择!');
          } else {
            data.currentSelectApiGroupNodeGroupId = nodeId;
            data.currentSelectApiGroupNodeGroupPid = nodeId;
            data.isShowApiGroupAddEdit = true;
          }
        }
      }

      // 删除
      if (menuKey === '3') {

        // 删除分组
        if (type === '1') {
          if (nodeId === '1000000000000000000') {
            message.error('顶级节点无法删除，请重新选择!');
            return;
          }
        }

        if (type === '1') {
          // 删除分组
          ApiGroupApi.delete({ groupId: nodeId }).then(() => {
            message.success('删除成功');
            refreshApiGroupTreeData();
            data.currentSelectApiGroupNode = undefined;
            data.currentSelectApiGroupNodeGroupId = undefined;
            data.currentSelectApiGroupNodeGroupPid = undefined;
          });
        } else {
          // 删除资源
          ApiResourceApi.delete({ apiResourceId: nodeId }).then(() => {
            message.success('删除成功');
            refreshApiGroupTreeData();
            data.currentSelectApiGroupNode = undefined;
            data.currentSelectApiGroupNodeGroupId = undefined;
            data.currentSelectApiGroupNodeGroupPid = undefined;
            data.tableResourceRequestFieldList = [];
            data.tableResourceResponseFieldList = [];
            data.selectResourceRequestFieldList = [];
            data.selectResourceResponseFieldList = [];
            data.resourceForm = {};
            data.saveResourceFormButtonDot = false;
          });
        }

      }

    };

    // 接口树拖拽
    const apiGroupTreeDrop = (e) => {
      console.log(e);
      // 目标节点
      const dropNode = e.node;
      const dropKey = dropNode.eventKey;
      const dropData = dropNode.dataRef;
      const dropType = dropData.type;
      const dropPos = dropNode.pos.split('-');
      const dropPosition = e.dropPosition - Number(dropPos[dropPos.length - 1]);

      // 拖拽节点
      const dragNode = e.dragNode;
      const dragKey = dragNode.eventKey;
      const dragData = dragNode.dataRef;
      const dragType = dragData.type;

      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.nodeId === key) {
            return callback(item, index, arr);
          }

          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };

      // 当e.dropToGap为false,说明拖拽节点成为了目标节点的子节点，只需要获取目标节点对象即可
      if (!e.dropToGap) {
        // 如果当前拖动的节点是分组则不能放到资源下
        if (dragType === '1') {
          if (dropType === '2') {
            message.error('分组不能放到资源下');
            return;
          }
        }

        // 如果当前拖拽的节点是资源则不能放到资源下 只能放到分组下
        if (dragType === '2') {
          if (dropType === '2') {
            message.error('资源不能放到资源下');
            return;
          }
        }
      }

      // let data1 = JSON.parse(JSON.stringify(data.apiGroupTreeData));
      let data1 = data.apiGroupTreeData;
      let dragObj = {};
      loop(data1, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      // 拖拽类型 1：分组拖放至分组类  2：
      let optType = -1;
      let ar = [];

      if (!e.dropToGap) {
        optType = 1;
        // Drop on the content
        // loop(data1, dropKey, item => {
        //   item.children = item.children || []; // where to insert 示例添加到尾部，可以是随意位置
        //
        //   item.children.push(dragObj);
        // });

      } else if (
        (dropNode.children || []).length > 0 && // Has children
        dropNode.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        optType = 2;
        console.log(2);
        // loop(data1, dropKey, item => {
        //   item.children = item.children || []; // where to insert 示例添加到尾部，可以是随意位置
        //
        //   item.children.unshift(dragObj);
        // });
      } else {
        optType = 3;
        let i = 0;
        loop(data1, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
        // console.log(ar);
      }

      console.log(optType);
      let req = [];
      if (optType === 1 || optType === 2) {
        dropData.children.unshift(dragData);
        dropData.children.forEach((item, index) => {
          let obj = {
            name: item.name,
            nodeId: item.id,
            nodeSort: index + 1,
            nodeType: item.type,
            nodePid: dropKey
          };
          req.push(obj);
        });
      }
      if (optType === 3) {
        ar.forEach((item, index) => {
          let obj = {
            name: item.name,
            nodeId: item.id,
            nodeSort: index + 1,
            nodeType: item.type,
            nodePid: dropData.nodeParentId
          };
          req.push(obj);
        });
      }

      // 编辑接口排序
      ApiGroupApi.editTreeSort({ treeSortRequestList: req }).then(() => {
      }).finally(() => {
        // 刷新接口树
        refreshApiGroupTreeData();
      });

    };

    // 资源接口树搜索
    const onResourcesTreeSearch = async () => {
      // 获取资源树数据
      data.resourcesTreeLoading = true;
      data.resourcesTreeData = await InterfaceApi.getResourceTree({ resourceName: data.resourcesTreeSearchValue });
      data.expandedResourcesTreeKeys = ['guns'];
      data.resourcesTreeLoading = false;
    };

    // 接口树搜索
    const onApiGroupTreeSearchSearch = async () => {
      // 获取接口树数据
      data.apiGroupTreeLoading = true;
      data.apiGroupTreeData = await ApiGroupApi.apiGroupTree({ groupName: data.apiGroupTreeSearchValue });
      data.expandedApiGroupTreeKeys = ['1000000000000000000'];
      data.apiGroupTreeLoading = false;
    };

    return {
      ...toRefs(data),
      openGenerateApi,
      openAddApiGroupAddEdit,
      openEditApiGroupAddEdit,
      apiGroupTreeSelect,
      apiResourceDetail,
      refreshApiGroupTreeData,
      openDeleteApiGroupAddEdit,
      resourceFieldConversion,
      deleteResourceField,
      addResourceFieldList,
      resetResource,
      saveResourceForm,
      onResourcesTreeContextMenuClick,
      onApiGroupTreeContextMenuClick,
      apiGroupTreeDrop,
      resourceFormData,
      onResourcesTreeSearch,
      onApiGroupTreeSearchSearch
    };

  }

};
</script>

<style>
.ant-badge-dot {
  width: 10px;
  height: 10px;
  background: #ff4d4f;
  border-radius: 100%;
  box-shadow: 0 0 0 1px #fff;
}
</style>
