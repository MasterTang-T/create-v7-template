<template>
  <a-card :bordered="false" :loading="cardLoading">
    <a-spin :spinning="spinningLoading">
      <div>
        <a-button class="but_item" type="dashed" @click="rollbackPage">
          <RollbackOutlined />
          返回
        </a-button>
        <a-button class="but_item" type="primary" @click="handleSubmit">发布</a-button>
        <a-button class="but_item" @click="handleApplyed">存为草稿</a-button>
        <a-button class="but_item" @click="handleReset">重置</a-button>
        <a-button class="but_item" @click="$refs.tracking.initModel(recordData.processDefinitionId)">流程图</a-button>
      </div>
      <definition-tracking ref="tracking"></definition-tracking>
    </a-spin>
  </a-card>
</template>
<script>
import { RollbackOutlined } from '@ant-design/icons-vue';
import { FormManageApi } from '@/api/workflow/FormManageApi';
import { FormManageApi as DraftManageApi } from '@/api/workflow/DraftManageApi';
import { HandleTaskApi } from '@/api/workflow/HandleTaskApi';
import DefinitionTracking from '@/views/workflow/definition/tracking';

export default {
  name: "CreateForm",
  components: { DefinitionTracking, RollbackOutlined },
  data() {
    return {
      jsonData: {},
      visible: false,
      confirmLoading: false,
      cardLoading: false,
      processDefinitionId: '',
      spinningLoading: false,
      recordData: {}
    };
  },
  methods: {
    /**
     * 初始化方法
     */
    open(record) {
      this.recordData = record;
      this.processDefinitionId = record.processDefinitionId;
      this.formStartFormData(record);
    },
    /**
     * 获取预加载表单的数据
     */
    formStartFormData(record) {
      this.cardLoading = true;
      FormManageApi.formStartFormData({ processDefinitionId: record.processDefinitionId }).then(res => {
        this.cardLoading = false;
        if (res.success) {
          this.jsonData = JSON.parse(res.data);
          if (record.formData != null) {
            setTimeout(() => {
              this.$refs.kfb.setData(JSON.parse(record.formData));
            }, 100);
          }
        } else {
          this.$message.error(res.message);
          this.returnPage();
        }
      });
    },
    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.kfb
        .getData()
        .then(values => {
          const formData = {};
          formData.formData = JSON.stringify(values);
          const subReq = {};
          subReq.processDefinitionId = this.processDefinitionId;
          subReq.variables = formData;
          this.spinningLoading = true;
          HandleTaskApi.handleTaskStart(subReq).then(res => {
            this.spinningLoading = false;
            if (res.success) {
              this.$message.success('发起成功');
              this.returnPage();
            } else {
              this.$message.error('发起失败：' + res.message);
            }
          });
        })
        .catch(() => {
          // console.log('验证未通过，获取失败')
        });
    },
    /**
     * 存为草稿
     */
    handleApplyed() {
      this.$refs.kfb
        .getData()
        .then(values => {
          const params = {
            processDefinitionId: this.recordData.processDefinitionId,
            formJson: JSON.stringify(this.jsonData),
            processName: this.recordData.name === undefined ? this.recordData.processName : this.recordData.name,
            category: this.recordData.category,
            categoryName: this.recordData.categoryName,
            formData: JSON.stringify(values)
          };
          this.spinningLoading = true;
          DraftManageApi.draftAdd(params)
            .then(res => {
              if (res.success) {
                this.$message.success('存为草稿成功');
                this.returnPage();
              } else {
                this.$message.error('存为草稿失败：' + res.message);
              }
            })
            .finally(() => {
              this.spinningLoading = false;
            });
        })
        .catch(() => {
          // console.log('验证未通过，获取失败')
        });
    },
    /**
     * 返回并清空已生成的表单
     */
    returnPage() {
      const recordId = this.recordData.id;
      this.$emit('close', recordId);
      this.jsonData = {};
      this.recordData = {};
    },
    /**
     * 正常返回
     */
    rollbackPage() {
      this.$emit('rollback');
      this.jsonData = {};
      this.recordData = {};
    },
    /**
     * 重置表单
     */
    handleReset() {
      this.$refs.kfb.reset();
    }
  }
};
</script>
<style>
.but_item {
  margin-right: 8px;
  margin-bottom: 10px;
}
</style>
