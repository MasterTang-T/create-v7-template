import Request from '@/utils/request';

/**
 * 数据迁移API
 *
 * @author majianguo
 * @date 2021/7/7 11:08
 */
export class MigrationApi {

  /**
   * 备份指定数据列表
   *
   * @author majianguo
   * @date 2021/7/7 11:08
   */
  static migrationSelectData(params) {
    return Request.get('/dataMigration/migrationSelectData', params);
  }

  /**
   * 获取所有可备份数据列表
   *
   * @author majianguo
   * @date 2021/7/7 11:08
   */
  static getAllMigrationList(params) {
    return Request.get('/dataMigration/getAllMigrationList', params);
  }

  /**
   * 恢复备份数据
   *
   * @author majianguo
   * @date 2021/7/7 11:08
   */
  static restoreData(params) {
    return Request.post('/dataMigration/restoreData', params);
  }
}
