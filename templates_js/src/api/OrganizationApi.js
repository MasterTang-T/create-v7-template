import Request from '@/utils/request';

/**
 * 机构管理的api
 *
 * @author chenjinlong
 * @date 2021/4/8 11:43
 */
export class OrganizationApi {

  /**
   * 树
   *
   * @author chenjinlong
   * @date 2021/4/8 11:43
   */
  static tree(params) {
    return Request.get('/hrOrganization/roleBindOrgScopeAntdv', params);
  }

  /**
   * 新增
   *
   * @author chenjinlong
   * @date 2021/4/8 11:43
   */
  static add(params) {
    return Request.post('/hrOrganization/add', params);
  }

  /**
   * 删除
   *
   * @author chenjinlong
   * @date 2021/4/8 11:45
   */
  static del(params) {
    return Request.post('/hrOrganization/delete', params);
  }

  /**
   * 批量删除
   *
   * @author chenjinlong
   * @date 2021/4/8 11:45
   */
  static batchDel(params) {
    return Request.post('/hrOrganization/batchDelete', params);
  }

  /**
   * 修改
   *
   * @author chenjinlong
   * @date 2021/4/8 11:45
   */
  static edit(params) {
    return Request.post('/hrOrganization/edit', params);
  }

  /**
   * 查看详情
   *
   * @author chenjinlong
   * @date 2021/4/8 11:46
   */
  static detail(params) {
    return Request.post('/hrOrganization/detail', params);
  }

  /**
   * 更新状态
   *
   * @author chenjinlong
   * @date 2021/4/8 13:41
   */
  static updateStatus(params) {
    return Request.post('/hrOrganization/updateStatus', params);
  }
}
