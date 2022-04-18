<!--流程追踪页面-->
<template>
  <a-modal
    title='追踪'
    :width='modalWidth'
    :visible='visible'
    :confirmLoading='confirmLoading'
    :footer='null'
    @ok='handleCancel'
    @cancel='handleCancel'
  >
    <a-card :loading='legendLoading' :bordered='false' v-show='legendShow'>加载占位展示</a-card>
    <div id='bpmnModel' style='display:none;'></div>
  </a-modal>
</template>

<script>
import jQuery from 'jquery';
import { ajaxSuccess } from '@/assets/flowable/js/displaymodel.js';
import 'font-awesome/css/font-awesome.min.css';
import { DefinitionApi } from '@/api/workflow/DefinitionApi';

export default {
  name: 'DefinitionTracking',
  data() {
    return {
      queryParam: {},
      visible: false,
      confirmLoading: false,
      legendLoading: false,
      legendShow: false,
      modalWidth: 900
    };
  },
  methods: {
    /**
     * 初始化model框弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 22:48
     */
    initModel(id) {
      this.queryParam.id = id;
      this.visible = true;
      this.legendShow = true;
      this.flowableDefinitionTrace();
      this.modalWidth = 900;
    },

    /**
     * 初始化流程图展示
     *
     * @author fengshuonan
     * @date 2021/6/26 22:48
     */
    flowableDefinitionTrace() {
      this.legendLoading = true;
      DefinitionApi.trace(this.queryParam).then((res) => {
        this.legendLoading = false;
        this.legendShow = false;
        ajaxSuccess(res);
      });
    },

    /**
     * 关闭弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 22:48
     */
    handleCancel() {
      this.visible = false;
      this.loadData = [];
      document.getElementById('bpmnModel').innerHTML = '';
      jQuery('#legend').hide();
      jQuery('#bpmnModel').hide();
    }
  }
};
</script>
<style scoped>
#legend {
  text-align: center;
  margin: 20px auto;
}

#legend #complete {
  color: #52c41a;
}

#legend #running {
  color: #e90606;
}

#legend #unexecuted {
  color: #585858;
}

#bpmnModel {
  margin: 0 auto;
}

div[class*='ui-tooltip-kisbpm-'] {
  background-color: #ffffff;
  border-color: #c5c5c5;
  color: #4a4a4a;
  font-family: Verdana, serif;
  font-size: 12px;
}

div[class*='ui-tooltip-kisbpm-'] .qtip-content {
  color: #4a4a4a;
  background-color: #ffffff;
  font-family: Verdana, serif;
  font-size: 12px;
}

.ui-tooltip-kisbpm-bpmn .qtip-titlebar {
  color: #FFFFFF;
  font-size: 12px;
  background: #2B414F;
}

.ui-tooltip-kisbpm-bpmn .qtip-tip {
  background-color: #2B414F;
}
</style>
