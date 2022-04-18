import Request from '@/utils/request';

/**
 * 用户管理api
 *
 * @author fengshuonan
 * @date 2021/4/1 16:06
 */
export class UserApi {
  /**
   * 获取用户列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getUserList(params) {
    return Request.get('/sysUser/page', params);
  }

  /**
   * 新增用户
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static addUser(params) {
    return Request.post('/sysUser/add', params);
  }

  /**
   * 修改用户
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static editUser(params) {
    return Request.post('/sysUser/edit', params);
  }

  /**
   * 修改用户状态
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static changeStatus(params) {
    return Request.post('/sysUser/changeStatus', params);
  }

  /**
   * 重置密码
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static resetPwd(params) {
    return Request.post('/sysUser/resetPwd', params);
  }

  /**
   * 删除用户
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static deleteUser(params) {
    return Request.post('/sysUser/delete', params);
  }

  /**
   * 批量删除用户
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static batchDeleteUser(params) {
    return Request.post('/sysUser/batchDelete', params);
  }

  /**
   * 获取职位信息（下拉选择用）
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getPositionDropList(params) {
    return Request.getAndLoadData('/hrPosition/list', params);
  }

  // -----左侧组织机构相关------
  /**
   * 获取左侧组织机构树列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getOrgTeeList(params) {
    return Request.getAndLoadData('/hrOrganization/tree', params);
  }

  /**
   * 获取组织机构详情
   *
   * @param {String} params.orgId - 组织机构id
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getOrgDetail(params) {
    return Request.getAndLoadData('/hrOrganization/detail', params);
  }

  /**
   * 组织机构新增
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static addOrg(params) {
    return Request.post('/hrOrganization/add', params);
  }

  /**
   * 组织机构修改
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static editOrg(params) {
    return Request.post('/hrOrganization/edit', params);
  }

  /**
   * 组织机构删除
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static deleteOrg(params) {
    return Request.post('/hrOrganization/delete', params);
  }

  // -----授权角色界面使用------
  /**
   * 获取所有角色列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getRoleDropList(params) {
    return Request.getAndLoadData('/sysRole/dropDown', params);
  }

  /**
   * 查询用户的所有角色(需要传userId)
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getUserRoles(params) {
    return Request.getAndLoadData('/sysUser/getUserRoles', params);
  }

  /**
   * 授权角色
   *
   * @param {String} params.userId - 用户id
   * @param {Array} params.grantRoleIdList - 角色列表集合
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static grantRoles(params) {
    return Request.post('/sysUser/grantRole', params);
  }

  // -----授权数据界面使用------
  /**
   * 获取授权数据范围列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getUserBindOrgScope(params) {
    return Request.get('/hrOrganization/userBindOrgScope', params);
  }

  /**
   * 授权数据范围
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static granData(params) {
    return Request.post('/sysUser/grantData', params);
  }

  // -----在线用户界面使用------
  /**
   * 强制踢下线
   *
   * @author fengshuonan
   * @date 2021/4/13 14:47
   */
  static kickOff(params) {
    return Request.post('/sysUser/removeSession', params);
  }
}
