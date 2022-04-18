import axios from 'axios';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import sm from 'sm-crypto';

// 定义公钥
const publicKey = `
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwiRWfPs7Qds9K+gbabar
xKOn71vZY9S7C5cmiTTmDoxvL8gixtlldbqaBCG0fhP48qxImw4jmAnXbSb51hDo
hTRXmGIuBEQuhIWwh28rorSiGuOye6PTbYNuup5CWwxMkD/ARHrs5Cvg9+vJTHXd
g3TrRbwiW6GniDvVGPcl0d9TshX5Dgo6m9VZkLJfHJkVKmjAOOvede8uPgaM1ymt
6JexjTcn6uiIrWlDkKTzvAq+Hb9cj9tz/Q5FKo17TF7oa4XC8lfximCzAvMwsl/k
mqfh0cSNqeoW9s8LcjY0o7YexYJB3+jjp88QbzqXnUNYMVGz0M2cYLmAaM2LVwWv
Vrfs1HCB1o+WqGqjaBql/4apVyhqf77Py6M+2WUr1yKgDfRXjZ1h9w9e3jh3oQdj
Sk36fboJmHXBnKwwoecxW5csVJmj/M7CPP7Xw8BPGV4/rMmRKjBRTv5XdcRnnMm8
nd8EdK/2AaXZqu0O2iRjQlFFgLNUzP+eudvLCA0+Dxczkpgvcr7S4oQtD+TCFm1g
WaC+Kho5liMQ7OV0L7tL8O+tzzbKmoVj/fg8uIG5ljqsU6rE5WFUCl1w0v8Gzx1Y
z3IXaRKmXTgmxZPdaN3nVA+YBT+N3EKQETVlN6w+65/HK/8ZsB36exrlkkxUo+y0
umk0DzFFY/9i1x2kU7wXPzECAwEAAQ==
-----END PUBLIC KEY-----
`

/**
 * http请求工具
 *
 * 封装axios的get和post方法，方便获取data结果，减少data.data的写法
 *
 * @author fengshuonan
 * @date 2021/4/2 16:09
 */
export default class Request {
  // 返回年月日 例如 20210101
  static getDate() {
    let date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(this.formatNumber).join('')
  }

  // 生成指定长度的字符串
  static generateRamStr(len = 6, charSet) {
    const chars = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()+-*/~`";
    let randomStr = "";
    for (let i = 0; i < len; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomStr;
  }

  // 返回年月日时分秒  例如 20210101121212
  static getDateTime() {
    let date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day, hour, minute, second].map(this.formatNumber).join('')
  }

  // 格式化数字
  static formatNumber(n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
  }

  // 生成uuid
  static uuid() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("")
  }

  /**
   * 封装get请求
   *
   * @author fengshuonan
   * @date 2021/4/2 16:13
   */
  static async get(url, params) {
    if (params === undefined) {
      params = {};
    }
    let result = await axios.get(url, {params});
    return result.data;
  }

  /**
   * 封装get请求(直接获取请求的结果)
   *
   * @author fengshuonan
   * @date 2021/4/2 16:13
   */
  static async getAndLoadData(url, params) {
    let result = await this.get(url, params);
    return result.data;
  }

  /**
   * 封装post请求
   *
   * @author fengshuonan
   * @date 2021/4/2 16:13
   */
  static async post(url, params) {
    if (params === undefined) {
      params = {};
    }
    let result = await axios.post(url, params);
    return result.data;
  }

  /**
   * 封装post请求
   *
   * @author fengshuonan
   * @date 2021/4/2 16:13
   */
  static async postAndLoadData(url, params) {
    let result = await this.post(url, params);
    return result.data;
  }

  /**
   * 封装post加密请求
   *
   * @author luojie
   * @date 2021/4/14 11:18
   */
  static async postEncryption(url, params) {
    if (params) {
      // 将data转为json字符串
      params = JSON.stringify(params);

      // 生成解密返回数据的key
      var aesKey = CryptoJS.MD5(this.uuid() + '-' + this.getDateTime() + '-' + this.generateRamStr(32)).toString();
      aesKey = CryptoJS.enc.Hex.parse(aesKey);
      var base64AesKey = CryptoJS.enc.Base64.stringify(aesKey)

      // 生成AES 加密偏移 iv
      var iv = CryptoJS.enc.Hex.parse(CryptoJS.MD5(base64AesKey + this.getDate()).toString());

      // AES 加密请求的内容
      // 使用AES加密请求的数据
      let cryptRequestStr = CryptoJS.AES.encrypt(params, aesKey, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      // 使用 RSA 公钥加密 请求响应解密的key
      const myEncrypt = new JSEncrypt()
      myEncrypt.setPublicKey(publicKey)
      const cryptRespKeyStr = myEncrypt.encrypt(base64AesKey)
      // 加密后的请求内容
      let reqDataObj = JSON.stringify({
        key: cryptRespKeyStr,
        data: cryptRequestStr
      })

      // 使用 SM4/ECB/PKCS5Padding 加密最终请求的内容 输出十六进制字符串
      let sm4Key = CryptoJS.MD5(this.getDate()).toString();
      params = {
        data: sm.sm4.encrypt(reqDataObj, sm4Key)
      }

    }

    // 发送post请求
    let result = await this.post(url, params);
    if (result.success) {
      try {
        // 使用AES 解密数据
        let encryptedStr = CryptoJS.AES.decrypt(result.data, aesKey, {
          iv: iv,
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.Pkcs7
        });
        let aesDecrypted = encryptedStr.toString(CryptoJS.enc.Utf8)
        result.data = JSON.parse(aesDecrypted)
      } catch (e) {
        console.error(e)
      }
    }
    return result;
  }
}
