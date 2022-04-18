import Request from '@/utils/request';

/**
 * 菜单按钮管理api
 *
 * @author jiawei
 * @date 2021/4/13 16:06
 */
export class MenuButtonApi {
  /**
   * 获取菜单按钮列表
   *
   * @author jiawei
   * @date 2021/4/13 16:07
   */
  static getMenuButtonList(params) {
    return Request.get('/sysMenuButton/pageList', params);
  }

  /**
   * 新增菜单按钮
   *
   * @author jiawei
   * @date 2021/4/13 16:07
   */
  static addMenuButton(params) {
    return Request.post('/sysMenuButton/add', params);
  }

  /**
   * 添加系统菜单按钮-默认按钮
   *
   * @author jiawei
   * @date 2021/4/13 16:07
   */
  static addDefaultMenuButton(params) {
    return Request.post('/sysMenuButton/addSystemDefaultButton', params);
  }

  /**
   * 修改菜单按钮
   *
   * @author jiawei
   * @date 2021/4/13 16:07
   */
  static editMenuButton(params) {
    return Request.post('/sysMenuButton/edit', params);
  }

  /**
   * 删除菜单按钮
   *
   * @author jiawei
   * @date 2021/4/13 16:07
   */
  static deleteMenuButton(params) {
    return Request.post('/sysMenuButton/delete', params);
  }

  /**
   * 批量删除菜单按钮
   *
   * @author jiawei
   * @date 2021/4/13 16:07
   */
  static batchDeleteMenuButton(params) {
    return Request.post('/sysMenuButton/batchDelete', params);
  }
}
