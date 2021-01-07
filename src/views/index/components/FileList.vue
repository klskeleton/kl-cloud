<template>

	<el-card>

		<el-row>

			<el-col >
				<el-card>
					<el-row>
						<el-col :span="20">
							<el-breadcrumb  separator="/">
							
								<el-breadcrumb-item v-for="(obj,index) in path" :key="index">
									<span  class="ptr" @click="backtoDir(obj.file_name,obj.file_path)">{{index==0?"根目录":obj.file_name}}</span>
								</el-breadcrumb-item>

							</el-breadcrumb>
						</el-col>
						<el-col :span="4">
							<div  style="display: flex;width: 100%;justify-content: flex-end;"  >
								<router-link to="/admin"><el-button type="info" icon="el-icon-user" style="" round  size="small" >返回后台</el-button></router-link>
							</div>
						</el-col>
					</el-row>

				</el-card>



				<div v-show="content==''">

					<div class="adapta-item big">
						<el-table :data="files" style="width: 100%;margin-top: 10px;min-height: 500px;">
							<el-table-column prop="file_name" label="文件名">
								<template slot-scope="scope">
									<div class="ptr" @click=" scope.row.is_file? openFile(scope.row):intoDir(scope.row.file_name,scope.row.file_path)">
										<div style="display: flex;justify-content: start;">
											<img :src="utils.getIcon(scope.row.file_name,scope.row.is_file)" style="width: 40px;height: 40px;" />
											<span v-text="scope.row.file_name" style="line-height: 40px;margin-left: 20px;"></span>
										</div>
						
									</div>
						
								</template>
							</el-table-column>
							
							<el-table-column  prop="file_size" label="大小"  >
							</el-table-column>
							<el-table-column  prop="file_modify_time" label="修改时间" >
							</el-table-column>
							<el-table-column   label="操作">
							</el-table-column>
						</el-table>
					</div>
					
					<!-- //适配手机端 -->
					<div class="adapta-item small">
						<el-table :data="files" style="width: 100%;margin-top: 10px;min-height: 500px;">
							<el-table-column prop="file_name" label="文件名">
								<template slot-scope="scope">
									<div class="ptr" @click=" scope.row.is_file? openFile(scope.row):intoDir(scope.row.file_name,scope.row.file_path)">
										<div style="display: flex;justify-content: start;">
											<img :src="utils.getIcon(scope.row.file_name,scope.row.is_file)" style="width: 40px;height: 40px;" />
											<span v-text="scope.row.file_name" style="line-height: 40px;margin-left: 20px;"></span>
										</div>
						
									</div>
						
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				
				<div v-show=" content!=''" style="width: 100%;height: 100%;min-height: 500px;">
					<div ref="myQuillEditor" style="width: 100%;margin-top: 10px;height: 100%;">
						<div v-if="content.startsWith('data:image')">
								
							<el-card>
								<img style="min-width: 100%;" :src="content" />
							</el-card>
							<el-input style="margin-top: 20px;" type="textarea" :rows="3"  disabled  v-model="content"> 	</el-input>
						</div>
							
						<div v-else>
							<el-input style="height: 100%;" :autosize="{ minRows: 2, maxRows:35}" type="textarea" :rows="2" placeholder="请输入内容"
							 v-model="content">
							</el-input>
						</div>
						<!-- 
						<el-input autosize type="textarea" :rows="2" placeholder="请输入内容" v-model="content">
						</el-input> -->

					</div>

				</div>

			</el-col>
		</el-row>
	</el-card>

</template>



<script>
	import api from '../../../api/index.js'
	import utils from '../../../utils/index.js'
	import config from '@public/klcloud.config.js'
	import filetree from './FileTree.vue'


	export default {
		components: {
			filetree,

		},
		data() {
			return {
				all_file: {
					children: []
				},
				utils: utils,
				show_filetree: false, //是否显示左边树组件
				files: [],
				path: [],
				content: '',
				editorOption: {
					// some quill options
				},
				basePath: config.basePath,
				getFilesPromise: utils.getFiles(config.basePath)
			}
		},
		methods: {
			editorInit(ace) {

				// let ace = VAceEditor
				// ace.require("ace/ext/language_tools");
				// var editor = ace.edit("editor");
				// editor.$blockScrolling = Infinity;
				// editor.setFontSize(16);
				// editor.session.setMode("ace/mode/c_cpp");
				// editor.setOptions({
				//     enableBasicAutocompletion: true,
				//     enableSnippets: true,
				//     enableLiveAutocompletion: true
				// });
				// editor.setTheme("ace/theme/chrome");
			},
			backtoDir(name, path) {
				this.content = ''
				//返回上一级
				let nowPath = this.path.pop()
				//一直回退，直到和点击的文件夹路径一样为止
				while (nowPath.file_name != name) {
					nowPath = this.path.pop()
				}

				this.intoDir(nowPath.file_name, nowPath.file_path)

			},
			//打开文件
			openFile(file) {

				this.path.push({
					file_name: file.file_name,
					file_path: file.file_path
				})
				api.openFile(file.file_path)
					.then(r => {
						console.log(r.data.data)
						this.content = r.data.data
					})
			},
			//进入文件夹
			intoDir(name, path) {
				this.content = ''
				this.path.push({
					file_name: name,
					file_path: path
				})


				utils.getFiles(path)
					.then(file_list => {
						this.files = []
						for (let i = 0; i < file_list.length; i++) {
							if (file_list[i].is_file == false) {
								this.files.push(file_list[i])
							} else {
								this.files.push(file_list[i])
							}
						}

					}).catch(e => {

					})
			},


		},

		mounted() {

			this.intoDir(this.basePath, this.basePath)

			// this.getFilesPromise.then(file_list=>{
			// 	console.log(file_list)
			// 	this.tableData = file_list
			// }).catch(e=>{
			// 	console.error(e)
			// })
		}

	}
</script>

<style scoped>


	.ptr {
		cursor: pointer;
	}

	.input-area {
		margin: 20px 0px 20px 0px;
	}
	
	.adapta-item{
		
	}
	
	@media screen  and (max-width:600px)  {
		.adapta-item.big{
			display: none;
		}
		.adapta-item.small{
			display: display;
		}
	}
	
	@media screen  and (min-width:600px)  {
		.adapta-item.big{
			display: display;
		}
		.adapta-item.small{
			display: none;
		}
	}
	
</style>
