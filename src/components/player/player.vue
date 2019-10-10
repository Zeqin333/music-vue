<template>
  <div class="player-wrapper" v-show="playlist.length > 0">
    <transition name="normal">
      <div class="normal" v-show="fullScreen">
        <div class="bgImage">
          <img :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div @click="back" class="back">
            <i class="icon-back"></i>
          </div>
          <h2 class="name">{{currentSong.name}}</h2>
          <h3 class="singer">{{currentSong.singer}}</h3>
        </div>
        <div class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="cdWrapper">
            <div class="cd-wrapper">
              <div class="cd" :class="cdRotate">
                <img :src="currentSong.image" class="image" alt="">
              </div>
            </div>
            <div class="playingLyric" v-if="currentLyric">{{playingLyric}}</div>
          </div>
          <scroll class="middle-r" ref="lineList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div class="lyric"  v-if="currentLyric">
                <p class="item" ref="lineLyric" :class="{'current': currentLineNum === index}" v-for="(line, index) in (currentLyric.lines)">{{line.txt}}</p>
              </div>
              <div class="no-lyric" v-if="!currentLyric">
                <p class="text">暂时还没有歌词</p>
              </div>
            </div>
          </scroll>
          
        </div>
        <div class="bottom">
          <div class="dots-wrapper">
            <div class="dot" :class="{'active': currentShow === 'cd'}"></div>
            <div class="dot" :class="{'active': currentShow === 'lyric'}"></div>
          </div>
          <div class="progress-wrapper">
            <span class="begin">{{format(currentTime)}}</span>
            <div class="progress-content">
              <progress-bar @changePercent="changePercent" :percent="percent"></progress-bar>
            </div>
            <span class="totalTime">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="min">
      <div class="min-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" :class="cdRotate" alt="">
        </div>
        <div class="text">
          <h3 class="name">{{currentSong.name}}</h3>
          <p class="singer">{{currentSong.singer}}</p>
        </div>
        <div class="play">
          <i @click.stop="togglePlay" :class="miniPlay"></i>
        </div>
        <div class="play-list">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import progressBar from 'base/progress-bar/progress-bar'
