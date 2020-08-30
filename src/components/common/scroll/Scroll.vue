<template>
  <!-- ref/children 
  ref如果是绑定在组件中的，那么通过this.$refs."name"获取到的是一个组件对象
  ref如果是绑定在普通的元素中，那么通过this.$refs."name"获取到的是一个元素对象
  -->
   <div class="wrapper" ref="wrapper">
     <div class="content">
       <slot></slot>
     </div>
   </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType:{
      type: Number,
      default: 0
    },
    pullUpLoad:{
      type:Boolean,
      default: false
    }
  },
  data(){
    return {
      scroll: null
    }
  },
  mounted () {
    //1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      //老师说实时监听，会一直回调，所以我们不能在这里写死了
      probeType: this.probeType,
      click: true,
      pullUpLoad: this.pullUpLoad
    })
    //2.监听滚动的位置,我们不是打印当前组件的位置，而是谁需要用到这个组件，就打印谁
    //所以这里要自定义一个事件，传出去
    if(this.probeType === 2 || this.probeType === 3){
       this.scroll.on('scroll', (position) => {
      // console.log(position);
      this.$emit('scroll', position)
    })
    }
    //3.监听scroll滚到底部
    if(this.pullUpLoad){
      this.scroll.on('pullingUp', () => {
        // console.log('监听到滚动到底部！');
        this.$emit('pullingUp')
      })
    }

    // console.log(this.scroll);
    //3.监听上拉事件
    // this.scroll.on('pullingUp', () => {
    //   this.$emit('pullingUp')
    // })
  },
  methods: {
    scrollTo(x, y, time=300){
      //先判断一下scroll是否存在，存在才能执行后面的函数
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp(){
      this.scroll.finishPullUp()
    },
    refresh(){
      
      this.scroll && this.scroll.refresh()
      // console.log('---------');
   
    },
    getScrollY(){
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>
</style>
