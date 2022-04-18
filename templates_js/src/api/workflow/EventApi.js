import Request from '@/utils/request';

/**
 * 事件管理api
 *
 * @author fengshuonan
 * @date 2021/6/28 15:10
 */
export class EventApi {
  /**
   * 添加流程事件
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static eventAdd(params) {
    return Request.post('/flowableEvent/add', params);
  }

  /**
   * 编辑流程事件
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static eventEdit(params) {
    return Request.post('/flowableEvent/edit', params);
  }

  /**
   * 删除流程事件
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static eventDelete(params) {
    return Request.post('/flowableEvent/delete', params);
  }

  /**
   * 查看流程事件
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static eventDetail(params) {
    return Request.getAndLoadData('/flowableEvent/detail', params);
  }
}
