<!-- 接口分组编辑弹窗 -->
<template>
  <a-modal
    :width='800'
    :visible='visible'
    :confirm-loading='loading'
    :title="isUpdate ? '修改接口分组' : '新建接口分组'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible='updateVisible'
    @ok='save'
  >
    <a-form
      ref='formData'
      :model='form'
      :rules='rules'
      :label-col='{ md: { span: 7 }, sm: { span: 24 } }'
      :wrapper-col='{ md: { span: 17 }, sm: { span: 24 } }'
    >
      <a-form-item label='分组名称:' name='groupName'>
        <a-input @keydown.enter='save' v-model:value='form.groupName' placeholder='请输入分组名称' allow-clear />
      </a-form-item>
      <a-form-item label='父级分组:' name='groupPid'>
        <a-tree-select
          showSearch
          allow-clear
          v-model:value='form.groupPid'
          style='width: 100%'
          :replaceFields="{children:'children', title:'name', key:'nodeId', value: 'nodeId' }"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data='groupPidList'
          placeholder='请选择父级分组'
          tree-default-expand-all
        >
        </a-tree-select>

      </a-form-item>
      <a-form-item label='分组排序:' name='groupSort'>
        <a-input-number style='width: 100%' @keydown.enter='save' v-model:value='form.groupSort' :min='0' :step='0.01' placeholder='请输入分组排序' allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { ref, toRefs, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { ApiGroupApi } from '@/api/ApiGroupApi';

export default {
  name: 'ApiGroupAddEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 接口分组id
    groupId: String,
    // 父级分组id
    groupPid: String
  },
  setup(props, context) {
    let formData = ref(null);

    const data = reactive({
      // 表单数据
      form: { groupPid: props.groupPid, groupSort: 0 },
      // 表单验证规则
      rules: {
        groupName: [{ required: true, message: '请输入分组名称', type: 'string', trigger: 'blur' }],
        groupSort: [{ required: true, message: '请输入分组排序', type: 'number', trigger: 'blur' }],
        groupPid: [{ required: true, message: '请选择父级分组', type: 'string', trigger: ['blur', 'change'] }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 父级分组树形列表
      groupPidList: []
    });

    /**
     * 监听数据
     */
    // 弹窗页面显示则执行
    watch(() => props.visible, (newVal) => {
      if (newVal) {

        data.form.groupPid = props.groupPid;

        // 加载接口组树形列表
        ApiGroupApi.apiGroupTree({ groupId: props.groupId ? props.groupId : '' }).then(res => {
          data.groupPidList = res;
        });

        if (props.groupId) {
          // 获取接口分组详情
          ApiGroupApi.detail({ groupId: props.groupId }).then(res => {
            data.form = res.data;
          });
        }
      } else {
        formData.value.resetFields();
        data.form = {
          groupSort: 0
        };
      }
    });

    watch(() => props.groupId, (newVal) => {
      if (newVal) {
        data.isUpdate = true;
      } else {
        data.isUpdate = false;
      }
    });

    watch(() => formData.value, (newVal) => {
      newVal.clearValidate();
    });

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author luojie
     * @date 2021/5/24 11:01
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
      // 校验表单
      await formData.value.validate();

      // 修改加载框为正在加载
      data.loading = true;

      let result = null;

      // 执行编辑或修改方法
      if (data.isUpdate) {
        result = ApiGroupApi.edit(data.form);
      } else {
        result = ApiGroupApi.add(data.form);
      }

      result.then(result => {
        // 移除加载框
        data.loading = false;

        // 提示添加成功
        message.success(result.message);

        // 如果是新增，则form表单置空
        if (!data.isUpdate) {
          data.form = {};
        }

        // 关闭弹框，通过控制visible的值，传递给父组件
        updateVisible(false);

        // 触发父组件done事件
        context.emit('done');
      }).catch(() => {
        data.loading = false;
      });
    };

    return {
      ...toRefs(data),
      formData,
      save,
      updateVisible
    };
  }

};
</script>

<style scoped>

</style>
