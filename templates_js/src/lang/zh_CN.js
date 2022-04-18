/**
 * 简体中文
 */
export default {
  route: {
    dashboard: {
      _name: '控制面板',
      workplace: { _name: '工作台' },
      analysis: { _name: '分析页' },
      monitor: { _name: '监控页' }
    },
    orginfo: {
      _name: '系统用户',
      user: { _name: '用户管理' },
      position: { _name: '职位管理' }
    },
    authority: {
      _name: '应用权限',
      app: { _name: '应用管理' },
      role: { _name: '角色管理' },
      menu: { _name: '菜单管理' },
      resource: { _name: '资源查看' }
    },
    online: {
      _name: '在线接口',
      group: { _name: '接口分组' },
      action: { _name: '在线调试' }
    },
    basedata: {
      _name: '基础数据',
      sysconfig: { _name: '系统配置' },
      dict: { _name: '字典管理' }
    },
    operation: {
      _name: '系统功能',
      file: { _name: '文件管理' },
      online: { _name: '在线用户' },
      timer: { _name: '定时任务' },
      datasource: { _name: '多数据源' },
      language: { _name: '多语言配置' }
    },
    log: {
      _name: '日志查看',
      operatelog: { _name: '操作日志' },
      loginlog: { _name: '登录日志' }
    },
    notice: {
      _name: '通知管理',
      publish: { _name: '通知发布' },
      mynotice: { _name: '我的消息' }
    },
    monitor: {
      _name: '监控管理',
      druid: { _name: 'SQL监控' },
      server: { _name: '服务器信息' }
    },
    personal: {
      _name: '个人中心',
      info: { _name: '个人资料' }
    },
    tenant: {
      _name: '租户管理'
    },
    migration: {
      _name: '数据迁移',
      list: {
        _name: '数据迁移中心',
      }
    },
    workflow: {
      _name: '业务流程',
      model: { _name: '模型管理' },
      definition: { _name: '定义管理' },
      category: { _name: '分类管理' },
      form: { _name: '表单管理' },
      script: { _name: '脚本管理' },
      entrance: { _name: '入口管理' },
      instance: { _name: '实例管理' }
    },
    office: {
      _name: '在线办公',
      mine: {
        _name: '我的任务',
        waitToDo: { _name: '待办任务' },
        alreadyDoTask: { _name: '已办任务' }
      },
      myRequest: {
        _name: '我的申请',
        draftapply: { _name: '发起申请' },
        draft: { _name: '申请草稿' },
        applied: { _name: '已发申请' }
      }
    }
  },
  layout: {
    home: '主页',
    header: {
      profile: '个人中心',
      password: '修改密码',
      logout: '退出登录'
    },
    footer: {
      website: '官网',
      document: '文档',
      authorization: '授权',
      copyright: 'Copyright © 2021 stylefeng开源技术'
    },
    logout: {
      title: '提示',
      message: '确定要退出登录吗?'
    }
  },
  login: {
    title: '用户登录',
    username: '请输入登录账号',
    password: '请输入登录密码',
    code: '请输入验证码',
    remember: '记住密码',
    forget: '忘记密码',
    login: '登录',
    loading: '登录中'
  }
}
