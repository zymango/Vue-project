<template>
  <div class="tab-control">
   <div v-for="(item, index) in titles" :key="index" 
   class="tab-control-item" 
   :class="{active: index === currentIndex}"
   @click="itemclick(index)">
      <span>{{item}}</span>
   </div>
   
  </div>
</template>

<script>
export default {
  name: "TabControl",
  data(){
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemclick(index){
      this.currentIndex = index;
      this.$emit('tabClick', index)
    }
  },
  props: {
    titles:{
      type: Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
  .tab-control{
    display: flex;
    text-align: center;
    font-size: 15px;
      background-color: #fff;
  }
  .tab-control-item{
    height: 40px;
    line-height: 40px;
    flex: 1;
  }
  .active{
    color: var(--color-high-text);
    
  }
  .active span{
    border-bottom: 3px solid var(--color-tint);
    padding: 5px;
  }
</style>
