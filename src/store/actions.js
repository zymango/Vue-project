export default  {
  addCart(context, payload){
    // let oldProduct = null
    // for(let item in state.cartList){
    //   if(item.iid === payload.iid){
    //     oldProduct = item
    //   }
    // }
    //1.查找之前数组中是否有该商品
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    //2.判断oldProduct是否有值
    if(oldProduct){
      // oldProduct.count += 1
      context.commit('addCounter', oldProduct)

    } else {
      payload.count = 1
      context.commit('addToCart', payload)
    }
    
  }
}