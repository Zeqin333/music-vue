<template>
  <div class="tag-wrapper">
    <div class="tag-content">
      <router-link to="recommend" class="item">
        <span class="desc">推荐</span>
      </router-link>
      <router-link to="singer" class="item">
        <span class="desc">歌手</span>
      </router-link>
      <router-link to="rank" class="item">
        <span class="desc">排行</span>
      </router-link>
      <router-link to="search" class="item">
        <span class="desc">搜索</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"

.tag-wrapper
  .tag-content
    height:44px 
    line-height:44px
    display:flex
    font-size:$font-size-medium
    .item
      flex:1
      text-align:center
      .desc 
        padding-bottom: 5px
        color:$color-text-l
      &.router-link-active // 注意这个放置的地方
        .desc
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>