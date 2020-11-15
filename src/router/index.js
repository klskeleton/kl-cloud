import admin from '../views/login/index.vue'
import publicFile from '../views/index/components/FileList.vue'
 
import Vue from 'vue'
import Router from 'vue-router'

 

//下面解决重复路由报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		// 动态路径参数 以冒号开头
		{ path: '/', component: publicFile },
		{ path: '/admin', component: admin }

	]
})
