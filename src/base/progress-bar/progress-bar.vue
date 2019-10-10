<template>
  <div class="progress-container" @click="progressClick">
    <div class="bar-inner" ref="progressBar" >
      <div class="progress" ref="progress" ></div>
      <div class="btn-wrapper" ref="btn"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend="touchEnd"
      >
        <div class="btn" ></div>
      </div>
    </div>
  </div>
</template>


<script>
const btnWidth = 16

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    _offset(val) {
      this.$refs.btn.style.transform = `translate3d(${val}px, 0, 0)`
      this.$refs.progress.style.width = `${val}px`
    },
    touchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, deltaX + this.touch.left))
      this._offset(offsetWidth)
    },
    touchEnd(e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) {
      // 下面的那种直接获取offsetX的方式，肯能会出现bug ，可以使用如下方法
      // const rect = this.$refs.progress.getBoundingClientRect() // 获取最左边和屏幕最左边的距离
      // const offsetX = e.pageX - rect
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - btnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('changePercent', percent)
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - btnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import '../../common/stylus/variable'

  .progress-container
    height 30px
    .bar-inner
      position relative 
      top 13px
      height 4px
      width 100% 
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute 
        height 100%
        background $color-theme
      .btn-wrapper
        position absolute 
        width 30px 
        height 30px 
        top -13px 
        left -8px
        .btn
          position relative 
          top 7px 
          left 8px
          width 16px 
          height 16px 
          box-sizing border-box
          border 3px solid $color-text 
          border-radius 50%
          background $color-theme
</style>