/**
 * 繁体中文
 */
export default {
  route: {
    dashboard: {
      _name: '控制面板',
      workplace: { _name: '工作台' },
      analysis: { _name: '分析頁' },
      monitor: { _name: '監控頁' }
    },
    orginfo: {
      _name: '用戶權限',
      user: { _name: '用戶管理' },
      role: { _name: '角色管理' },
      position: { _name: '職位管理' },
      app: { _name: '應用管理' },
      menu: { _name: '菜單管理' },
      resource: { _name: '資源管理' }
    },
    basedata: {
      _name: '基礎數據',
      sysconfig: { _name: '系統配置' },
      dict: { _name: '字典管理' },
      interface: {
        _name: '接口文檔',
        group: {
          _name: '接口分組'
        }
      }
    },
    operation: {
      _name: '系統功能',
      file: { _name: '文件管理' },
      operatelog: { _name: '操作日誌' },
      online: { _name: '在線用戶' },
      timer: { _name: '定時任務' },
      loginlog: { _name: '登錄日誌' },
      datasource: { _name: '多數據源' },
      language: { _name: '多語言配置' }
    },
    notice: {
      _name: '通知管理',
      publish: { _name: '通知發佈' },
      mynotice: { _name: '我的消息' }
    },
    monitor: {
      _name: '監控管理',
      druid: { _name: 'SQL監控' },
      server: { _name: '服務器信息' }
    },
    persona: {
      _name: '個人中心',
      info: { _name: '個人資料' }
    }
  },
  layout: {
    home: '主頁',
    header: {
      profile: '個人中心',
      password: '修改密碼',
      logout: '安全登出'
    },
    footer: {
      website: '官網',
      document: '檔案',
      authorization: '授權',
      copyright: 'Copyright © 2021 stylefeng開源技術'
    },
    logout: {
      title: '詢問',
      message: '確定要登出嗎?'
    }
  },
  login: {
    title: '用戶登錄',
    username: '請輸入登入帳號',
    password: '請輸入登入密碼',
    code: '請輸入驗證碼',
    remember: '記住密碼',
    forget: '忘記密碼',
    login: '登入',
    loading: '登入中'
  }
}
