<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改' : '新建'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      layout="horizontal"
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
    >
      <a-form-item label="公司名称:" name="companyName">
        <a-input v-model:value="form.companyName" placeholder="请输入公司名称" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="注册邮箱:" name="email">
        <a-input v-model:value="form.email" placeholder="请输入注册邮箱" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="手机号:" name="safePhone">
        <a-input v-model:value="form.safePhone" placeholder="租户登录账号" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="管理员密码:" name="password" v-if="!isUpdate">
        <a-input-password v-model:value="form.password" placeholder="租户管理员密码" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="公司logo:" name="companyLogo">
        <div class="clearfix">
          <a-upload
            :headers="headers"
            action="/api/sysFileInfo/upload?secretFlag=Y"
            list-type="picture-card"
            v-model:file-list="fileList"
            @preview="handlePreview"
          >
            <div v-if="fileList.length < 1">
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-form-item>
      <a-form-item label="公司地址:" name="companyAddress">
        <a-input v-model:value="form.companyAddress" placeholder="请输入公司地址" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="统一社会信用代码:" name="licenceNumber">
        <a-input v-model:value="form.licenceNumber" placeholder="请输入统一社会信用代码" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { SysTenantApi } from '@/api/SysTenantApi';
import setting from '@/config/setting';

export default {
  name: 'SysTenantEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        companyName: [{ required: true, message: '请输入公司名称', type: 'string', trigger: 'blur' }],
        email: [{ required: true, message: '请输入注册邮箱', type: 'string', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码，bcrypt加密', type: 'string', trigger: 'blur' }],
        safePhone: [{ required: true, message: '请输入安全手机(注册时的手机号)', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 上传的公司logo
      fileList: [],
      // 上传图片时候的header
      headers: {
        Authorization: setting.takeToken()
      },
      // 是否可以预览
      previewVisible: false,
      // 预览图片的地址
      previewImage: ''
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
        if (this.visible) {
          this.fileList = [
            {
              uid: '-1',
              name: 'image',
              status: 'done',
              url: `/api/sysFileInfo/private/preview?fileId=${this.form.companyLogo}&token=${setting.takeToken()}`
            }
          ];
        }
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },
    visible() {
      if (this.fileList.length > 0 && !this.isUpdate) {
        this.fileList = [];
      }
    }
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2021/05/27 18:10
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 设置公司图片的id
      if (this.fileList.length > 0) {
        if(this.fileList[0]?.response){
          this.form.companyLogo = this.fileList[0].response.data.fileId;
        }
      }

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改
      if (this.isUpdate) {
        result = SysTenantApi.edit(this.form);
      } else {
        result = SysTenantApi.add(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          this.$message.success(result.message);

          // 如果是新增，则form表单置空
          if (!this.isUpdate) {
            this.form = {};
          }

          // 关闭弹框，通过控制visible的值，传递给父组件
          this.updateVisible(false);

          // 触发父组件done事件
          this.$emit('done');
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author fengshuonan
     * @date 2021/05/27 18:10
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 点击预览图片时
     *
     * @author fengshuonan
     * @date 2021/5/28 11:26
     */
    handlePreview(file) {
      // 打开预览框
      this.previewVisible = true;

      // 获取到文件id
      let fileId = file?.response?.data?.fileId;
      if (!fileId) {
        fileId = this.form.companyLogo;
      }

      // 拼接文件预览的url
      let token = setting.takeToken();
      this.previewImage = `/api/sysFileInfo/private/preview?fileId=${fileId}&token=${token}`;
    },

    /**
     * 点击取消按钮
     *
     * @author fengshuonan
     * @date 2021/5/28 11:30
     */
    handleCancel() {
      this.previewVisible = false;
    }
  }
};
</script>