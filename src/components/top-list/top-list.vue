<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import musicList from 'components/music-list/music-list'
import {gotoRankList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      return this.topList.picUrl
    }
  },
  created() {
    this._gotoRankList()
  },
  methods: {
    _gotoRankList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      gotoRankList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeList(res.songlist)
        }
      })
    },
    _normalizeList(list) {
      let ret = []
      list.forEach(item => {
        if (item.data.songid && item.data.albummid) {
          ret.push(createSong(item.data))
        }
      })
      return ret
    }
  },
  components: {
    musicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all .5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0) 

</style>

