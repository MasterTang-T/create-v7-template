import Request from '@/utils/request';

/**
 * 菜单管理api
 *
 * @author chenjinlong
 * @date 2021/4/7 11:47
 */
export class SysMenuApi {
  /**
   * 获取菜单列表
   *
   * @author chenjinlong
   * @date 2021/4/7 11:47
   */
  static async getMenuList(params) {
    return await Request.getAndLoadData('/sysMenu/menuAndButtonTreeChildrenV2', params);
  }

  /**
   * 获取左侧菜单（根据应用code）
   *
   * @param {String} params.appCode - 应用编码
   * @param {Boolean} params.totalMenus - 全部应用（true-全部，false-非全部）
   * @author fengshuonan
   * @date 2021/4/21 16:35
   */
  static getLeftMenuList(params) {
    return Request.getAndLoadData('/sysMenu/getLeftMenusAntdv', params);
  }
}
