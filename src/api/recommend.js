// 用jsonp来获取recommend的值
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getSongList(id) {
  const url = '/api/getSongList'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    disstid: id,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    song_begin: 0,
    song_num: 15,
    jsonpCallback: ''
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getH() {
  const url = '/api/getH'

  const data = Object.assign({}, commonParams, {
    wz: 5614,
    v: 1,
    c: 0
  })

  return axios.post(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
