<template>
  <div class="loading-wrapper">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{text}}</p>
  </div>
</template>


<script>
export default {
  props: {
    text: {
      type: String,
      default: '正在载入……'
    }
  }
}
</script>


<style lang="stylus" scoped>
@import '../../common/stylus/variable'
  .loading-wrapper 
    width 100%
    text-align center
    img 
      line-height 20px
      font-size $font-size-small
      color $color-text-l

</style>