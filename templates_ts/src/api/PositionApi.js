import Request from '@/utils/request';

/**
 * 职位管理的api
 *
 * @author fengshuonan
 * @date 2021/4/8 11:43
 */
export class PositionApi {
  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2021/4/8 11:43
   */
  static add(params) {
    return Request.post('/hrPosition/add', params);
  }

  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2021/4/8 11:45
   */
  static del(params) {
    return Request.post('/hrPosition/delete', params);
  }

  /**
   * 批量删除
   *
   * @author fengshuonan
   * @date 2021/4/8 11:45
   */
  static batchDel(params) {
    return Request.post('/hrPosition/batchDelete', params);
  }

  /**
   * 修改
   *
   * @author fengshuonan
   * @date 2021/4/8 11:45
   */
  static edit(params) {
    return Request.post('/hrPosition/edit', params);
  }

  /**
   * 查看详情
   *
   * @author fengshuonan
   * @date 2021/4/8 11:46
   */
  static detail(params) {
    return Request.post('/hrPosition/detail', params);
  }

  /**
   * 更新状态
   *
   * @author fengshuonan
   * @date 2021/4/8 13:41
   */
  static updateStatus(params) {
    return Request.post('/hrPosition/updateStatus', params);
  }
}
