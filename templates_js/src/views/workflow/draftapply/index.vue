<template>
  <div>
    <a-card :bordered="false" :loading="cardLoading" v-show="indexPageShow">
      <div v-for="(item, index) in shortcutListData" :key="index">
        <a-divider orientation="left">
          {{ item.categoryName }}
        </a-divider>
        <a-row>
          <a-col :md="6" :sm="24" v-for="(items, indexs) in item.childrenList" :key="indexs">
             <div class="iconDiv" @click="openPush(items)">
              <div class="a_iconDiv">
                <component style="fontSize:30px" :is="$antIcons[items.icon]" />
              </div>
              <span>
                <a-tooltip placement="top">
                  <template #title>
                    <span>{{ items.description }}</span>
                  </template>
                  {{ items.shortcutName }}
                </a-tooltip>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>

  <!-- 带按钮的form弹窗 -->
  <form-push v-model:visible="showPush" :data="current" />
  </div>
</template>
<script>
import createForm from './createForm';
import { ShortCutApi } from '@/api/workflow/ShortCutApi';
import FormPush from '@/views/workflow/draftapply/form-push';

export default {
  components: {
    createForm,
    FormPush
  },
  data() {
    return {
      shortcutListData: [],
      cardLoading: false,
      indexPageShow: true,
      createFormShow: false,
      showPush:false,
      current:{}
    };
  },
  created() {
    this.cardLoading = true;
    ShortCutApi.flowableShortcutList().then(res => {
      this.cardLoading = false;
      this.shortcutListData = res;
    });
  },
  methods: {
    openCreateForm(items) {
      if (items.processDefinitionId == null) {
        this.$message.warning('打开失败：表单项定义processDefinitionId不存在');
      } else {
        this.indexPageShow = false;
        this.createFormShow = true;
        this.$refs.createForm.open(items);
      }
    },
    closeCreateForm() {
      this.indexPageShow = true;
      this.createFormShow = false;
    },
    rollbackCreateForm() {
      this.indexPageShow = true;
      this.createFormShow = false;
    },
     /**
     * 打开发布表单弹窗
     *
     * @author wangyh
     * @date 2021/7/15 13:22
     */
    openPush(row) {
      this.showPush= true;
      this.current = row;
    },
  }
};
</script>

<style scoped>
.iconDiv {
  text-align: center;
  color: #595959;
  background: #ffffff;
  height: 110px;
  margin: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 1px;
}

.iconDiv:hover {
  background-color: rgba(24, 144, 255, 0.5);
  color: #ffffff;
  border: 1px solid rgba(24, 144, 255, 0.1);
  cursor: pointer;
  box-shadow: 0 1px 10px rgba(24, 144, 255, 0.5);
  transition: all 0.2s ease-in-out;
}

.a_iconDiv {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
