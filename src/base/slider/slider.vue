<template>
  <div class="slider-wrapper" ref="sliderWrapper">
    <ul class="slider-content" ref="sliderContent">
      <slot></slot>
    </ul>
    <ul class="dots">
      <li v-for="(dot, index) in dots" :class="{'active': currentIndex === index}" class="dot-item"></li>
    </ul>
  </div>
</template>

<script>
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderContent.children

      let width = 0
      let sliderWidth = this.$refs.sliderWrapper.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderContent.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.sliderWrapper, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3
        },
        snapSpeed: 400
      })

      this.slider.on('scrollEnd', () => {
        let pageX = this.slider.getCurrentPage().pageX
        this.currentIndex = pageX
        if (this.autoPlay) {
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      let pageIndex = this.currentIndex + 1
      if (pageIndex === 5) {
        pageIndex = 0
      }
      // 这里的自动循环播放不能够无缝播放该怎么办
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  activated() {
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'

  .slider-wrapper
    mix-height 1px
    .slider-content 
      position relative
      overflow hidden
      white-space nowrap
      .item 
        float left
        box-sizing:border-box
        text-align:center
        overflow hidden 
        a  
          display:block
          width 100% 
          text-decoration none
          overflow hidden 
          img 
            display block 
            width 100%
    .dots 
      position:absolute 
      left:0 
      right:0
      bottom:10px 
      text-align:center
      font-size:0
      .dot-item
        display:inline-block
        width 8px
        height 8px
        border-radius 50%
        margin 0 4px
        background $color-text-l
        &.active 
          width: 20px 
          border-radius 5px
          background $color-text-ll

</style>