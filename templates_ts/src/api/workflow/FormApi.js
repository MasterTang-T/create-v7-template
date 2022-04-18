import Request from '@/utils/request';

/**
 * 表单api
 *
 * @author fengshuonan
 * @date 2021/6/28 15:10
 */
export class FormApi {
  /**
   * 表单添加
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formAdd(params) {
    return Request.post('/flowableForm/add', params);
  }

  /**
   * 表单编辑
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formEdit(params) {
    return Request.post('/flowableForm/edit', params);
  }

  /**
   * 删除表单
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formDelete(params) {
    return Request.post('/flowableForm/delete', params);
  }
}
