import Request from '@/utils/request';

/**
 * 模型相关api
 *
 * @author stylefeng
 * @date 2021/06/25 22:17
 */
export class ModelApi {
  /**
   * 模型列表
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static modelList(params) {
    return Request.getAndLoadData('/flowableModel/list', params);
  }

  /**
   * 新增模型
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static add(params) {
    return Request.post('/flowableModel/add', params);
  }

  /**
   * 流程模型编辑
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static edit(params) {
    return Request.post('/flowableModel/edit', params);
  }

  /**
   * 删除模型
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static delete(params) {
    return Request.post('/flowableModel/delete', params);
  }

  /**
   * 模型查看
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static modelPreview(params) {
    return Request.getAndLoadData('/flowableModel/preview', params);
  }

  /**
   * 模型版本
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static modelVersion(params) {
    return Request.getAndLoadData('/flowableModel/version', params);
  }

  /**
   * 流程模型设为新版
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static setAsNew(params) {
    return Request.post('/flowableModel/setAsNew', params);
  }

  /**
   * 流程模型导入
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static modelImportModel(params) {
    return Request.post('/flowableModel/importModel', params);
  }

}
