import Request from '@/utils/request';

/**
 * 接口分组操作api
 *
 * @author luojie
 * @date 2021/5/22 15:45
 */
export class ApiGroupApi {

  /**
   * 接口分组下拉列表
   * @returns {Promise<*>}
   */
  static apiGroupList() {
    return Request.get('/apiGroup/list');
  }

  /**
   * 接口分组树
   * @returns {Promise<*>}
   */
  static apiGroupTree(params) {
    return Request.getAndLoadData('/apiGroup/tree', params);
  }

  /**
   * 新增接口分组
   * @param params
   * @returns {Promise<any>}
   */
  static add(params) {
    return Request.post('/apiGroup/add', params);
  }

  /**
   * 修改接口分组
   * @param params
   * @returns {Promise<any>}
   */
  static edit(params) {
    return Request.post('/apiGroup/edit', params);
  }

  /**
   * 获取接口分组详情
   * @param params
   * @returns {Promise<any>}
   */
  static detail(params) {
    return Request.get('/apiGroup/detail', params);
  }


  /**
   * 获取接口分组详情
   * @param params
   * @returns {Promise<any>}
   */
  static delete(params) {
    return Request.post('/apiGroup/delete', params);
  }

  /**
   * 获取接口分组树
   * @param params
   * @returns {Promise<any>}
   */
  static groupTree(params) {
    return Request.getAndLoadData('/apiGroup/groupTree', params);
  }

  /**
   * 接口分组树修改排序
   * @param params
   * @returns {Promise<any>}
   */
  static editTreeSort(params) {
    return Request.post('/apiGroup/editTreeSort', params);
  }

}
