// 用jsonp来获取recommend的值
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getRankList(id) {
  const url = '/api/getRankList'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function gotoRankList(id) {
  const url = '/api/gotoRankList'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}