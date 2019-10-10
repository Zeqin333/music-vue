<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import musicList from 'components/music-list/music-list'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSongItem} from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.songListDesc
    },
    bgImage() {
      return this.disc.picUrl
    }
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.id) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeList(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeList(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.id && musicData.album.mid) {
          ret.push(createSongItem(musicData))
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

