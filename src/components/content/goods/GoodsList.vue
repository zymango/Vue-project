<template>
  <div class="goods">
    <goods-list-item v-for="(item, index) in goods" :key="index" :goods-item="item"/>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem'

export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props: {
    goods:{
      type: Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
 .goods {
    display: flex;
    /* 根据宽度选择一行放几个item */
    flex-wrap: wrap;
    /* 均等分item */
    justify-content: space-evenly;

    padding: 2px;
  }
</style>
