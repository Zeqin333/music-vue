<template>
  <div class="rank-wrapper" ref="rankWrapper">
    <scroll ref="scroll" class="rank-container" :data="rankList">
      <ul class="rank-content">
        <li @click="gotoItem(item)" v-for="item in rankList" class="rank-item">
          <div class="left">
            <img v-lazy="item.picUrl" alt="" class="bigImage">
            <div class="iconAndCount">
              <i class="icon-music"></i>
              <span class="count">{{item.listenCount | capitalize }}</span>
            </div>
          </div>
          <div class="right">
            <h2 class="cd-title">{{item.topTitle}}</h2>
            <ol type="1">
              <li v-for="one in item.songList" class="songs">
                {{one.songname}}<span class="small-icon">-</span>{{one.singername}}
              </li>
            </ol>
          </div>
        </li>
      </ul>
      <loading v-if="rankList"></loading>
      <router-view></router-view>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getRankList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {filter} from 'common/js/dom'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins: [playListMixin],
  created() {
    this._getRankList()
  },
  data() {
    return {
      rankList: []
    }
  },
  methods: {
    _getRankList() {
      getRankList().then((res) => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList
        }
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rankWrapper.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    gotoItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  filters: {
    capitalize(value) {
      return filter(value)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

  .rank-wrapper
    position fixed 
    top 88px
    bottom 0
    width 100%
    .rank-container
      width 100%
      height 100%
      overflow hidden
      .rank-content
        padding 0 20px 40px 20px
        .rank-item
          margin-top 20px
          display flex
          height 100px
          background $color-highlight-background
          font-size $font-size-small
          color $color-text-d
          .left 
            flex 0 0 100px
            width 100px 
            height 100px
            background  green
            position relative
            color $color-text
            .bigImage
              position relative 
              width 100% 
              height 100%
            .iconAndCount
              position absolute 
              bottom 8px 
              left 6px
              font-size 0
              .icon-music,.count
                display inline-block
              .icon-music
                font-size $font-size-medium
              .count
                font-size $font-size-small
                margin-left 2px
          .right
            flex 1
            display flex 
            flex-direction column
            justify-content center
            overflow hidden
            height 100px
            padding 0 20px
            .cd-title
              line-height 30px
              font-size $font-size-large
            .songs
              no-wrap()
              line-height 20px
              .small-icon
                margin 0 4px

</style>

