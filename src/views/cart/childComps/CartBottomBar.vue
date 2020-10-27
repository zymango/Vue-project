<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button 
      class="check-button" 
      :is-checked="isSelectAll"
      @click.native="checkedClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="caculate">
      去计算({{' ' + checkLength + ' '}})
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'
export default {
  name: "CartBottonBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice(){
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price*item.count
      }, 0).toFixed(2)
    },
    checkLength(){
      return this.$store.state.cartList.filter(item =>  item.checked).length
    },
    isSelectAll(){
      if(this.cartList.length === 0){
        return false
      }else{
        //第一种做法
        return  !(this.cartList.filter(item => !item.checked).length)
        //第二种做法（推荐）
        // return !this.cartList.find(item => !item.checked)
      }
      
    }
  },
  methods: {
    checkedClick(){
      //全选状态，点击全选，要全不选中
      if(this.isSelectAll){
        this.cartList.forEach(item => item.checked = false)
      }else{
        this.cartList.forEach(item => item.checked = true)
      }
      // this.cartList.forEach(item => !this.isSelectAll)
    }
  }
}
</script>

<style scoped>
  .bottom-bar{
    position: relative;
    display: flex;
    height: 40px;
    /* background-color: red; */
    line-height: 40px;
    
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 5px;
    width: 60px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    margin-left: 20px;
    flex: 1;
  }
  .caculate{
    width: 90px;
    background-color:red;
    text-align: center;
    color: #ccc;
  }
</style>
