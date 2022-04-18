import Request from '@/utils/request';

/**
 * 登录日志api
 *
 * @author luojie
 * @date 2021/4/13 09:52
 */
export class LoginLogApi {

  /**
   * 清空全部登录日志
   *
   * @author luojie
   * @date 2021/4/13 09:52
   */
  static deleteAll() {
    return Request.get('/loginLog/deleteAll');
  }

}
