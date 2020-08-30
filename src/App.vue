<template>
  <div id="app">
    <!-- 因为每次点击到详情页展示的数据都不一样，所以不能让详情页detail保持活跃状态 -->
    <keep-alive exclude="Detail">
      <router-view/>
    
    </keep-alive>
    <main-tab-bar/>
  </div>
</template>

<script>
import MainTabBar from 'components/content/mainTabBar/MainTabBar'

export default {
  name: 'App',
  components: {
    MainTabBar
  }
}
</script>

<style>
  @import url("assets/css/base.css");

</style>
