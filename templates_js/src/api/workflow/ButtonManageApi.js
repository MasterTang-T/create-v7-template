import Request from '@/utils/request';

/**
 * 按钮管理api
 *
 * @author stylefeng
 * @date 2021/06/25 22:17
 */
export class ButtonManageApi {
  /**
   * 添加活动节点按钮
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static add(params) {
    return Request.post('/flowableButton/add', params);
  }

  /**
   * 删除活动节点按钮
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static buttonDelete(params) {
    return Request.post('/flowableButton/delete', params);
  }

  /**
   * 编辑活动节点按钮
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static buttonEdit(params) {
    return Request.post('/flowableButton/edit', params);
  }

  /**
   * 查看活动节点按钮
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static buttonDetail(params) {
    return Request.getAndLoadData('/flowableButton/detail', params);
  }

  /**
   * 根据流程定义查询活动节点按钮列表（用于定义配置按钮）
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static buttonList(params) {
    return Request.getAndLoadData('/flowableButton/list', params);
  }

  /**
   * 根据任务id查询当前活动节点按钮
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static buttonTrace(params) {
    return Request.getAndLoadData('/flowableButton/trace', params);
  }
}
