import {mapGetters} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    handlePlaylist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      throw new Error('components must implement handlePlaylist method')
    }
  }
}