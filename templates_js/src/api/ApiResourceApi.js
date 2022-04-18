import Request from '@/utils/request';

/**
 * 接口分组资源操作api
 *
 * @author luojie
 * @date 2021/5/24 15:50
 */
export class ApiResourceApi {

  /**
   * 新增资源
   * @param params
   * @returns {Promise<any>}
   */
  static add(params) {
    return Request.post('/apiResource/add', params);
  }

  /**
   * 资源详情
   * @param params
   * @returns {Promise<any>}
   */
  static detail(params) {
    return Request.getAndLoadData('/apiResource/detail', params);
  }

  /**
   * 获取资源所有字段
   *
   * @param params
   * @returns {Promise<any>}
   */
  static allField(params) {
    return Request.getAndLoadData('/apiResource/allField', params);
  }

  /**
   * 编辑资源
   *
   * @param params
   * @returns {Promise<any>}
   */
  static edit(params) {
    return Request.post('/apiResource/edit', params);
  }

  /**
   * 删除资源
   *
   * @param params
   * @returns {Promise<any>}
   */
  static delete(params) {
    return Request.post('/apiResource/delete', params);
  }


  /**
   * 发送请求
   *
   * @param params
   * @returns {Promise<any>}
   */
  static record(params) {
    return Request.post('/apiResource/record', params);
  }

  /**
   * 重置
   *
   * @param params
   * @returns {Promise<any>}
   */
  static reset(params) {
    return Request.post('/apiResource/reset', params);
  }



}
