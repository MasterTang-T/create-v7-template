<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    title="新建数据源"
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
      <a-form-item label="数据库名称:" name="dbName">
        <a-input v-model:value="form.dbName" placeholder="请输入数据库名称" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="JDBC驱动:" name="jdbcDriver">
        <a-select v-model:value="form.jdbcDriver" defaultActiveFirstOption>
          <a-select-option value="com.mysql.cj.jdbc.Driver">Mysql</a-select-option>
          <a-select-option value="oracle.jdbc.OracleDriver">Oracle</a-select-option>
          <a-select-option value="net.sourceforge.jtds.jdbc.Driver">Sql Server</a-select-option>
          <a-select-option value="org.postgresql.Driver">Postgre SQL</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="JDBC账号:" name="username">
        <a-input v-model:value="form.username" placeholder="请输入JDBC账号" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="JDBC密码:" name="password">
        <a-input v-model:value="form.password" placeholder="请输入JDBC密码" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="JDBC URL:" name="jdbcUrl">
        <a-input v-model:value="form.jdbcUrl" placeholder="请输入URL" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="数据源备注:" name="remark">
        <a-input v-model:value="form.remark" placeholder="请输入数据源备注" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="jdbcUrl参考:" name="remark" :auto-link='false'>
        <a-tooltip>
          <template #title> mysql</template>
          jdbc:mysql://127.0.0.1:3306/guns?autoReconnect=true&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=CONVERT_TO_NULL&useSSL=false&serverTimezone=CTT
        </a-tooltip>
        <a-divider></a-divider>
        <a-tooltip>
          <template #title> oracle</template>
          jdbc:oracle:thin:@127.0.0.1:1521:ORCLCDB
        </a-tooltip>
        <a-divider></a-divider>
        <a-tooltip>
          <template #title> sql server</template>
          jdbc:jtds:sqlserver://127.0.0.1:1433;DatabaseName=guns
        </a-tooltip>
        <a-divider></a-divider>
        <a-tooltip>
          <template #title> pg sql</template>
          jdbc:postgresql://127.0.0.1:5432/guns
        </a-tooltip>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { DataSourceApi } from '@/api/DataSourceApi';

export default {
  name: 'DataSourceAdd',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 表单数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        dbName: [{ required: true, message: '请输入数据源名称', type: 'string', trigger: 'blur' }],
        jdbcDriver: [{ required: true, message: '请选择数据源驱动', type: 'string', trigger: 'blur' }],
        username: [{ required: true, message: '请输入jdbc账号', type: 'string', trigger: 'blur' }],
        password: [{ required: true, message: '请输入jdbc密码', type: 'string', trigger: 'blur' }],
        jdbcUrl: [{ required: true, message: '请输入url', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false
    };
  },
  watch: {
    data() {
      this.form = {};
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2021/4/8 13:33
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      // 执行编辑或修改
      DataSourceApi.add(this.form)
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
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
