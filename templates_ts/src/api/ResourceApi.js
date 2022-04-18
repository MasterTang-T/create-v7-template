import Request from '@/utils/request';

/**
 * 菜单管理api
 *
 * @author jiawei
 * @date 2021/4/7 11:47
 */
export class ResourceApi {
  /**
   * 获取资源列表
   *
   * @author jiawei
   * @date 2021/4/8 11:47
   */
  static async getResourceList(params) {
    return await Request.get('/resource/pageList', params);
  }

}
