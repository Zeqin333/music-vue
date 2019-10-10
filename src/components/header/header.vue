<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="name">Chicken Music</h1>
    <div class="person"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'

.m-header 
  position:relative
  height:44px
  color:$color-theme
  font-size:0
  text-align:center
  .icon,h1,.person
    display:inline-block
    vertical-align: top
  .icon
    width 30px
    height 32px
    bg-image('logo')
    background-size:30px 32px
    margin: 8px 9px 8px 0
  .name
    height:44px 
    line-height:44px
    font-size:$font-size-large
</style>
