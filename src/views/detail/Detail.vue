<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll">
      <!-- 属性：topImages  传入值：top-imagee -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info 
      :detail-info="detailInfo"
      @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramsInfo"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
      <good-list :goods="recommends"></good-list>
    </scroll>
  </div>
</template>

<script>
/**
 * 导入子组件
 */
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
/**
 * 导入封装好的框架组件
 */
import Scroll from 'components/common/scroll/Scroll'
/**
 * 导入整个项目的公共组件
 */
import GoodList from 'components/content/goods/GoodsList'

/**
 * 导入网络请求方法
 */
import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
/**
 * 导入工具函数
 */
//防抖函数
import {debounce} from 'common/utils'


export default {
  name: "Detail",
  components: {
    /**
     * 注册子组件
     */
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    //注册封装好的框架组件
    Scroll,
    GoodList
    
  },
  data(){
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramsInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null
    }
  },
  created () {
    //1.保存传入的iid
    this.iid = this.$route.params.iid
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      //(1)获取顶部轮播图片
      const data = res.result;
      this.topImages = data.itemInfo.topImages
      //(2)获取商品信息(整合数据)
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //(3)创建店铺信息对象
      this.shop = new Shop(data.shopInfo)
      //(4)保存商品的详情数
      this.detailInfo = data.detailInfo
      //(5)获取参数信息
      this.paramsInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //(6)取出评论信息
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
      }
    })
    //3.请求推荐数据
    getRecommend().then(res => {
      console.log(res);
      this.recommends = res.data.list
    })
  },
  mounted () {
    //1.防抖函数
    const newrefresh = debounce(this.$refs.scroll.refresh, 100)

    this.itemImgListener = () => {
      newrefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  destroyed () {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    imageLoad(){
      this.$refs.scroll.refresh()
    },
    titleClick(index){
      console.log(index);
    }
  }
}
</script>

<style scoped>
    #detail{
    position: relative;
    z-index: 20; 
    background-color: #fff;
    height: 100vh;
  }
  .content{
    height: calc(100% - 44px);
    position: relative;
  }
  .detail-nav{
    position: relative;
    z-index: 99; 
    background-color: #fff;
  } 
 
</style>

