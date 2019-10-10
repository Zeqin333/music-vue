<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- keep-alive缓存的作用 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/header/header'
import tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'app',
  components: {
    MHeader,
    tab,
    Player
  }
}
</script>

<style></style>
