import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotSearch() {
  const url = '/api/getHotSearch'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSearch(query, page, zhida) {
  const url = '/api/getSearch'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n: 20,
    catZhida: zhida ? 1 : 0,
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.song',
    t: 0,
    aggr: 1,
    cr: 1,
    lossless: 0,
    flag_qc: 0,
    jsonpCallback: '',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}