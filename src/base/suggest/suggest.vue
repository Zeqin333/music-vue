<template>
  <scroll class="suggest-wrapper">
    <ul class="suggest-list">
      <li @click="gotoPlayer(item)" v-for="item in result" class="item">
        <div class="icon">
          <i class="name-icon" :class="changeIcon(item)"></i>
        </div>
        <div class="name">
          <p class="song-name" v-html="getSongItem(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>


<script>
import Scroll from 'base/scroll/scroll'
import {getSearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSongItem} from 'common/js/song'
import {mapMutations, mapActions} from 'vuex'

let TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      result: [],
      page: 1
    }
  },
  methods: {
    _search(newQuery) {
      getSearch(newQuery, this.page, this.showSinger).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
        }
      })
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.zhida_singer && data.zhida.zhida_singer.singerID) {
        // es6中的语法
        ret.push({...data.zhida.zhida_singer, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeList(data.song.list))
      }
      return ret
    },
    _normalizeList(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.id && musicData.album.mid) {
          ret.push(createSongItem(musicData))
        }
      })
      return ret
    },
    changeIcon(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getSongItem(item) {
      if (item.type === TYPE_SINGER) {
        return item.singerName
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    gotoPlayer(item) {
      if (item.type === TYPE_SINGER) {
        console.log(item)
        // eslint-disable-next-line
        const singer = new Object({
          id: item.singerMID,
          name: item.singerName,
          avator: item.singerPic
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newQuery) {
      this._search(newQuery)
    }
  },
  components: {
    Scroll
  }
}
</script>


<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  @import '../../common/stylus/mixin'

  .suggest-wrapper
    height 100%
    overflow hidden
    .suggest-list 
      padding 0 30px 20px 30px
      .item
        display flex 
        align-items center 
        padding-top 20px
        .icon
          flex 0 0 30px 
          width 30px 
          .name-icon 
            font-size $font-size-medium
            color $color-text-d
        .name
          flex 1
          font-size $font-size-medium
          color $color-text-d 
          overflow hidden
          .song-name
            no-wrap()
</style>