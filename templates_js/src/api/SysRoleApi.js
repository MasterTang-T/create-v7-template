import Request from '@/utils/request';

/**
 * 角色管理api
 *
 * @author chenjinlong
 * @date 2021/4/1 16:06
 */
export class SysRoleApi {
  /**
   * 新增
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static add(params) {
    return Request.post('/sysRole/add', params);
  }

  /**
   * 删除
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static del(params) {
    return Request.post('/sysRole/delete', params);
  }

  /**
   * 批量删除
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static batchDel(params) {
    return Request.post('/sysRole/batchDelete', params);
  }

  /**
   * 修改
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static edit(params) {
    return Request.post('/sysRole/edit', params);
  }

  /**
   * 角色分配菜单
   *
   * @author fengshuonan
   * @date 2021/8/11 10:42
   */
  static async grantMenu(params) {
    return await Request.post('/sysRole/grantMenu', params);
  }

  /**
   * 角色分配按钮
   *
   * @author fengshuonan
   * @date 2021/8/11 10:42
   */
  static async grantButton(params) {
    return await Request.post('/sysRole/grantButton', params);
  }

  /**
   * 分配接口
   *
   * @author fengshuonan
   * @date 2021/8/10 18:31
   */
  static async grantResource(params) {
    return await Request.post('/sysRole/grantResourceV2', params);
  }

  /**
   * 分配数据范围
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static async grantDataScope(params) {
    return await Request.post('/sysRole/grantDataScope', params);
  }
}
