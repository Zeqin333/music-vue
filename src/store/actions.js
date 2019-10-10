import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import { playMode } from 'common/js/config'

function findIndex(randomList, song) {
  return randomList.findIndex((item) => {
    return item.id === song.id
  })
}

export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_PLAYING_STAR, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENTINDEX, index)
}

export function randomPlay({ commit, state }, {list}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCELIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_PLAYING_STAR, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENTINDEX, 0)
}

export function insertSong({commit, state}, item) {
  // 判断这首歌是否有，如果有，则先添加，有删除原歌
}
