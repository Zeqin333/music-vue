<template>
  <div class="search-wrapper">
    <div class="search-container">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
      <div ref="scrollWrapper" v-show="!query" class="search-content">
        <scroll ref="scroll" class="search-hot-history">
          <div class="main-content">
            <div class="hot-search">
              <h1 class="title">热门搜索</h1>
              <ul class="hot-content">
                <li @click="addQuery(one.k)" v-for="one in hotkey" class="hot-item">{{one.k}}</li>
              </ul>
            </div>
            <div class="search-history">
              <div class="history-title">
                <h1 class="title">搜索历史</h1>
                <i class="icon-clear"></i>
              </div>
              <search-list class="history-content"></search-list>
            </div>
          </div>
        </scroll>
      </div>
      <div ref="suggestWrapper" v-show="query" class="search-result">
        <suggest ref="suggest" :query="query"></suggest>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import searchList from 'base/search-list/search-list'
import Suggest from 'base/suggest/suggest'
import {getHotSearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {playListMixin} from 'common/js/mixin'

export default {
  mixins: [playListMixin],
  data() {
    return {
      query: '',
      hotkey: []
    }
  },
  created() {
    this._getHotSearch()
  },
  computed: {},
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    _getHotSearch() {
      getHotSearch().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scrollWrapper.style.bottom = bottom
      this.$refs.scroll.refresh()

      this.$refs.suggestWrapper.style.bottom = bottom
      this.$refs.suggest.refresh()
    }
  },
  components: {
    searchBox,
    Scroll,
    searchList,
    Suggest
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable'

.search-wrapper
  position fixed 
  width 100% 
  top 80px
  bottom 0
  .search-content
    position fixed
    left 0
    bottom 0
    top 180px
    width 100%
    .search-hot-history
      height 100% 
      overflow hidden 
      .main-content
        height auto
        .hot-search
          margin 0 20px 20px 20px
          .title 
            color $color-text-l
            font-size $font-size-medium
            margin-bottom 20px
          .hot-content
            .hot-item
              display inline-block
              padding 5px 10px
              margin 0 20px 10px 0
              border-radius 6px
              color $color-text-d
              font-size $font-size-medium
              background $color-highlight-background
        .search-history
          position relative
          margin 0 20px
          .title 
            color $color-text-l
            font-size $font-size-medium
            margin-bottom 20px
          .icon-clear
            position absolute
            right 0
            top 0
            color $color-text-l
  .search-result
    position fixed 
    left 0
    top 180px
    bottom 0
    width 100%
</style>

