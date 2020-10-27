<template>
  <div id="detail">
     
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" 
    ref="scroll" 
    :probeType="3" 
    @scroll="contentScroll">
     <!-- <ul>
        <li v-for="(item, index) in $store.state.cartList" :key="index">{{item}}</li>
    </ul> -->
      <!-- 属性：topImages  传入值：top-imagee -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info 
      :detail-info="detailInfo"
      @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramsInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <good-list ref="recommends" :goods="recommends"></good-list>
       
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <!-- <toast :message="message" :show="isShow"></toast> -->
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
import DetailBottomBar from './childComps/DetailBottomBar'

/**
 * 导入封装好的框架组件
 */
import Scroll from 'components/common/scroll/Scroll'
/**
 * 导入整个项目的公共组件
 */
import GoodList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'

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
    DetailBottomBar ,
    //注册封装好的框架组件
    Scroll,
    GoodList,
    // Toast
    
    
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
      itemImgListener: null,
      //距离顶部的距离
      themeTopYs:[],
      currentIndex: 0,
      isShowBackTop: false,
      // message:'',
      // isShow: false
    }
  },
  created () {
    //1.保存传入的iid
    this.iid = this.$route.params.iid
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
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

      /**
       * 1.第一次拿数据，值不对，原因是：this.$refs.params.$el压根没有渲染
       */
      // this.themeTopYs = [];

      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)

      //   console.log(this.themeTopYs);
      //数据渲染完成回调的函数
      // this.$nextTick(() => {
      //   /**2.第二次拿数据，还是不对
      //    * 根据最新的数据，对应的dom是已经被渲染出来
      //    * 但是图片依然是没有加载完（目前获取到的offsetTop是不包含图片的）
      //    */
      //   this.themeTopYs = [];

      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)

      //   console.log(this.themeTopYs);
      // })
    })
    //3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
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
    /**
     * 这里是做详情页的头部导航的跳转，数据在create中开始请求，
     * 但是数据请求是异步请求，数据可能还没加载完成，
     * 所以130行会打印undefined,所以不能写在mounted中
     */
    
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
    // console.log(this.themeTopYs);
  },
  destroyed () {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  updated () {
    //数据更新就会调用updated方法，先把数组清空
    // this.themeTopYs = [];

    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
    // console.log(this.themeTopYs);
  },
  methods: {
    //详情页图片加载完，刷新页面，重新计算滚动高度
    imageLoad(){
      this.$refs.scroll.refresh();
      //详情页头部跳转拿数据第三次
      this.themeTopYs = [];

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 1000 )
    },
    contentScroll(position){
      //1.获取y值
      const positionY = -position.y

      //2.positionY和主题中的y值进行对比
      /**
       * [0, 9289, 10031, 10226]
       * positionY在 0 和 9289之间， index = 0
       * positionY在 9289 和 10031之间， index = 1
       * positionY在 10031 和 10226之间， index = 2
       * positionY超过10226时， index = 3
       */
      let length = this.themeTopYs.length
      for(let i = 0; i < length - 1; i++){
        // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]){
        //   console.log(i);
        // }
        /**方法一：
         * 条件一：防止赋值的过程过于频繁
         * 条件二:((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
        || (i === length - 1 && positionY >= this.themeTopYs[i]))
         * 条件1：(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
         * 判断区间： 在 0 和 某个数字之间（i < length - 1）
         * 条件2：(i === length - 1 && positionY >= this.themeTopYs[i])
         * 判断大于等于：i === length - 1
         */
        // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
        // || (i === length - 1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   // console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
        //方法二：hack
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[ i + 1])){
           this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //3.是否显示回到顶部，这个老师用的混入，代码可读性太差，不使用了
      

    },
    addToCart(){
      //1.获取购物车需要展示的信息，添加进去
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      
      //2.将商品加入购物车里面
      //不能通过这个直接修改数据，必须经过 mutations
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart', product)
      


      this.$store.dispatch('addCart', product).then(res => {
        // this.isShow = true
        // this.message = res
        // setTimeout(() => {
        //   this.isShow = false
        //   this.message = ''
        // }, 1500);
        // this.$toast.show(res, 2000)
        console.log(this.$toast);
      })
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
    height: calc(100% - 44px - 49px);
    position: relative;
  }
  .detail-nav{
    position: relative;
    z-index: 99; 
    background-color: #fff;
  } 
 
</style>

