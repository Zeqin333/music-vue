<template>
  <div class="search-box-wrapper">
    <div @click="focusBox" class="search-box">
      <i class="icon-search"></i>
      <input ref="query" v-model="query" class="query-desc" :placeholder="placeholder"/>
      <i @click="runDismiss" v-show="query" class="icon-dismiss"></i>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  created() {
    this.$watch('query', (newquery) => {
      this.$emit('query', newquery)
    })
  },
  methods: {
    runDismiss() {
      this.query = ''
    },
    focusBox() {
      this.$refs.query.focus()
    },
    setQuery(query) {
      // 点击热门检索词，进行检索
      this.query = query
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import '../../common/stylus/variable'

  .search-box-wrapper
    position relative
    box-sizing border-box
    padding 30px
    .search-box
      box-sizing border-box
      height 40px
      display flex
      align-items center
      justify-content center
      font-size $font-size-medium
      background $color-highlight-background
      border-radius 6px
      .icon-search, .icon-close 
        color $color-text-l
      .icon-search
        font-size 24px
        margin 0 5px
      .query-desc
        line-height 18px
        flex 1
        color $color-text-l
        background $color-highlight-background
        outline none
        &::placeholder
          color: $color-text-d
      .icon-dismiss
        font-size 16px
        flex 0 0 30px
        text-align center
</style>