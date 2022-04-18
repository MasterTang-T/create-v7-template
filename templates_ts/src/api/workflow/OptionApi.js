import Request from '@/utils/request';

/**
 * 流程选项的api
 *
 * @author stylefeng
 * @date 2021/06/25 22:17
 */
export class OptionApi {
  /**
   * 根据流程定义查询选项列表
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static optionList(params) {
    return Request.getAndLoadData('/flowableOption/list', params);
  }

  /**
   * 编辑流程选项
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static edit(params) {
    return Request.post('/flowableOption/edit', params);
  }

  /**
   * 查看流程选项
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static optionDetail(params) {
    return Request.getAndLoadData('/flowableOption/detail', params);
  }
}
