import api from '../api/index.js'
import icon from './icon.js'


export default {
	
	formatDate(t) {
		var date = new Date(t);
		var YY = date.getFullYear() + '-';
		var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
		var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		return YY + MM + DD + " : " + hh + mm + ss;
	},
	getIcon(file_name,is_file) {
		
		
		//获取文件后缀名字
		var last_str = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length)
		console.log(last_str)
		if(!is_file){
			return icon.folder
		}
		else if (last_str === 'txt') {
			return icon.txt
		}else if(last_str === 'png' || last_str === 'jpg'){
			return  icon.img
		}else if(last_str === 'mp3'){
			return  icon.mp3
		}else if(last_str === 'ppt'){
			return  icon.ppt
		}else if(last_str === 'word'){
			return  icon.doc
		}else if(last_str === 'zip' ||last_str === 'gz' || last_str === 'war' ){
			return  icon.zip
		}else if(last_str === 'mp4' || last_str === 'mp5'){
			return  icon.mov
		}else if(last_str === 'js'){
			return  icon.js
		}else if(last_str === 'jar'){
			return  icon.jar
		}else if(last_str === 'java'){
			return  icon.java
		}else if(last_str === 'css'){
			return  icon.css
		}else if(last_str === 'html'){
			return  icon.html
		}else if(last_str === 'py'){
			return  icon.py
		}else if(last_str === 'php'){
			return  icon.php
		}else if(last_str === 'json'){
			return  icon.json
		}else if(last_str === 'md'){
			return  icon.md
		}else if(last_str === 'vue'){
			return  icon.vue
		} else{
			return  icon.unknow
		}
	},
	
	
	getFiles(path) {
		let list = []
		return  new Promise((resolve, reject) => {
			console.log("请求文件列表:"+path)
			api.getFileList(path)
				.then(r => {
					if (r.data.code == 1) {
						//如果没有数据直接返回空数组
						if(!r.data.data){
							resolve([])
						}else{
							for (let i = 0; i < r.data.data.length; i++) {
								let file_info = r.data.data[i]
								let size = 0
								let icon = ''
								//如果文件大于1kb
								if (r.data.data[i].file_stat.size > 1024) {
									size = (r.data.data[i].file_stat.size / 1024).toFixed(2) + ' KB'
								} else {
									size = r.data.data[i].file_stat.size + ' B'
								}
								//如果文件是文件夹
								if (r.data.data[i].is_file == false) {
									size = ''
									icon = 'el-icon-folder'
								} else {
									icon = 'el-icon-document'
								}
								//存入文件信息
								list.push({
									file_name: r.data.data[i].file_name,
									file_path: r.data.data[i].file_path,
									file_size: size,
									file_modify_time: this.formatDate(parseInt(r.data.data[i].file_stat.mtimeMs)),
									is_file: r.data.data[i].is_file,
									icon: icon
								
								})
							}
								
							//对文件进行排序，文件夹在先
							let dir_list = []
							let file_list = []
							for (let i = 0; i < list.length; i++) {
								if (list[i].is_file == false) {
									dir_list.push(list[i])
								} else {
									file_list.push(list[i])
								}
							}
							list = dir_list.concat(file_list)
							resolve(list)
						}
						
					}else{
						resolve(list)
					}
				}).catch(e => {
					console.error(e)
					reject(e)
				})
		})
	
	}
}