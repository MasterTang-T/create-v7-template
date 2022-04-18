import Request from '@/utils/request';

/**
 * 申请草稿
 *
 * @author fengshuonan
 * @date 2021/7/5 21:14
 */
export class FormManageApi {
  /**
   * 添加/编辑申请草稿
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static draftAdd(params) {
    return Request.post('/flowableDraft/addOrUpdate', params);
  }

  /**
   * 申请草稿删除，提交成功删除，和主动删除
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static draftDelete(params) {
    return Request.post('/flowableDraft/delete', params);
  }
}
