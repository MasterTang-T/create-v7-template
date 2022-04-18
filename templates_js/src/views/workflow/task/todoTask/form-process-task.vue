<!-- 应用编辑弹窗 -->
<template>
  <a-modal :visible="visible" :body-style="bodyStyle" :footer="null" @update:visible="updateVisible" width="1200px">
    <iframe class="frame" scrolling="yes" id="form-push-iframe" width="95%" frameborder="0" height="90%" :src="iframeSrc"></iframe>
  </a-modal>
</template>

<script>
import store from 'storejs';

export default {
  name: 'FormProcessTask',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },

  created() {
    this.token = store.get('access_token');
    window.addEventListener('message', this.messageListener);
  },

  unmounted() {
    window.removeEventListener('message', this.messageListener, false);
  },

  computed: {
    iframeSrc() {
      return (
        `${process.env.VUE_APP_FORM_ENGINE_HOST}/FormProcessTask/` +
        this.token +
        '/' +
        this.cData?.procIns?.procDef?.id +
        '/' +
        this.cData?.activityId +
        '/' +
        this.cData?.id +
        '/' +
        this.cData?.name +
        '/' +
        this.cData?.procIns?.id +
        '/' +
        Math.floor(Math.random() * 10000) +
        1
      );
    }
  },

  data() {
    return {
      token: '123',
      bodyStyle: {
        margin: '0',
        padding: '10px'
      },
      formResourceId: '',
      cData: {},
      spinning: true,
      messageListener: e => {
        if (e.data && e.data.height) {
          this.bodyStyle.height = e.data.height + 110 + 'px';
          this.spinning = false;
        }
        if (e.data && e.data.action && e.data.action === 'close') {
          this.$emit('update:visible', false);
          this.$emit('done');
          this.$message.success('流程处理成功');
        }
      }
    };
  },
  watch: {
    data: function(newVal) {
      this.cData = newVal; //更新传进来的data
    }
  },
  methods: {
    /**
     * 弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author wangyh
     * @date 2021/7/14 18:03
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped>
.frame {
  margin-top: 30px;
  margin-right: 30px;
  margin-left: 30px;
}
</style>
