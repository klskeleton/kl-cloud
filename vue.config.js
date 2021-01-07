const path = require('path') // 引入path模块
function resolve(dir) {
	return path.join(__dirname, dir) // path.join(__dirname)设置绝对路径
}

const isProduction = true //= process.env.VUE_APP_MODE === 'production'

const cdn = {
	// 忽略打包的第三方库
	/**
	 * externals 对象属性解析：
	 * '包名' : '在项目中引入的名字'
	 * 以element-ui举例 我再main.js里是以
	 * import ELEMENT from 'element-ui'
	 * Vue.use(ELEMENT, { size: 'small' })
	 * 这样引入的，所以我的externals的属性值应该是ELEMENT
	 */
	externals: {
		vue: 'Vue',
		'vue-router': 'VueRouter',
		axios: 'axios',
		'element-ui': 'ELEMENT'
	},
	js: [
		'https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js',
		'https://cdn.bootcdn.net/ajax/libs/vue-router/3.4.8/vue-router.min.js',
		'https://cdn.bootcdn.net/ajax/libs/axios/0.21.0/axios.min.js',
		'https://unpkg.com/element-ui/lib/index.js'
	],
	css: [
		'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
	]
}


module.exports = {
	configureWebpack: config => {
		config.externals = cdn.externals
	},
	// configureWebpack: {
	// 	resolve: {
	// 		alias: {
	// 			'vue$': 'vue/dist/vue.esm.js'
	// 		}
	// 	}
	// },
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('./src'))
			.set('components', resolve('./src/components'))
			.set('views', resolve('src/views'))
			.set('assets', resolve('src/assets'))
			.set('@public', resolve('public/'))
		// set第一个参数：设置的别名，第二个参数：设置的路径


		if (isProduction) {
			config.plugin('html').tap((args) => {
				args[0].cdn = cdn
				return args
			})
		}
		config.plugin('html').tap(args => { // 所有环境配置统一的title
			args[0].title = '外部联网协议配置系统'
			return args
		})
	},



}
