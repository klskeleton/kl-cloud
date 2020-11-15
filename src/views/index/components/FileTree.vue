<template>
	<div>


		<el-row  class="adapta-flex">
			<el-col   class="adapta" :span="4">
				<div class="tree">
					<el-row>
						<el-col>
							<el-input placeholder="输入关键字搜索已加载的文件" v-model="filterText">
							</el-input>
						</el-col>
						<el-col style="padding: 4px;display: flex;justify-content: start;">
							<div v-if="current_check_node.length!=0">
								<el-button type="warning" size="small" icon="el-icon-check" style="margin-left: 5px;" title="删除" @click="handelNodeDelete">确定</el-button>
								<el-button type="info" size="small" icon="el-icon-close" style="margin-left: 5px;" title="取消操作" @click="current_check_node=[] ; resetChecked()">取消</el-button>
							</div>

							<el-button type="danger" size="small" icon="el-icon-delete" style="margin-left: 5px;" v-if="current_check_node.length==0"
							 title="删除选中的文件" @click="delete_file=!delete_file"></el-button>
						</el-col>
					</el-row>

					<el-tree ref="tree" :filter-node-method="filterNode" :load="loadNode" lazy :data="data" :getCurrentKey="getCurrentKey"
					 :show-checkbox="delete_file" :default-expanded-keys="[config.basePath]" node-key="file_path" :props="defaultProps"
					 icon-class="el-icon-folder-opened" @node-click="handleNodeClick" @check="handleNodeCheck"></el-tree>
				</div>
			</el-col>

			<el-col style="padding: 10px;"  class="adapta" :span="20">
				<div class="adapta-right">

					<div>
						<div class="input-area">
							<el-row type="flex" justify="start" style="flex-wrap: wrap;">
								<el-col class=" adapta-item big" :span="6">
									<el-input :disabled="true" v-model="current_path" placeholder="请输入内容">
										<template slot="prepend">当前路径</template>
									</el-input>
								</el-col>

								<el-col  class="adapta" :span="17" style="display: flex;margin-left: 20px;flex-wrap: wrap;">
									<el-button class=" adapta-item big" icon="el-icon-refresh" circle title="刷新" @click="refrashFile(current_node)"></el-button>
									<el-button icon="el-icon-folder-add" circle title="新建文件夹" @click="createFolder(current_node)"></el-button>
									<el-button icon="el-icon-document-add" circle title="新建文件" @click="createFile(current_node)"></el-button>
									<el-button type="danger" icon="el-icon-delete" circle title="删除当前的文件" @click="deleteFile(tags)"></el-button>
									<el-button type="primary" icon='el-icon-upload' round @click="uploadDialog=!uploadDialog"><span >上传</span> </el-button>
									<el-button type="success" icon="el-icon-document-checked"   round><span >保存</span></el-button>
									<el-button type="info" icon="el-icon-cloudy"  round @click="router('/')"> <span >网盘</span> </el-button>

								</el-col>

							</el-row>
						</div>
					</div>

				</div>

				<div v-loading="content=='正在加载...'">
					<el-row type="flex" justify="start" style="margin-top: 10px;flex-wrap: wrap;">

						<span v-for="(tag,index) in tags" :key="tag.name" style="margin-top: 5px;">
							<span v-if="index==0">
								<el-button type="danger" icon="el-icon-close" circle size="small" title="删除所有标签" @click="handleTagCloseAll()"></el-button>
								<el-divider direction="vertical"></el-divider>
							</span>
							<el-divider v-if="index!=0" direction="vertical"></el-divider>
							<el-tag class="ptr" closable :type="tag.type" :effect="tag.type==='primary'?'dark':'light'" @click="handleTagClick(tag)"
							 @close="handleTagClose(tag)">
								{{tag.name}}

							</el-tag>

						</span>
					</el-row>

					<div v-if=" content==''" style="width: 100%;height: 100%; ">
						<img src="../../../assets/file-icon/unknow.png" style="margin-top: 10%;" />
						<el-row><span style="color: gainsboro;;font-size: small;font-weight: bold;">暂无文件选择</span></el-row>
					</div>
					<div v-else style="width: 100%;height: 100%;">
						<div ref="myQuillEditor" style="width: 100%;margin-top: 10px;height: 100%;">
							<div v-if="content.startsWith('data:image')">

								<el-card>
									<img :src="content" />
								</el-card>
								<el-input style="margin-top: 20px;" type="textarea" :rows="3" disabled v-model="content"> </el-input>
							</div>

							<div v-else>
								<el-input style="height: 100%;" :autosize="{ minRows: 2, maxRows:35}" type="textarea" :rows="2" placeholder="请输入内容"
								 v-model="content">
								</el-input>
							</div>


						</div>

					</div>
				</div>


				<el-dialog :title="'上传文件到:  '+getCurrentPath()" :visible.sync="uploadDialog">
					<uploadFile :path="getCurrentPath()+'/'" :node="this.current_node.parent" :uploadFile="uploadFile"></uploadFile>
				</el-dialog>



			</el-col>
		</el-row>
	</div>
