<!-- 定时任务编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改定时任务' : '新建定时任务'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formData"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 7 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 17 }, sm: { span: 24 } }"
    >
      <a-form-item label="任务名称:" name="timerName">
        <a-input @keydown.enter="save" v-model:value="form.timerName" placeholder="请输入任务名称" allow-clear/>
      </a-form-item>
      <a-form-item label="任务job:" name="actionClass">
        <a-select :loading="actionClassListLoading" showSearch placeholder="请选择任务job" v-model:value="form.actionClass" allow-clear>
          <a-select-option v-for="item in actionClassList" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="cron:" name="cron">
        <a-input @keydown.enter="save" v-model:value="form.cron" placeholder="请输入任务cron表达式" allow-clear/>
      </a-form-item>
      <a-form-item label="任务参数:" name="params">
        <a-input @keydown.enter="save" v-model:value="form.params" placeholder="请输入任务参数" allow-clear/>
      </a-form-item>
      <a-form-item label="备注:" name="remark">
        <a-input @keydown.enter="save" v-model:value="form.remark" placeholder="请输入备注" allow-clear/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {ref, toRefs, reactive, watch} from 'vue'
import {SysTimerApi} from "@/api/SysTimerApi";
import {message} from 'ant-design-vue'

export default {
  name: 'SysTimerEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  setup(props, context) {
    let formData = ref(null);

    const data = reactive({
      // 表单数据
      form: Object.assign({}, props.data),
      // 表单验证规则
      rules: {
        timerName: [{required: true, message: '请输入任务名称', type: 'string', trigger: 'blur'}],
        cron: [{required: true, message: '请输入cron任务表达式', type: 'string', trigger: 'blur'}],
        actionClass: [{required: true, message: '请选择任务job', type: 'string', trigger: 'blur'}]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 任务job Class列表
      actionClassList: [],
      // 任务job 下拉加载状态
      actionClassListLoading: true
    })

    /**
     * 监听数据
     */
    watch(props, (newProp) => {
      if (newProp.data) {
        data.form = Object.assign({}, newProp.data);
        data.isUpdate = true;
      } else {
        data.form = {};
        data.isUpdate = false;
      }

      if (formData.value) {
        formData.value.clearValidate();
      }

      if (newProp.visible) {
        // 获取定时任务执行class
        SysTimerApi.getActionClasses().then(res => {
          data.actionClassList = res
          data.actionClassListLoading = false
        })
      }


    })


    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    const updateVisible = (value) => {
      context.emit('update:visible', value)
    }

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
        result = SysTimerApi.edit(data.form);
      } else {
        result = SysTimerApi.add(data.form);
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
    }

    return {
      ...toRefs(data),
      formData,
      save,
      updateVisible
    }
  }

};
</script>

<style scoped>

</style>
