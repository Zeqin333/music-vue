<template>
  <div class="search-list-wrapper">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(one)" :key="one" v-for="one in 10" class="item">
        <span class="desc">迪丽热巴</span>
        <i class="icon-delete" @click="deleteOne(one)"></i>
      </li>
    </transition-group>
  </div>
</template>


<script>
export default {
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  @import '../../common/stylus/mixin'

  .search-list-wrapper
    .item
      display flex 
      align-item center 
      height 40px 
      overflow hidden
      &.list-enter-active,&.list-leave-active
        transition all 0.1s
      &.list-enter, &.list-leave-to 
        height 0
      .desc 
        flex 1
        color $color-text-l
      .icon-delete
        // extend-click()
        font-size $font-size-small
        color $color-text-d
</style>