import Request from '@/utils/request';

/**
 * 流程入口相关api
 *
 * @author fengshuonan
 * @date 2021/6/28 15:10
 */
export class ShortCutApi {
  /**
   * 添加流程申请入口
   *
   * @author fengshuonan
   * @date 2021/7/1 22:14
   */
  static add(params) {
    return Request.post('/flowableShortcut/add', params);
  }

  /**
   * 删除流程申请入口
   *
   * @author fengshuonan
   * @date 2021/7/1 22:14
   */
  static del(params) {
    return Request.post('/flowableShortcut/delete', params);
  }

  /**
   * 编辑流程申请入口
   *
   * @author fengshuonan
   * @date 2021/7/1 22:14
   */
  static edit(params) {
    return Request.post('/flowableShortcut/edit', params);
  }

  /**
   * 流程申请入口列表
   *
   * @author fengshuonan
   * @date 2021/7/1 22:14
   */
  static flowableShortcutList(params) {
    return Request.getAndLoadData('/flowableShortcut/list', params);
  }
}
