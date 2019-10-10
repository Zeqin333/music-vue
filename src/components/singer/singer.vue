<template>
  <div class="recommend-wrapper" ref="singerWrapper">
    <list-view @selectOs="sOs" :datas="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingers} from 'api/singer'
import {ERR_OK} from 'api/config'
import listView from 'base/listView/listView'
import { mapMutations } from 'vuex'
import {playListMixin} from 'common/js/mixin'

const HotSongers = '热门'
const HotSongerslength = 10

export default {
  mixins: [playListMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingers()
  },
  methods: {
    _getSingers() {
      getSingers().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      // 收集热门歌手
      let map = {
        hot: {
          title: HotSongers,
          items: []
        }
      }
      // 开始遍历所有的歌手，通过Findex的值来分大的类，通过前面的10 个来显示热门歌手，后面的A\B\C 需要根据Findex来排序
      list.forEach((item, index) => {
        // 当为前10个则为hot中的，然后直接push进入hot中
        if (index < HotSongerslength) {
          map.hot.items.push({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
            avator: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push({
          name: item.Fsinger_name,
          id: item.Fsinger_mid,
          avator: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
        })
      })
      // 我们已经得到一个无序的数组，接下来就是需要进行排序，将热门排在最前面，后面的按照字母的顺序进行排列
      // 首先将我们的热门和字母的分成两个组，分别进行排序之后，合并
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HotSongers) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    loadImg() {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    sOs(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singerWrapper.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    listView
  }
}
</script>

<style lang="stylus" scoped>
.recommend-wrapper
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>

