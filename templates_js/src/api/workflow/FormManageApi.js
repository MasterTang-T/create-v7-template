import Request from '@/utils/request';

/**
 * 表单管理api
 *
 * @author fengshuonan
 * @date 2021/7/5 21:14
 */
export class FormManageApi {
  /**
   * 流程定义的开始表单
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static formStartFormData(params) {
    return Request.get('/flowableForm/startFormData', params);
  }

  /**
   * 获取任务的表单信息
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static taskFormData(params) {
    return Request.getAndLoadData('/flowableForm/taskFormData', params);
  }
}
