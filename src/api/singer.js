// 用jsonp来获取recommend的值
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getSingers() {
  const url = 'https://shc.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 5381,
    jsonCallback: 'GetSingerListCallback',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    jsonCallback: 'MusicJsonCallbacksinger_track',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    singermid: singerId,
    needNewCode: 0,
    begin: 0,
    num: 30,
    songstatus: 1,
    order: 'listen'
  })
  return jsonp(url, data, options)
}
