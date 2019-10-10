<template>
  <div class="song-list">
    <ul>
      <li @click="selectSong(song, index)" v-for="(song, index) in songs" class="song-content" >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="singers">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      dafault: []
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    selectSong(song, index) {
      // 将我们所点击的当前的歌曲和索引给我们的播放列表music-list监听此事件
      this.$emit('getSong', song, index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
  .song-list
      .song-content
        display flex
        align-items center 
        height 64px
        font-size $font-size-medium
        box-sizing border-box
        .content 
          flex 1
          overflow hidden
          line-height 20px
          .name
            no-wrap()
            color $color-text
          .singers
            no-wrap()
            color $color-text-d
</style>