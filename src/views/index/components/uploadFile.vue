<template>
	<div>
		<el-upload :action="'none'" :auto-upload="false"  drag ref='upload'  :on-change="onChange" :on-remove="onRemove" multiple show-file-list>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
		<el-button icon="el-icon-upload" type="primary" style="margin-top: 20px;" @click="submitUpload">上传</el-button>
	</div>
</template>

<script>
	import config from '@public/klcloud.config.js'
	import api from '../../../api/index.js'
	import utils from '../../../utils/index.js'
 


	export default {
		props: {
			//设置文件保存的路径，作为参数传递进来
			path: String,
			node: Object,
			uploadFile: Function
		},
		data() {
			return {
				//文件列表
				fileList: [],
			}
		},
		methods: {
			//文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
			onChange(file,filelist){
				//file.raw 才是真实的 file 对象
				this.fileList.push(file.raw)
			},
			//文件列表移除文件时的钩子
			onRemove(file, fileList){
				//file.raw 才是真实的 file 对象
				this.fileList.splice(this.fileList.indexOf(file.raw),1)
			},
			//上传文件
			submitUpload() {
				console.log("提交文件")
				let formData = new FormData();
				// 向 formData 对象中添加文件
				this.fileList.forEach(file => {
					formData.append('file', file);
				})
				//设置文件保存路径
				formData.append('path', this.path);
				api.uploadFile(formData)
					.then(r => {
						console.log(r)
						if(r.data.code==1){
							this.message("上传成功！",'success')
							this.uploadFile(this.node)
						}
					}).catch(e => {
						console.log(e)
					})
			},
			message(message, type) {
				this.$message({
					showClose: true,
					message: message,
					type: type
				});
			}
		},
		mounted() {
		},
	}
</script>

<style scoped>

</style>
