/*
 * @Author your name
 * @date 2021/04/03 23:25
 * @LastEditTime 2021/04/08 20:17
 * @LastEditors Please set LastEditors
 * @Description In User Settings Edit
 * @FilePath /guns-vue-antd-admin/src/api/PublishApi.js
 */
import Request from "@/utils/request"
/**
 * 系统通知管理api
 * 
 * @author laihongliang
 * @date 2021/04/04 00:29
 */
export default class PublishApi{
    
    /**
     * 新建系统通知
     * 
     * @author laihongliang
     * @date 2021/04/04 00:29
     * @param {*} params
     */
    static addPublish(params){
        return Request.post("/sysNotice/add",params)
    }

    /**
     * 编辑系统消息
     * @author laihongliang
     * @date 2021/04/07 23:03
     * @param {*} params
     */
    static editPublish(params){
        return Request.post("/sysNotice/edit",params)
    }
}