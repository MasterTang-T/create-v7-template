import Request from '@/utils/request';

/**
 * 菜单管理api
 *
 * @author jiawei
 * @date 2021/4/7 11:47
 */
export class MenuApi {
  /**
   * 获取菜单列表
   *
   * @author jiawei
   * @date 2021/4/7 11:47
   */
  static async getMenuList(params) {
    return await Request.get('/sysMenu/list', params);
  }

  /**
   * 新增菜单
   *
   * @author jiawei
   * @date 2021/4/7 11:47
   */
  static async addMenu(params) {
    return await Request.post('/sysMenu/add', params);
  }

  /**
   * 修改菜单
   *
   * @author jiawei
   * @date 2021/4/7 11:47
   */
  static async editMenu(params) {
    return await Request.post('/sysMenu/edit', params);
  }

  /**
   * 删除菜单
   *
   * @author jiawei
   * @date 2021/4/7 11:47
   */
  static async deleteMenu(params) {
    return await Request.post('/sysMenu/delete', params);
  }

  /**
   * 获取系统菜单树（用于新增，编辑时选择上级节点）
   *
   * @author jiawei
   * @date 2021/4/7 11:47
   */
  static async getMenuTree(params) {
    return await Request.getAndLoadData('/sysMenu/tree', params);
  }

  /**
   * 获取应用（选择菜单所属应用时使用）
   *
   * @author jiawei
   * @date 2021/4/7 11:47
   */
  static async getAppDropList(params) {
    return await Request.getAndLoadData('/sysApp/list', params);
  }

  /**
   * 绑定菜单和资源
   *
   * @author fengshuonan
   * @date 2021/8/10 14:57
   */
  static async addMenuResourceBind(params) {
    return await Request.post('/sysMenuResource/addMenuResourceBind', params);
  }
}
