<template>
  <div id="home" class="wrapper">
     <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- 这里的  class = content 只是单纯的一个类名，并不是BScroll中的.content类 -->
    <scroll class="content" ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true"
    @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" class="tab-control" 
        @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 原生元素可以直接监听点击事件，但是组件不可以 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
 
</template>

<script>
// 子组件导入
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureViews'

//公共组件导入
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

// 方法导入(网络请求)
import {getHomeMultidata, getHomeGoods} from 'network/home'


export default {
  name: "Home",
  components: {
    // 注册子组件
    HomeSwiper,
    RecommendView,
    FeatureView,
    //注册公共组件
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop

  },
 
  data () {
    return {
      banners: [],
      recommends: [],
      goods:{
        'pop':{page: 0, list:[]},
        'new':{page: 0, list:[]},
        'sell':{page: 0, list:[]},
      },
      currentType:'pop',
      isShowBackTop: false
    }
  },
  computed: {
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  //函数调用 -》 压入函数栈（保存函数调用过程中所有变量）
  //函数调用结束，-》 弹出函数栈（释放函数所有变量）
  created () {
    //1.请求多个数据
    this.getHomeMultidata()
    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
   
  },
  //methods中写调用方法，钩子函数created只是简单的调用方法
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index){
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }
    },
    backClick(){
      //拿到scroll组件对象中的scroll对象中的scrollTo属性
      //scroll参数：第一个参数：x坐标；第二个参数： y坐标； 第三个参数： 时间
      //第一种未封装写法
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      //第二种：封装写法，在BackTop组件中封装一个方法，然后调用方法
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position){
      this.isShowBackTop = -position.y > 1000
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
      //上来加载更多只能调用一次， 必需配合finishPullUp使用
      this.$refs.scroll.finishPullUp()
      //这里是解决BS的一个Bug问题，refresh属性是重新计算可滚动区域
      // this.$refs.scroll.refresh()
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
      // console.log(res);
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    })
    },
    getHomeGoods(type){ 
      //传入的type是变量，[]可以用来引用变量，所以不用.方式，这是使用了  ['属性名']引用对象属性
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        //这里不能直接赋值，因为数据请求是很多页，直接复制，会导致后面的数据覆盖前面的数据
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
       
    })
    }
    
  }
}
</script>

<style scoped>
  #home{
    padding-top: 44px;
    /* padding-bottom: 400px; */
    /* 视口高度 */
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  
  }
  .tab-control{
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content{
    height: 500px;
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content{
    /* 运算符左右必须有空格 */
    /* height: calc(100% - 93px); */
    /* overflow: hidden; */
  /* }  */
</style>
