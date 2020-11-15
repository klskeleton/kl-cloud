<template>
	<div style="height: 100%;">
		<div class="login-page" v-if="!isShow">
			<div class="login-card">
				<h1 style="color: gainsboro;">登录</h1>
		
				<el-input class="login-input" type="text" v-model="account" placeholder="账号"></el-input>
		
				<el-input class="login-input" type="password" v-model="password" placeholder="密码"></el-input>
		
				<el-button class="login-input login-btn" type="primary" @click="login">登录</el-button>
			</div>
		</div>
		<index v-if="isShow"></index>
	</div>
</template>

<script>
	import api from '../../api/index.js'
	import index from '../index/index.vue'

	export default {
		components:{
			index
		},
		data() {
			return {
				account: '',
				password: '',
				isShow: false


			}
		},
		methods: {
			login() {
				if (this.account != '' && this.password != '') {
					api.login(this.account, this.password)
						.then(r => {
							console.log(r)
							if (r.data.code == 1) {
								this.message("登录成功！", 'success')
								localStorage.login=JSON.stringify({
									account:this.account, 
									password:this.password,
									time: new Date().getTime()
								})
								this.isShow =true
							} else {
								this.message("登录失败！", 'error')
							}
						}).catch(e => {
							console.error(e)
							this.message("服务器错误！", 'error')
						})
				} else {
					this.message("请输入账号密码！", 'error')
				}
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
			if(localStorage.login){
				//超过一天，清除信息
				if(parseInt(new Date().getTime()) - parseInt(JSON.parse(localStorage.login).time) < 24*60*60*1000){
					this.isShow = true
				 }
					
	
			}
			
		},
	}
</script>

<style scoped>
	.login-page {
		background-color: #303133;
		width: 100%;
		height: 100%;
		display: flex;

		justify-content: center;
	}

	.login-card {
		margin: 12%;
		width: 30%;
		/* border: 1px solid white; */
	}

	.login-input {
		margin: 20px 0px 20px 0px;
		width: 80%;

	}


	.login-input.login-btn {
		width: 50%;
	}
</style>
