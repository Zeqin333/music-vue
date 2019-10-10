import { playMode } from 'common/js/config'

const state = {
  singer: [],
  playing: false,   // 播放器的播放狀態
  fullScreen: false, // 全屏和缩小
  playlist: [], // 播放列表
  sequencelist: [], // 播放模式，多种播放模式
  mode: playMode.sequence, // 语义化
  currentIndex: -1, // 当前播放的索引
  disc: {},
  topList: {}
}

export default state