import {getLyric} from 'common/js/song'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: '',
      currentShow: 'cd'
    }
  },
  created() {
    this.touch = {}
    this.time = 300
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequencelist'
    ]),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlay() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdRotate() {
      return this.playing ? 'playm' : 'playm pausem'  // 这里必须要加上playm,暂停之后就会出现变回原形的现象
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    togglePlay() {
      this.setPlayingStar(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
        this.songReady = false
      }
    },
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
        this.songReady = false
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingStar(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true  // 当音频还没有加载完全的时候，如果这个不为true那么前进后退的按钮都不会有效果
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60 | 0)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < 2) {
        num = '0' + num
        len++
      }
      return num
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        // eslint-disable-next-line
        if (this.currentSong.lyric !== lyric) { 
          return
        }
        this.currentLyric = new Lyric(lyric, this.handler)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 当我们出现了错误之后，我们需要初始化currentLyric
        this.currentLyric = null
        this.currentLineNum = 0
        this.playingLyric = ''
      })
    },
    handler({lineNum, txt}) {
      this.currentLineNum = lineNum
      this.playingLyric = txt
      if (lineNum > 5) {
        let lineEl = this.$refs.lineLyric[lineNum - 5]
        this.$refs.lineList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lineList.scrollTo(0, 0, 1000)
      }
    },
    changePercent(newPercent) {
      const currentTime = newPercent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode() {
      let mode = (this.mode + 1) % 3 // 保持模式一直都在0到2之间的一种方法
      this.setMode(mode)
      // 真正的来改变我们的playlist
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequencelist)
      } else {
        list = this.sequencelist
      }
      this.resetCurrentIndex(list) // 因为模式的改变，我们的id也需要发生相应的改变
      this.setPlaylist(list) // 改变模式，改变歌曲列表
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    middleTouchStart(e) {
      this.touch.initStart = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initStart) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth // 记录自己滑动过还是没有滑动过
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lineList.$el.style.transform = `translate3d(${offsetWidth}px, 0 ,0)`
      this.$refs.lineList.$el.style.transitionDuration = 0
      this.$refs.cdWrapper.style.transform = `translate3d(${offsetWidth}px, 0 ,0)`
      this.$refs.cdWrapper.style.transitionDuration = 0
    },
    middleTouchEnd(e) {
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      let offsetWidth = 0
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
        }
      } else {
        if (this.touch.percent < 0.8) {
          offsetWidth = 0
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
        }
      }
      this.$refs.lineList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lineList.$el.style.transitionDuration = `${this.time}ms`
      this.$refs.cdWrapper.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.cdWrapper.style.transitionDuration = `${this.time}ms`
      this.touch.initStart = false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingStar: 'SET_PLAYING_STAR',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setMode: 'SET_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong === oldSong) {
        return
      }
      this.$nextTick(() => {
        this.getLyric()
        this.$refs.audio.play()
      })
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    playing(newPlaying) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    progressBar,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.player-wrapper
  .normal
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    &.normal-enter-active, &.normal-leave-active
      transition all 0.3s
      .top,.bottom 
        transition all 0.3s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom 
        transform translate3d(0, 100px, 0)
    .bgImage
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      img 
        width 100% 
        height 100%
    .top 
      position relative 
      margin-bottom 25px
      .back 
        position absolute 
        left 6px 
        top 0 
        z-index 50
        .icon-back 
          display block 
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg) //将一个图片进行旋转  translate是
      .name,.singer 
        color $color-text
        no-wrap()
        z-index 49
        text-align center
      .name
        width 70%
        margin 0 auto 
        line-height 40px
        text-align center
        font-size $font-size-large
      .singer
        line-height 20px
        font-size $font-size-medium

    .middle
      position fixed 
      width 100%
      top 80px 
      bottom 170px
      white-space nowrap
      font-size 0
      overflow hidden
      .middle-l
        position relative 
        display inline-block
        vertical-align top
        width 100% 
        height 0 
        padding-top 80%
        .playingLyric 
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          height 20px 
          line-height 20px
          font-size $font-size-medium
          color $color-text-l
          letter-spacing 2px
        .cd-wrapper
          position absolute
          left 10%
          top 0 
          width 80% 
          height 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.playm   
              animation rotate 20s linear infinite
            &.pausem 
              animation-play-state paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%
      .middle-r
        display inline-block
        width 100% 
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80% 
          margin: 0 auto
          overflow hidden
          text-align center
          font-size $font-size-medium
          color $color-text-l
          .no-lyric 
            .text 
              padding-top 40%
          .lyric 
            .item 
              height 32px 
              line-height 32px
              &.current 
                color $color-text
    .bottom 
      position absolute 
      width 100% 
      bottom 50px
      .dots-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle 
          margin 0 4px
          width 8px 
          height 8px
          border-radius 50%
          background $color-text-l 
          &.active 
            width 20px
            border-radius 5px
            background $color-text-ll
      .progress-wrapper 
        display flex 
        width 80% 
        margin 0 auto
        align-items center
        padding 10px 0
        .begin,.totalTime 
          display inline-block
          font-size $font-size-small
          color $color-text
          flex 0 0 30px
          line-height 30px 
          width 30px
        .begin 
          text-align left 
        .totalTime 
          text-align right
        .progress-content
          flex 1
        // .totalTime
      .operators
        display flex
        align-items center 
        .icon 
          flex 1
          color $color-theme
          i
            font-size 30px 
        .i-left 
          text-align right 
        .i-center 
          text-align center
          i 
            font-size 40px
        .i-right 
          text-align left
    
  .min-player
    position fixed 
    left 0
    bottom 0
    width 100% 
    height 60px
    background $color-highlight-background
    display flex
    z-index 180
    align-items center
    &.min-enter-active, &.min-leave-active
      transition all 0.3s
    &.min-enter, &.min-leave-to
      opacity 0
    .icon 
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px 
      img 
        width 40px
        height 40px
        border-radius 50%
        &.playm
          animation rotate 10s linear infinite
        &.pausem
          animation-play-state paused
    .text
      display flex 
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name, .singer
        flex 1 
        no-wrap()
      .name 
        font-size $font-size-medium
        color $color-text
        margin-bottom 2px
      .singer 
        font-size $font-size-small
        color $color-text-d
    .play,.play-list 
      flex 0 0 30px
      font-size 30px
      width 30px
      padding 0 10px
      color $color-theme 
    // .play-list
    //   color $color-theme 
    //   font-size 30px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>