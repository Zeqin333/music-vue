<template>
  <scroll class="listView-wrapper" :data="datas" ref="listView" @scroll="scroll" :listScroll="listScroll" :probeType="probeType">
    <ul class="listView-content">
      <li v-for="one in datas" class="listView-item" ref="listViewItem">
        <h1 class="bigTitle">{{one.title}}</h1>
        <ul class="list">
          <li @click="sOs(item)" v-for="item in one.items" class="item">
            <img v-lazy="item.avator" alt="" class="avatorImg">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul @touchstart="onShortcutTouchStart" class="titleList" @touchmove.stop.prevent="onShortcutTouchMove">
      <li v-for="(oneItem, index) in shorCutList" :class="{'active': currentIndex===index}"  class="title-item" :data-index="index">{{oneItem}}</li>
    </ul>
    <div v-show="fixTitle" class="fix-title" ref="fixTitle">
      <h1 class="bigTitle">{{fixTitle}}</h1>
    </div>
    <div v-if="datas" class="loading-content">
      <loading :text="text"></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getDate} from 'common/js/dom'
import loading from 'base/loading/loading'
const listHeight = 18
const TITLE_HEIGHT = 30

export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    datas: {
      type: Array,
      default: []
    }
  },
  computed: {
    shorCutList() {
      return this.datas.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.datas[this.currentIndex] ? this.datas[this.currentIndex].title : ''
    }
  },
  created() {
    this.touch = {}
    this.listScroll = true
    this.listHeight = []
    this.probeType = 3
    this.text = '加载中……'
  },
  methods: {
    sOs(item) {
      this.$emit('selectOs', item)
    },
    onShortcutTouchStart(e) {
      let authorIndex = getDate(e.target, 'index') // 获取此时我们所点击的index e.target所得到的元素就是自己点击的元素
      let firstTouch = e.touches[0] // 获取之后我们的scroll就可以做出相应的滚动 // 获取此时的点击的点的x值
      this.touch.y1 = firstTouch.pageY
      this.touch.authorIndex = authorIndex
      this._scrollTo(authorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / listHeight | 0
      let authorIndex = parseInt(this.touch.authorIndex) + delta
      this._scrollTo(authorIndex)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 1) {
        index = this.listHeight.length - 1
      }
      this.scrollY = -this.listHeight[index]
      let target = this.$refs.listViewItem[index]
      this.$refs.listView.scrollToElement(target, 500)
    },
    refresh() {
      this.$refs.listView.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y // 监听滚动的Y值
      // 判断y值在哪个区间，并且currentIndex为多少，然后使右侧的list-item高度
    },
    _calculateHeight() {
      this.listHeight = []
      let group = this.$refs.listViewItem
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < group.length; i++) {
        height += group[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    datas() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      let listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if ((-newY) >= height1 && (-newY) < height2) {
          this.currentIndex = i
          this.diff = newY + height2
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    loading
  }
}
</script>


<style lang="stylus" scoped>
@import '../../common/stylus/variable'
.listView-wrapper
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  .listView-content
      .listView-item
        width 100%
        .list
          padding-bottom 20px
          .item
            display fixed 
            align-item center
            padding 20px 0 0 30px
            .avatorImg
              width 50px 
              height 50px
              border-radius 50%
              vertical-align middle
            .name 
              margin-bottom 20px
              margin-left 20px
              color $color-text-l
              font-size $font-size-medium
  .titleList
    position absolute 
    right 0
    top:90px
    padding 5px 0 5px 0
    background $color-background-d
    .title-item 
      color $color-text-l
      padding 3px
      text-align center
      font-size $font-size-small
      &.active
        color $color-theme
  .fix-title 
    position: absolute
    top: -1px
    left: 0
    width: 100%
  .loading-content
    position relative 
    top 100px 

</style>