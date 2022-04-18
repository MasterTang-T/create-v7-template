/**
 * 英语
 */
export default {
  route: {
    dashboard: {
      _name: 'Dashboard',
      workplace: {_name: 'Workplace'},
      analysis: {_name: 'Analysis'},
      monitor: {_name: 'Monitor'}
    },
    orginfo: {
      _name: 'OrgInfo',
      user: { _name: 'User' },
      role: { _name: 'Role' },
      position: { _name: 'Position' },
      app: { _name: 'App' },
      menu: { _name: 'Menu' },
      resource: { _name: 'Resource' }
    },
    basedata: {
      _name: 'BaseData',
      sysconfig: { _name: 'SysConfig' },
      dict: { _name: 'Dict' },
      api: { _name: 'Api' }
    },
    operation: {
      _name: 'System',
      file: { _name: 'File' },
      operatelog: { _name: 'OperateLog' },
      online: { _name: 'Online' },
      timer: { _name: 'Timer' },
      loginlog: { _name: 'LoginLog' },
      datasource: { _name: 'DataSource' },
      language: { _name: 'I18n' }
    },
    notice: {
      _name: 'Notice',
      publish: { _name: 'Publish' },
      mynotice: { _name: 'Notice' }
    },
    monitor: {
      _name: 'Monitor',
      druid: { _name: 'Druid' },
      server: { _name: 'ServerInfo' }
    },
    persona: {
      _name: 'Personal',
      info: { _name: 'PersonalInfo' }
    }
  },
  layout: {
    home: 'Home',
    header: {
      profile: 'Profile',
      password: 'Password',
      logout: 'SignOut'
    },
    footer: {
      website: 'Website',
      document: 'Document',
      authorization: 'Authorization',
      copyright: 'Copyright © 2021 stylefeng technology'
    },
    logout: {
      title: 'Confirm',
      message: 'Are you sure you want to logout?'
    }
  },
  login: {
    title: 'User Login',
    username: 'please input username',
    password: 'please input password',
    code: 'please input code',
    remember: 'remember',
    forget: 'forget',
    login: 'login',
    loading: 'loading'
  }
}
