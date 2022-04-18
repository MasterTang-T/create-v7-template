import Request from '@/utils/request';

/**
 * 租户表api
 *
 * @author fengshuonan
 * @date 2021/05/27 18:10
 */
export class SysTenantApi {
  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2021/05/27 18:10
   */
  static add(params) {
    return Request.post('/sysTenant/register', params);
  }

  /**
   * 修改
   *
   * @author fengshuonan
   * @date 2021/05/27 18:10
   */
  static edit(params) {
    return Request.post('/sysTenant/edit', params);
  }

  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2021/05/27 18:10
   */
  static delete(params) {
    return Request.post('/sysTenant/delete', params);
  }

  /**
   * 获取租户下拉列表
   *
   * @author fengshuonan
   * @date 2021/05/27 18:10
   */
  static async dropDownList() {
    let result = await Request.getAndLoadData('/sysTenant/tenantDropdown');
    result.unshift({ companyName: '管理端', tenantCode: 'master' });
    return result;
  }
}
