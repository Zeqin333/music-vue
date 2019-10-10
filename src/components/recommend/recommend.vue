<template>
  <div class="recommend-wrapper" ref="recommendWrapper">
    <scroll ref="scroll" class="recommend-content">
      <div class="content">
        <!-- 当一直都没有得到sliderList的时候，此时的数据也是显示有数据，但是item 它的class并没有很好的显示出来，好像加是哪个这个就可以正常的显示，感觉是数据没有加载完全，才会出现这样只的问题 -->
        <div v-if="sliderList.length" class="navigate"> 
          <slider>
            <li v-for="item in sliderList">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" alt="">
              </a>
            </li>
          </slider>
        </div>
        <div class="main">
          <h2 class="topTitle">热门歌单推荐</h2>
          <ul v-if="songList.length" class="song-list clearFix">
            <li @click="gotoItem(songItem)" v-for="songItem in songList" class="song-item">
              <div class="icon">
                <img @load="loadImg"  v-lazy="songItem.picUrl" class="iconImg" alt="">
                <div class="listenNum">
                  <span class="icon"></span>
                  <span class="accessnum">{{songItem.accessnum | capitalize }}</span>
                </div>
                <div class="buttom"></div>
              </div>
              <div class="desc">
                <div class="title">{{songItem.songListDesc}}</div>
                <div class="author">{{songItem.songListAuthor}}</div>
              </div>
            </li>
          </ul>
        </div>
        <!-- <div class="newSongList-content">
            <h2 class="topTitle">最新音乐</h2>
            
        </div> -->
        <div v-if="!songList.length || !sliderList.length" class="loading">
          <loading :text="text"></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {getRecommend} from 'api/recommend'
import {getH} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import {filter} from 'common/js/dom'

export default {
  mixins: [playListMixin],
  data() {
    return {
      sliderList: [],
      songList: [],
      text: '加载中'
    }
  },
  created() {
    this._getRecommend()
    getH().then((res) => {
      console.log(res)
    })
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider
          this.songList = res.data.songList
        }
      })
    },
    loadImg() {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommendWrapper.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    gotoItem(songItem) {
      this.$router.push({
        path: `/recommend/${songItem.id}`
      })
      this.setDesc(songItem)
    },
    ...mapMutations({
      setDesc: 'SET_DISC'
    })
  },
  filters: {
    capitalize(value) {
      return filter(value)
    }
  },
  components: {
    slider,
    scroll,
    loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
.recommend-wrapper
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .content
      .navigate
        position:relative
        overflow hidden
      .main 
        .song-list
          width 100% 
          box-sizing border-box
          padding 0 2%
          .song-item
            display block
            float left
            box-sizing border-box
            width 49%
            padding:5px 5px 0 5px
            margin 10px 0.5% 0 0.5%
            @media (min-width:$sm-width) 
              width 32% 
            .icon
              position relative
              .iconImg
                width 100% 
                height 100%
                position:relative
              .listenNum
                position absolute 
                left 6px
                bottom 10px
                font-size $font-size-small-s
                .icon 
                  display inline-block
                  width 10px 
                  height 10px 
                  background url('./buttom.png') center no-repeat 
                  background-position 0 -50px
                  background-size 24px 60px
              .buttom
                position:absolute 
                right 10px 
                bottom 10px
                width 24px
                height 24px
                background url('./buttom.png') center no-repeat
                background-position 0 0
                background-size 24px 60px
            .desc
              color:$color-text-l
              padding 0 5px
              font-size $font-size-medium
              .title 
                height 20px
                line-height 20px
                white-space nowrap 
                overflow hidden 
                text-overflow ellipsis
              .author
                height 20px 
                line-height 20px
                font-size $font-size-small
</style>

