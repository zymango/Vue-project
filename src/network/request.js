import axios from 'axios'

//第三种封装并且返回请求数据的方式(instance返回一个promise对象)
export function request(config){
      //1.创建axios实例
  const instance = axios.create({
    baseURL:'http://152.136.185.210:8000/api/z8',
    timeout: 5000
  })
  //2.axios拦截器
  //2.1请求拦截的作用
  //use后面传入两个参数,config是前端配置
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    // console.log(err);
  })

   //2.2响应拦截，res是服务器返回的结果
  instance.interceptors.response.use(res => {
    // console.log(res);
    // console.log(res.data);
    return res.data
  }, err => {
    console.log(err);
  })

 
  //3.发送真正的网络请求
  return instance(config)
}