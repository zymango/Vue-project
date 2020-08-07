<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"></recommend-view>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'


import {getHomeMultidata} from 'network/home'


export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView
  },
 
  data () {
    return {
      banners: [],
      recommends: []
    }
  },
  //函数调用 -》 压入函数栈（保存函数调用过程中所有变量）
  //函数调用结束，-》 弹出函数栈（释放函数所有变量）
  created () {
    //1.请求多个数据
    getHomeMultidata().then(res => {
      // console.log(res);
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    })
  }
}
</script>

<style scoped>
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
