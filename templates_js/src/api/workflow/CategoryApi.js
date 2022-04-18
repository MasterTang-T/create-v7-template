import Request from '@/utils/request';

/**
 * 流程分类
 *
 * @author stylefeng
 * @date 2021/06/25 22:17
 */
export class CategoryApi {
  /**
   * 流程分类列表
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static categoryList(params) {
    return Request.getAndLoadData('/flowableCategory/list', params);
  }

  /**
   * 流程分类新增
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static add(params) {
    return Request.post('/flowableCategory/add', params);
  }

  /**
   * 流程分类删除
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static delete(params) {
    return Request.post('/flowableCategory/delete', params);
  }

  /**
   * 流程分类编辑
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static edit(params) {
    return Request.post('/flowableCategory/edit', params);
  }

}