</template>

<script>
	import api from '../../../api/index.js'
	import utils from '../../../utils/index.js'
	import config from '@public/klcloud.config.js'
	import uploadFile from './uploadFile.vue'

	export default {
		props: {},
		components: {
			uploadFile
		},
		data() {
			return {
				data: [], //文件数据
				tags: [], //文件标签
				content: '', //显示文本
				current_node: {}, // 当前的文件
				current_path: config.basePath, // 当前的路径
				delete_file: false,
				//下面是树状列表的配置
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'file_name',
					isLeaf: 'leaf'
				},
				config,
				current_check_node: [],
				uploadDialog: false //上传面板的显示
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			//取消节点选中
			resetChecked() {
				this.$refs.tree.setCheckedKeys([]);
			},
			//获取当前选中节点
			getCurrentKey() {
				return this.$refs.tree.getCurrentKey()

			},
			//节点删除事件
			handelNodeDelete() {
				let check_nodes = this.$refs.tree.getCheckedNodes()
				let del_nodes = []
				check_nodes.forEach(data => {
					let node = this.$refs.tree.getNode(data.file_path)
					if (!node) return
					console.log("删除文件操作：", node)
					if (node.data.is_file) {
						del_nodes.push(node)
						// this.deleteOperation("文件",node,api.removeFile)
					} else if (!node.data.is_file) {
						// this.deleteOperation("文件夹",node,api.removeFolder)
					}
				})
				this.deleteAllOperation(del_nodes, api.removeFile)
			},
			getCurrentPath() {
				let node = this.current_node
				if (!node.data) return ''
				let is_file = node.data.is_file
				return is_file ? node.parent.data.file_path : node.data.file_path
			},
			//处理节点被选择
			handleNodeCheck() {
				this.current_check_node = this.$refs.tree.getCheckedNodes()
			},
			//节点点击事件
			handleNodeClick(file, Node, nodeSelf) {

				this.current_node = Node
				if (Node.data.is_file) {
					this.openFile(Node.data)
				}
				// console.log("请求文件路径"+path+files[i].file_name)
				console.log("节点被点击", file, Node, nodeSelf);

			},
			//标签点击事件
			handleTagClick(tag) {
				this.tags.forEach(ta => {
					ta.type = 'info'
				})
				tag.type = 'primary'
				this.content = tag.content
				// this.current_node.data = tag
			},
			//标签关闭事件
			handleTagClose(tag) {

				//删除指定位置标签
				let del_tag = this.tags.splice(this.tags.indexOf(tag), 1);
				console.log(tag.file_path === this.current_node.data.file_path)
				//如果删除了当前的标签，则跳转最后一个标签页
				if (tag.type === 'primary') {
					this.handleTagClick(this.tags[this.tags.length - 1])
				}
			},
			//所有标签关闭事件
			handleTagCloseAll(tag) {
				this.tags = []
				this.content = ''
				this.current_node = {}
			},
			//标签过滤
			filterNode(value, data) {

				if (!value) return true;
				return data.file_name.indexOf(value) !== -1;
			},
			//节点渲染事件
			loadNode(node, resolve) {
				if (node.level === 0) {
					return resolve([{
						name: 'region'
					}]);
				}


				let all_files = {
					children: []
				}
				utils.getFiles(node.data.file_path)
					.then(file_list => {
						this.showAllFile(all_files, file_list, node.data.file_path)
						return resolve(all_files.children)

					}).catch(e => {

					})

			},
			//上传成功回调
			uploadFile(node) {
				console.log("文件上传成功")
				this.refrashFile(node, true)
			},
			//删除文件 操作 name 类型  node 树节点 handle 指定操作的函数
			deleteOperation(type, node, handle) {
				console.log(node);
				let is_file = node.data.is_file
				let path = node.data.file_path
				this.$confirm(`此操作将永久删除 ${type} : ${node.data.file_name}`, '是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					handle(path).then(r => {
						if (r.data.code == 1) {
							// 刷新父文件夹
							this.refrashFile(node.parent, true)
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					})
				}).catch(() => {});
			},
			deleteAllOperation(nodes, handle) {

				console.log(nodes);

				this.$confirm(`此操作将永久删除你选择的文件`, '是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					nodes.forEach(node => {
						let path = node.data.file_path
						handle(path).then(r => {
							if (r.data.code == 1) {
								// 刷新父文件夹

								this.$message({
									type: 'success',
									message: '删除选中的文件成功!'
								});
							}
						})
					})
				}).catch(() => {});


			},
			//删除tags，并且删除tags对应的文件 操作 name 类型  node 树节点 handle 指定操作的函数
			deleteTagsOperation(type, tags, handle) {
				let tag = {}
				tags.forEach(ta => {
					if (ta.type === 'primary') tag = ta
				})
				if (!tag.file_path || !tag.is_file) return

				this.deleteOperation(type, tag, handle)
			},
			//创建操作 name 操作名  node 树节点 handle 指定操作的函数
			crateOperation(name, node, handle) {
				let is_file = node.data.is_file
				let path = is_file ? node.parent.data.file_path : node.data.file_path
				this.$prompt('在 ' + path + '/ <br>请输入' + name + '名', '新建' + name, {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					handle(path + "/" + value)
						.then(r => {
							if (r.data.code == 1) {
								this.refrashFile(node, true)
								this.$message({
									type: 'success',
									message: '创建 ' + value + ' ' + name + '成功'
								});
							}
						})

				}).catch(() => {});
			},
			//删除文件
			deleteFile(tags) {
				this.deleteTagsOperation("文件", tags, api.removeFile)
			},
			//创建文件夹
			createFolder(node) {
				this.crateOperation("文件夹", node, api.createFolder)
			},
			//创建文件
			createFile(node) {
				this.crateOperation("文件", node, api.createFile)
			},
			//刷新当前文件夹或者文件 ， nomsg 关闭消息提示
			refrashFile(node, nomsg) {

				if (!node.data) return

				let file = node.data
				//清空当前子节点
				node.childNodes = []

				//如果当前目录为文件夹
				if (!file.is_file) {
					utils.getFiles(file.file_path)
						.then(file_list => {
							file.children = []
							this.showAllFile(file, file_list, file.file_path)
							if (!nomsg) this.message("刷新文件夹成功！", 'success')
						}).catch(e => {

						})

				} else {
					api.openFile(file.file_path)
						.then(r => {
							this.content = r.data.data
							file.content = r.data.data
							if (!nomsg) this.message("刷新文件成功！", 'success')
						})
				}

			},
			//获取文件
			openFile(file) {

				this.current_path = file.file_path

				this.content = '正在加载...'
				console.log(this.tags)
				let hasFile = false
				//如果已经有文件内容，则直接获取文件内容
				this.tags.forEach(data => {
					if (file.file_name === data.file_name) {
						file.content = data.content
						this.content = data.content
						console.log(data.content)
						data.type = 'primary'
						hasFile = true
					} else {
						data.type = 'info'
					}

				})
				//如果没有文件内容，则访问服务器，
				if (!hasFile) {
					api.openFile(file.file_path)
						.then(r => {
							this.content = r.data.data
							file.content = r.data.data

						})
					this.tags.push(Object.assign(file, {
						name: file.file_name,
						type: 'primary'
					}))
				}


			},

			showAllFile(obj, files, path) {

				for (let i = 0; i < files.length; i++) {
					if (files[i].is_file == false) {
						let all_files = {
							children: []
						}
						obj.children.push(Object.assign(files[i], all_files))
					} else {
						obj.children.push(Object.assign(files[i], {
							leaf: true
						}))
					}

				}
			},

			init() {
				let all_files = {
					children: []
				}
				utils.getFiles(config.basePath)
					.then(file_list => {
						this.showAllFile(all_files, file_list, config.basePath)
						let file = {
							file_name: `root(${config.basePath})`,
							file_path: config.basePath,
							is_file: false,
							children: all_files.children
						}
						this.data = [file]
						//渲染完毕后，初始化节点
						this.$nextTick((v => {
							this.current_node = this.$refs.tree.getNode(config.basePath)

							console.log("初始化根节点", this.current_node)
						}))



					}).catch(e => {

					})
			},

			message(message, type) {
				this.$message({
					showClose: true,
					message: message,
					type: type
				});
			},
			router(url){
				this.$router.push(url)
			}

		},




		mounted() {
			this.init()

		},
	}
</script>

<style scoped>
	.tree {

 
		padding: 20px;
		border-right: 1px solid #dcdfe6;
	}

	.ptr {
		cursor: pointer;
	}

	@media screen and (max-width:600px) {
		.adapta-flex{
			display: flex;
			flex-wrap: wrap;
			
		}
		.adapta-item.big {
			display: none;
		}

		.adapta-item.small {
			display: display;
		}
		.hide-text{
			line-height:0;
			font-size:0;
			overflow:hidden;
		}
	 
		
		.adapta-right{
			/* position: absolute;
			    right: 30px;
			width: 50px; */
		}
		
		.adapta{
			width: 100%;
			
		}
	}

	@media screen and (min-width:1200px) {
		.adapta-item.big {
			display: display;
		}

		.adapta-item.small {
			display: none;
		}
		
		.adapta-right{
			border-radius: 10px;padding: 10px; border: 1px solid #dcdfe6; 
		}
		
		
	}
</style>
