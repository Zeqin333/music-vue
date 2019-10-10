<template>
  <div class="music-list">
    <div @click="back" class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="name">{{title}}</h1>
    <div class="bigImage" :style="bgStyle" ref="bgImage">
      <div class="playMode">
        <div class="play" ref="playMode" @click="random">
          <i class="icon-play"></i>
          <span class="desc">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :list-scroll="listenScroll" :data="songs" :probe-type="probetype" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @getSong="getSong" :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-content">
        <loading ></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex' // 获取actions中相关的操作的方法
import {playListMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40
export default {
  mixins: [playListMixin],
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  created() {
    this.probetype = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    getSong(song, index) {
      // 此时因为song-list选择了播放的歌曲，意味着选择了当前的各方列表，然后播放页面出现，所以需要控制相关的参数，来出现播放列表
      // 此时在store中的action中来设置相关的参数
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTranslateY, newVal)
      let zIndex = 0
      let scale = 1
      let blur = 0
      let layerS = this.$refs.layer.style
      let bgImageS = this.$refs.bgImage.style
      let playMode = this.$refs.playMode.style
      let filter = this.$refs.filter.style
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }

      layerS.transform = `translate3d(0, ${translateY}px, 0)`
      filter.backdrop = `blur(${blur}px)`
      if (newVal < this.minTranslateY) {
        zIndex = 10
        bgImageS.paddingTop = 0
        bgImageS.height = `${RESERVED_HEIGHT}px`
        playMode.display = `none`
      } else {
        bgImageS.paddingTop = `70%`
        bgImageS.height = 0
        playMode.display = ''
      }
      bgImageS.transform = `scale(${scale})`
      bgImageS.zIndex = zIndex
    }
  },
  components: {
    Scroll,
    songList,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
.music-list
  position: fixed
  z-index 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $color-background
  .back 
    position absolute 
    left 6px 
    top 0
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .name
    position absolute 
    width 100% 
    text-align center
    line-height 40px
    font-size: $font-size-large
    color: $color-text
    z-index 49
  .bigImage
    position relative 
    width 100%
    height 0 
    padding-top 70%
    transform-origin top
    background-size cover
    .playMode 
      position absolute
      bottom 20px 
      width 100%
      z-index 50
      .play 
        box-sizing border-box 
        width 135px
        margin 0 auto
        padding 7px 0
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        text-align center
        font-size 0
        .icon-play 
          font-size $font-size-medium-x
          vertical-align middle
        .desc 
          font-size $font-size-small
          vertical-align middle
          margin-left 6px
    .filter
      position absolute 
      top 0
      left 0 
      width 100% 
      height 100%
      background rgba(7,17,27,0.4)
  .bg-layer 
    position relative 
    height 100% 
    background $color-background
  .list 
    position fixed 
    top 0 
    bottom 0
    width 100%
    background $color-background
    .song-list-wrapper 
      padding 20px 30px
</style>