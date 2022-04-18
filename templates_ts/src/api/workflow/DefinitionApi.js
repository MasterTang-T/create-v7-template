import Request from '@/utils/request';

/**
 * 流程定义api
 *
 * @author stylefeng
 * @date 2021/06/25 22:17
 */
export class DefinitionApi {
  /**
   * 部署流程定义
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static definitionDeploy(params) {
    return Request.post('/flowableDefinition/deploy', params);
  }

  /**
   * 删除流程定义
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static delete(params) {
    return Request.post('/flowableDefinition/delete', params);
  }

  /**
   * 导出流程文件
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static export(params) {
    return Request.get('/flowableDefinition/export', params);
  }

  /**
   * 映射流程定义，将已部署的流程映射到模型
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static mapping(params) {
    return Request.post('/flowableDefinition/mapping', params);
  }

  /**
   * 挂起流程定义
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static suspend(params) {
    return Request.post('/flowableDefinition/suspend', params);
  }

  /**
   * 激活流程定义
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static active(params) {
    return Request.post('/flowableDefinition/active', params);
  }

  /**
   * 流程定义的流程图
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static trace(params) {
    return Request.getAndLoadData('/flowableDefinition/trace', params);
  }

  /**
   * 流程定义的用户任务节点
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static flowableDefinitionUserTasks(params) {
    return Request.getAndLoadData('/flowableDefinition/userTasks', params);
  }

}
