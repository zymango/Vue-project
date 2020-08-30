//因为refresh会调用30次，为了减小服务器的压力，定义一个防抖函数
export function debounce(func, delay){
  let timer = null;
  return function(...args){
    if(timer) clearTimeout (timer);
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay);
  }
}

//因为后台返回的时间是一串数字，所以需要我们自己格式化为日期
/** 
 * 正则表达式是干什么的？ 字符串匹配利器（难， 规则太多）
*/
export function formatDate(date, fmt) {
  //1.获取年份 
  /**
   *y+ -> 一个或者多个   
    y* -> 0个或者多个
    y？-> 0个或者1个y
   * 2019
   * yy - 19
   * yyyy - 2019
   * y - 9
   * yyy - 019
   */
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  // 2.获取
  //M+ -> 正则表达式中的一个规则
  let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
  };
  for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
  }
  return fmt;
};

function padLeftZero(str) {
  //0004  截取两位  剩下04
  return ('00' + str).substr(str.length);
};