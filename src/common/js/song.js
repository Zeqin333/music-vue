import {getLyric} from 'api/song'
import { ERR_OK } from 'api/config'

let formtag = 38
let vkey = 'DF2A86E852EBC41BF62D7B5FBE983EA98876CF48B23C085C617F33382436B2C097E6207E167BFDAB366E167F28DEF84F5DAB64608150AD3F'
let guid = 5247006540

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url, strMediaMid}) {
    // eslint-disable-next-line
    this.id = id,
    this.mid = mid,
    this.singer = singer,
    this.name = name,
    this.album = album,
    this.duration = duration,
    this.image = image,
    this.url = url,
    this.strMediaMid = strMediaMid
  }
  getLyric() {
    // getLyric(this.id).then((res) => {
    //   if (res.retcode === ERR_OK) {
    //     this.lyric = res.lyric
    //     console.log(this.lyric)
    //   } else {
    //     console.log('錯誤')
    //   }
    // })
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = res.lyric
          // eslint-disable-next-line
          resolve (this.lyric)
        } else {
          // eslint-disable-next-line
          reject ('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    strMediaMid: musicData.strMediaMid,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a?fromtag=${formtag}&vkey=${vkey}&guid=${guid}`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
// http://dl.stream.qqmusic.qq.com/C400000DUGZM0I0cSK.m4a?fromtag=38&vkey=E5E8F0A26ED005082CD1E95E51E9A8C615B8408F9596468D32945FE56DD7A596E13EF86C611C764B32B4C9992E37EB23F8A2F231B9ED80B1&guid=5247006540

export function createSongItem(musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.mid}.m4a?guid=${guid}&vkey=${vkey}&uin=0&fromtag=999`
  })
}