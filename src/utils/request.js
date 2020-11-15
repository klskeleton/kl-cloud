import axios from 'axios'
import config from '@public/klcloud.config.js'

const service = axios.create({
	baseURL:config.axoisBaseUrl,
	timeout:20000,
})


var configList = []


// 添加请求拦截器
service.interceptors.request.use(config=>{
    // 在发送请求之前做些什么

    configList.push(config)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(response=> {
    // 对响应数据做点什么
    //输出此次的执行结果
	var config = configList.pop()
    console.log("[request url "+config.url+" success]:",config,'\n',"[response]:",response)
    return response;
  }, function (error) {
    // 对响应错误做点什么
	var config = configList.pop()
    console.error("[request url "+config.url+" error]:",config,'\n',"[error]:",error)
    return Promise.reject(error);
  });

export default service
