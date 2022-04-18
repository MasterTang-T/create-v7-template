<!--生成接口弹窗-->
<template>
  <a-modal
    :width='800'
    :visible='visible'
    :confirm-loading='loading'
    title='选择接口分组'
    :body-style="{ paddingBottom: '8px' }"
    @update:visible='updateVisible'
    @ok='save'
  >

    <a-directory-tree
      :tree-data='groupList'
      v-model:expanded-keys='expandedTreeKeys'
      v-model:selectedKeys='selectedKeys'
      :replace-fields="{ children: 'children', title: 'name', key: 'nodeId', value: 'nodeId' }"
    ></a-directory-tree>

  </a-modal>
</template>

<script>
import { toRefs, reactive, watch } from 'vue';
import { ApiGroupApi } from '@/api/ApiGroupApi';
import { message } from 'ant-design-vue';
import { ApiResourceApi } from '@/api/ApiResourceApi';

export default {
  name: 'ApiManageGenerate',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 资源code
    resourceCode: String
  },
  setup(props, context) {
    // data
    const data = reactive({
      // 表单数据
      form: {
        resourceCode: props.resourceCode,
        groupId: ''
      },
      // 提交状态
      loading: false,
      // 接口组列表
      groupList: [],
      // 接口分组选中的keys
      selectedKeys: [],
      expandedTreeKeys: []
    });

    /**
     * 监听数据
     */
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        data.form.resourceCode = props.resourceCode;

        // 加载接口组树形列表
        ApiGroupApi.groupTree().then(res => {
          data.groupList = res;
          data.expandedTreeKeys = ['1000000000000000000'];
        });

      }
    });

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    const updateVisible = (value) => {
      context.emit('update:visible', value);
    };

    /**
     * 保存和编辑
     *
     * @author luojie
     * @date 2021/4/13 11:25
     */
    const save = async () => {

      if (data.selectedKeys.length === 1) {
        data.form.groupId = data.selectedKeys[0];
      }

      if (data.form.groupId.length === 0) {
        message.error('请选择接口分组');
        return;
      }

      // 修改加载框为正在加载
      data.loading = true;

      // 添加资源
      ApiResourceApi.add(data.form).then(result => {
        // 移除加载框
        data.loading = false;

        // 提示添加成功
        message.success(result.message);

        // 清空表单
        data.form = {};

        // 清空选中的分组
        data.selectedKeys = [];

        // 关闭弹框，通过控制visible的值，传递给父组件
        updateVisible(false);

        // 触发父组件done事件
        context.emit('done');

        data.loading = false;

      }).catch(() => {
        data.loading = false;
      });

    };

    return {
      ...toRefs(data),
      save,
      updateVisible
    };
  }

};
</script>

<style scoped>

</style>
