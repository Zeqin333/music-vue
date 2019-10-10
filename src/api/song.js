// 用jsonp来获取recommend的值
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getLyric(id) {
  const url = '/api/getLyric'

  const data = Object.assign({}, commonParams, {
    nobase64: 1,
    musicid: id,
    songtype: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}