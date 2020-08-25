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
		<!-- 密码 -->
		<view class="c-field">
			<view class="c-field__label">密码</view>
			<input class="c-field__input" type="text" password placeholder-class="c-field__placeholder" placeholder="输入登录密码" maxlength="16" v-model="password" />
		</view>
		<!-- 确认密码 -->
		<view class="c-field">
			<view class="c-field__label">确认密码</view>
			<input class="c-field__input" type="text" password placeholder-class="c-field__placeholder" placeholder="再次输入登录密码" maxlength="16" v-model="password2" />
		</view>
		<!-- 注册 -->
		<view class="c-register-container"><button class="sg-button c-register-btn" type="primary" :disabled="registerBtnDisabled" @tap="goRegister()">注册</button></view>

		<!-- 登录 -->
		<view class="c-login">
			<view class="c-login__label">已有账号？</view>
			<view class="c-login__btn" @tap="goBack">立即登录</view>
		</view>
	</view>
</template>

<script>
import { GetSmsCodeApi, UserRegisterApi } from '../../api/index.js';
export default {
	data() {
		return {
			userName: '', // 用户名
			authcode: '', // 验证码
			password: '', // 密码
			password2: '' // 确认密码
		};
	},
	computed: {
		registerBtnDisabled() {
			return this.userName.length !== 11 || this.authcode.length !== 4 || this.password.length < 6 || this.password2.length < 6;
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},

		//获取验证码
		getSmsCode() {
			GetSmsCodeApi(this.userName, 'register')
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

		//注册
		goRegister() {
			UserRegisterApi(this.userName, this.authcode, this.password, this.password2)
				.then(res => {
					console.log('get code success', res);
					if (res.code == 1) {
						uni.navigateBack();
						
					} else {
						uni.showToast({
							title: '网络错误，请重试',
							duration: 2000,
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: err,
						duration: 2000,
					});
					// uni.navigateBack();
					console.log('get code error', err);
				});
		}
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding: 48rpx 0;
}

.c-field {
	width: 100%;
	padding: 0 24rpx;
	display: flex;
	height: 100rpx;
}
.c-field + .c-field {
	margin-top: 32rpx;
}
.c-field__label {
	height: 100%;
	min-width: 176rpx;
	line-height: 100rpx;
	padding: 0 32rpx;
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
// 注册
.c-register-container {
	padding: 0 64rpx;
	margin-top: 34rpx;
}
.c-register-btn {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 34rpx;
	font-weight: bold;
}

// 登录
.c-login {
	display: flex;
	align-items: center;
	line-height: 33rpx;
	justify-content: center;
	margin-top: 24rpx;
}
.c-login__label {
	font-size: 24rpx;
	color: #999999;
}
.c-login__btn {
	font-size: 24rpx;
	color: #0076ff;
}
.c-login__btn:active {
	opacity: 0.6;
}
</style>
