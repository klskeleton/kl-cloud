import request from '../utils/request.js'
 import config from '@public/klcloud.config.js'

export default {
	//登录
	login(account, password) {
		return new request({
			url: `/api/login/${account}/${password}`,
			method: 'get'
		})

	},
	//获取文件列表
	getFileList(path) {
		return new request({
			url: `/api/file/list`,
			method: 'post',
			data:{ path:path }
		})

	},
	openFile(path){
		return new request({
			url: `/api/file/open`,
			method: 'post',
			data:{ path:path }
		})
	},
		
	createFile(path){
		return new request({
			url: `/api/file/create`,
			method: 'post',
			data:{ path:path }
		})
	},
	createFolder(path){
		return new request({
			url: `/api/folder/create`,
			method: 'post',
			data:{ path:path }
		})
	},
	removeFile(path){
		return new request({
			url: `/api/file/remove`,
			method: 'post',
			data:{ path:path }
		})
	},
	removeFolder(path){
		return new request({
			url: `/api/folder/remove`,
			method: 'post',
			data:{ path:path }
		})
	},
	uploadFile(formData){
		return new request({
			url: `/api/file/upload`,
			method: 'post',
			headers:{"content-type":"application/x-www-form-urlencoded"},
			data:formData
			
		})
	}



}
