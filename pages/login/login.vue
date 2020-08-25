<template>
	<view class="page-container">
		<!-- 手机号 -->
		<view class="c-field">
			<view class="c-field__label">手机号</view>
			<input class="c-field__input" type="number" placeholder-class="c-field__placeholder" placeholder="输入11位手机号" maxlength="11" v-model="userName" />
		</view>
		<!-- 验证码 -->
		<view class="c-field">
			<view class="c-field__label">验证码</view>
			<input class="c-field__input" type="number" placeholder-class="c-field__placeholder" placeholder="输入4位验证码" maxlength="4" v-model="authcode" />
			<button class="sg-button sg-button--square c-field__btn" type="primary" @tap="getSmsCode()">发送验证码</button>
		</view>

		<!-- 登录 -->
		<view class="c-login-container">
			<button class="sg-button c-login-btn" type="primary" :disabled="loginBtnDisabled" @tap="login()">登录</button>
		</view>
		<!-- 注册&忘记密码 -->
		<view class="c-register-container">
			<view class="c-register">
				<view class="c-register__label">还没有账号？</view>
				<view class="c-register__btn" @tap="go('/pages/register/register')">立即注册</view>
			</view>
			<view class="c-forgetpwd" @tap="go('/pages/forget-password/forget-password')">忘记密码</view>
		</view>
	</view>
</template>

<script>
import {UserLoginApi,GetSmsCodeApi} from '../../api/index.js';
export default {
	data() {
		return {
			userName: '',
			authcode: '',
			wxOpenidCode:'',
		};
	},
	onLoad(){
		console.log('login onload');
		console.log(getApp().globalData.uid,getApp().globalData.userInfo);
	},
	computed: {
		loginBtnDisabled() {
			return this.userName.length !== 11 || this.authcode.length !== 4;
		}
	},
	
	methods: {
		go(url) {
			uni.navigateTo({
				url
			});
		},
		
		//登录
		login(){
			const self = this;
			
			// #ifdef MP-WEIXIN
			wx.login({
			  success (res) {
			    if (res.code) {
			      //发起网络请求
			      console.log('获取小程序登录code==' + res.code)
						// UploadWXMPCodeApi(res.code)
						// 	.then(res => {
						// 		console.log('UploadWXMPCodeApi res == ', res);
						// 	})
						// 	.catch(err => {
						// 		console.log('UploadWXMPCodeApi error', err);
						// 	});
						self.wxOpenidCode = res.code;
						self.toLogin();
						
			    } else {
			      console.log('wxmp 登录失败！' + res.errMsg)
			    }
			  }
			});
			// #endif
			
			// #ifdef APP-PLUS
			// console.log('code login post data', postData);
			UserLoginApi(this.userName,this.authcode,'')
				.then(res => {
					console.log('code login success', res);
					if(res.code == '1'){
						uni.setStorage({
						    key: 'global_user_data',
						    data: res.data,
						    success: function () {
						        console.log('global_user_data setStorage success');
						    }
						});
					}
					getApp().globalData.uid = res.data.uid;
					getApp().globalData.userInfo = res.data.userinfo;
					
					uni.switchTab({
					    url: '/pages/index/index'
					});
					
				})
				.catch(err => {
					uni.showToast({
						title: '登录失败' + err,
						icon: 'none'
					});
					console.log('code login error', err);
				});
			// #endif
			
			
		},
		
		
		//login
		toLogin(){
			
			
			UserLoginApi(this.userName,this.authcode,this.wxOpenidCode)
				.then(res => {
					console.log('wx code login success', res);
					if(res.code == '1'){
						uni.setStorage({
						    key: 'global_user_data',
						    data: res.data,
						    success: function () {
						        console.log('global_user_data setStorage success');
						    }
						});
					}
					getApp().globalData.uid = res.data.uid;
					getApp().globalData.userInfo = res.data.userinfo;
					
					uni.switchTab({
					    url: '/pages/index/index'
					});
					
				})
				.catch(err => {
					console.log('wxcode login error', err);
				});
			
			
		},
		
		//获取验证码
		getSmsCode() {
			GetSmsCodeApi(this.userName,'login')
				.then(res => {
					uni.showToast({
					  title: '短信发送成功',
					  icon: 'success',
					  mask: true
					});
					console.log('get code success', res);
				})
				.catch(err => {
					uni.showToast({
						title: '短信发送失败' + err,
						icon: 'none'
					});
					console.log('get code error', err);
				});
		},
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding: 48rpx 24rpx;
}

.c-field {
	width: 100%;
	display: flex;
	height: 100rpx;
	border-radius: 10rpx;
	overflow: hidden;
}
.c-field + .c-field {
	margin-top: 32rpx;
}
.c-field__label {
	min-width: 152rpx;
	height: 100%;
	line-height: 100rpx;
	padding: 0 32upx;
	color: #353535;
	font-size: 28rpx;
	background: #fff;
	@include thin-line-right(#f2f2f2, 0, 0);
}
.c-field__input {
	flex: 1;
	height: 100rpx;
	min-height: 100rpx;
	line-height: 100rpx;
	font-size: 32rpx;
	color: #262626;
	padding: 0 24rpx;
	font-weight: bold;
	background: #fff;
}
.c-field__placeholder {
	color: #bdbdbd;
	font-size: 32rpx;
	font-weight: normal;
}
.c-field__btn {
	width: 228rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 30rpx;
}
// 登录
.c-login-container {
	padding: 0 40rpx;
	margin-top: 300rpx;
}
.c-login-btn {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 34rpx;
	font-weight: bold;
}
// 注册&找回密码
.c-register-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 24rpx;
	padding: 0 40rpx;
}
.c-register {
	display: flex;
	align-items: center;
	line-height: 33rpx;
}
.c-register__label {
	font-size: 24rpx;
	color: #999999;
}
.c-register__btn {
	font-size: 24rpx;
	color: #0076ff;
}
.c-forgetpwd {
	font-size: 24rpx;
	color: #0076ff;
}
.c-register__btn:active,
.c-forgetpwd:active {
	opacity: 0.6;
}
</style>
