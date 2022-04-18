import Request from '@/utils/request';

/**
 * 接口元数据api
 *
 * @author fengshuonan
 * @date 2021/4/12 15:44
 */
export class InterfaceApi {
  /**
   * 获取资源树
   *
   * @author fengshuonan
   * @date 2021/4/12 15:45
   */
  static getResourceTree(params) {
    return Request.getAndLoadData('/resource/getTree', params);
  }

  /**
   * 获取资源的详情
   *
   * @author fengshuonan
   * @date 2021/4/12 15:45
   */
  static getDetail(params) {
    return Request.getAndLoadData('/resource/getDetail', params);
  }
}
